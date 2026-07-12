import type { PlayerLevel } from "../types/mabar";

export const LEVELS: Record<PlayerLevel, { label: string; short: string; score: number; color: string }> = {
  Pemula: { label: "Pemula (C)", short: "C", score: 1, color: "bg-emerald-100 text-emerald-700" },
  Menengah: { label: "Menengah (B)", short: "B", score: 2, color: "bg-blue-100 text-blue-700" },
  Mahir: { label: "Mahir (A)", short: "A", score: 3, color: "bg-purple-100 text-purple-700" },
};

export interface PairingCandidate {
  id: number;
  level: PlayerLevel;
  /** Jumlah main efektif: match nyata + antrean + offset penyeimbang. */
  count: number;
}

export interface PairingResult {
  teamA: number[];
  teamB: number[];
}

const POOL_SIZE = 16;
const MAX_LEVEL_GAP = 1;
const MAX_PLAY_GAP = 1;

/**
 * Cari satu pasangan match 2v2 yang seimbang:
 * - Selisih total skor level antar tim maksimal 1.
 * - Setelah match terbentuk, selisih jumlah main antar semua pemain hadir maksimal 1.
 *
 * `blockingUnits` berisi kelompok pemain yang masih terikat match lain (sedang
 * main di lapangan atau sudah masuk antrean sebelumnya). Kombinasi yang
 * menyentuh lebih sedikit kelompok diprioritaskan, sehingga match antrean bisa
 * langsung dimainkan begitu SATU lapangan selesai — tidak perlu menunggu semua.
 *
 * Dari kandidat terbaik, dipilih satu secara acak. Mengembalikan null jika
 * pemain kurang dari 4 atau tidak ada kombinasi yang memenuhi aturan.
 */
export function generateBalancedMatch(
  candidates: PairingCandidate[],
  blockingUnits: number[][] = []
): PairingResult | null {
  if (candidates.length < 4) return null;

  const sorted = [...candidates].sort((a, b) => a.count - b.count);
  const pool = sorted.slice(0, POOL_SIZE);

  const blockingSets = blockingUnits.map((unit) => new Set(unit));
  const dependencyCount = (ids: number[]) =>
    blockingSets.filter((unit) => ids.some((id) => unit.has(id))).length;

  const validMatches: (PairingResult & { dependencies: number })[] = [];

  for (let i = 0; i < pool.length - 3; i++) {
    for (let j = i + 1; j < pool.length - 2; j++) {
      for (let k = j + 1; k < pool.length - 1; k++) {
        for (let l = k + 1; l < pool.length; l++) {
          const four = [pool[i], pool[j], pool[k], pool[l]];
          const pairings: [PairingCandidate[], PairingCandidate[]][] = [
            [[four[0], four[1]], [four[2], four[3]]],
            [[four[0], four[2]], [four[1], four[3]]],
            [[four[0], four[3]], [four[1], four[2]]],
          ];

          const selectedIds = new Set(four.map((p) => p.id));
          const projected = sorted.map((p) => (selectedIds.has(p.id) ? p.count + 1 : p.count));
          const playGap = Math.max(...projected) - Math.min(...projected);
          if (playGap > MAX_PLAY_GAP) continue;

          for (const [teamA, teamB] of pairings) {
            const scoreA = LEVELS[teamA[0].level].score + LEVELS[teamA[1].level].score;
            const scoreB = LEVELS[teamB[0].level].score + LEVELS[teamB[1].level].score;
            if (Math.abs(scoreA - scoreB) <= MAX_LEVEL_GAP) {
              validMatches.push({
                teamA: teamA.map((p) => p.id),
                teamB: teamB.map((p) => p.id),
                dependencies: dependencyCount([...four].map((p) => p.id)),
              });
            }
          }
        }
      }
    }
  }

  if (validMatches.length === 0) return null;

  // Ambil hanya kombinasi dengan ketergantungan paling sedikit, lalu acak
  const minDeps = Math.min(...validMatches.map((m) => m.dependencies));
  const best = validMatches.filter((m) => m.dependencies === minDeps);
  const picked = best[Math.floor(Math.random() * best.length)];
  return { teamA: picked.teamA, teamB: picked.teamB };
}

/**
 * Buat beberapa match antrean sekaligus. Karena pilihan match pertama bisa
 * menyisakan kombinasi pemain yang tidak seimbang untuk match berikutnya,
 * fungsi ini mencoba ulang dari awal beberapa kali dan mengembalikan hasil
 * terbanyak yang berhasil dibuat.
 */
export function generateBalancedMatches(
  base: PairingCandidate[],
  count: number,
  blockingUnits: number[][] = [],
  attempts = 15
): PairingResult[] {
  let best: PairingResult[] = [];

  for (let attempt = 0; attempt < attempts; attempt++) {
    const counts = new Map(base.map((p) => [p.id, p.count]));
    const units = [...blockingUnits];
    const result: PairingResult[] = [];

    for (let i = 0; i < count; i++) {
      const candidates = base.map((p) => ({ ...p, count: counts.get(p.id)! }));
      const match = generateBalancedMatch(candidates, units);
      if (!match) break;
      result.push(match);
      const ids = [...match.teamA, ...match.teamB];
      ids.forEach((id) => counts.set(id, counts.get(id)! + 1));
      units.push(ids);
    }

    if (result.length === count) return result;
    if (result.length > best.length) best = result;
  }

  return best;
}
