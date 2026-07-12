import { History, Trophy } from "lucide-react";
import { useMabar } from "../../context/MabarContext";
import { FinishedMatchCard } from "./FinishedMatchCard";
import { Leaderboard } from "./Leaderboard";

export function RekapTab() {
  const { matches, playerStats, totalKokUsed } = useMabar();

  const finishedMatches = matches.filter((m) => m.status === "finished");
  const activePlayers = Object.values(playerStats)
    .filter((p) => p.matchesPlayed > 0)
    .sort((a, b) => b.matchesPlayed - a.matchesPlayed);

  return (
    <div className="p-4 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* --- STATISTIK MABAR --- */}
      <h2 className="text-lg font-bold text-gray-800 mb-2 px-1">Statistik Permainan</h2>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
          <span className="text-gray-600 font-medium text-sm">Total Kok Terpakai:</span>
          <span className="text-xl font-black text-yellow-600">
            {totalKokUsed} <span className="text-sm font-normal text-gray-500">pcs</span>
          </span>
        </div>

        <div>
          <span className="text-gray-600 font-medium text-sm block mb-2">
            Total Main per Pemain:
          </span>
          {activePlayers.length === 0 ? (
            <span className="text-xs text-gray-400 italic">Belum ada pemain yang bertanding.</span>
          ) : (
            <div className="flex flex-wrap gap-2">
              {activePlayers.map((p) => (
                <div
                  key={p.id}
                  className="bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-2"
                >
                  <span className="text-sm font-bold text-gray-800">{p.name}</span>
                  <span className="bg-yellow-400 text-black text-xs font-black px-2 py-0.5 rounded">
                    {p.matchesPlayed}x
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- KLASEMEN --- */}
      <h2 className="text-lg font-bold text-gray-800 mb-2 px-1 mt-6 flex items-center gap-2">
        <Trophy size={20} className="text-yellow-500" /> Klasemen
      </h2>
      <Leaderboard />

      {/* --- RIWAYAT PERTANDINGAN --- */}
      <h2 className="text-lg font-bold text-gray-800 mb-4 px-1 mt-6">Riwayat Pertandingan</h2>

      {finishedMatches.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
          <History size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 text-sm">Belum ada pertandingan yang selesai.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {finishedMatches.map((match) => (
            <FinishedMatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}
