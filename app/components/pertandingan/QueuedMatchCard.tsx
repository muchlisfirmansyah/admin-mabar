import { useState } from "react";
import { Check, MapPin, Pencil, Play, X } from "lucide-react";
import { useMabar } from "../../context/MabarContext";
import { LEVELS } from "../../lib/pairing";
import type { QueuedMatch } from "../../types/mabar";

interface QueuedMatchCardProps {
  queuedMatch: QueuedMatch;
  position: number;
}

export function QueuedMatchCard({ queuedMatch, position }: QueuedMatchCardProps) {
  const {
    players,
    matches,
    startQueuedMatch,
    cancelQueuedMatch,
    updateQueuedPlayer,
    numCourts,
  } = useMabar();
  const [isEditing, setIsEditing] = useState(false);
  // "auto" = main di lapangan kosong mana pun; angka = lapangan pilihan
  const [selectedCourt, setSelectedCourt] = useState<"auto" | number>("auto");

  const allIds = [...queuedMatch.teamA, ...queuedMatch.teamB];
  const activeMatches = matches.filter((m) => m.status === "active");
  const isBusy = allIds.some((id) => activeMatches.some((m) => m.players.includes(id)));

  // Lapangan kosong bernomor terkecil — sama dengan pilihan startQueuedMatch
  const usedCourts = new Set(activeMatches.map((m) => m.court));
  let freeCourt: number | undefined;
  for (let c = 1; c <= numCourts; c++) {
    if (!usedCourts.has(c)) {
      freeCourt = c;
      break;
    }
  }

  const hasFreeCourt = freeCourt !== undefined;
  const isSelectedCourtUsed = selectedCourt !== "auto" && usedCourts.has(selectedCourt);
  const disabledReasons: string[] = [];

  if (isBusy) {
    const blockingPlayers = allIds.filter((id) => activeMatches.some((m) => m.players.includes(id)));
    const names = blockingPlayers
      .map((id) => players.find((player) => player.id === id)?.name)
      .filter((name): name is string => Boolean(name));

    if (names.length > 0) {
      disabledReasons.push(`Pemain ${names.join(", ")} masih bermain`);
    } else {
      disabledReasons.push("Ada pemain di antrean ini yang masih bermain");
    }
  }

  if (!hasFreeCourt && selectedCourt === "auto") {
    disabledReasons.push("Tidak ada lapangan kosong saat ini");
  }

  if (selectedCourt !== "auto" && isSelectedCourtUsed) {
    disabledReasons.push(`Lapangan ${selectedCourt} masih dipakai`);
  }

  const isDisabled = disabledReasons.length > 0;

  const buttonLabel = isBusy
    ? "Menunggu Pemain Selesai"
    : !hasFreeCourt && selectedCourt === "auto"
      ? "Lapangan Penuh"
      : isSelectedCourtUsed
        ? `Lapangan ${selectedCourt} Masih Dipakai`
        : selectedCourt === "auto"
          ? `Mulai Main di Lapangan ${freeCourt}`
          : `Mulai Main di Lapangan ${selectedCourt}`;

  const renderPlayer = (id: number) => {
    const player = players.find((p) => p.id === id);
    if (!player) return null;
    return (
      <span key={id} className="text-sm font-semibold text-gray-800">
        {player.name}{" "}
        <span className="text-[10px] font-bold text-gray-400">
          ({LEVELS[player.level].short})
        </span>
      </span>
    );
  };

  const renderSlot = (team: "teamA" | "teamB", index: number) => {
    const currentId = queuedMatch[team][index];
    const usedElsewhere = allIds.filter((id) => id !== currentId);
    const options = players.filter(
      (p) => (p.present && !usedElsewhere.includes(p.id)) || p.id === currentId
    );
    return (
      <select
        key={`${team}-${index}`}
        value={currentId}
        onChange={(e) => updateQueuedPlayer(queuedMatch.id, team, index, Number(e.target.value))}
        className="w-full text-sm font-semibold text-gray-800 border border-gray-300 rounded-lg px-2 py-1.5 mb-1 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
      >
        {options.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} ({LEVELS[p.level].short})
          </option>
        ))}
      </select>
    );
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-3 border-b pb-2">
        <span className="text-xs font-bold bg-blue-100 px-2 py-1 rounded text-blue-700">
          Antrean #{position}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsEditing((prev) => !prev)}
            className={`p-1.5 rounded-lg transition-colors ${
              isEditing
                ? "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            }`}
            title={isEditing ? "Selesai edit" : "Edit pemain"}
          >
            {isEditing ? <Check size={16} strokeWidth={3} /> : <Pencil size={16} />}
          </button>
          <button
            onClick={() => cancelQueuedMatch(queuedMatch.id)}
            className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
            title="Batalkan antrean"
          >
            <X size={16} strokeWidth={3} />
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="flex justify-between items-center mb-3 gap-2">
          <div className="flex flex-col flex-1">
            {queuedMatch.teamA.map((_, idx) => renderSlot("teamA", idx))}
          </div>
          <div className="px-1 font-black text-gray-300 italic">VS</div>
          <div className="flex flex-col flex-1">
            {queuedMatch.teamB.map((_, idx) => renderSlot("teamB", idx))}
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center mb-3">
          <div className="flex flex-col items-center flex-1">
            {queuedMatch.teamA.map(renderPlayer)}
          </div>
          <div className="px-2 font-black text-gray-300 italic">VS</div>
          <div className="flex flex-col items-center flex-1">
            {queuedMatch.teamB.map(renderPlayer)}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 mb-2">
        <MapPin size={14} className="text-gray-400 shrink-0" />
        <select
          value={selectedCourt}
          onChange={(e) =>
            setSelectedCourt(e.target.value === "auto" ? "auto" : Number(e.target.value))
          }
          className="flex-1 text-xs font-semibold text-gray-700 border border-gray-300 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          <option value="auto">Otomatis (lapangan kosong mana pun)</option>
          {Array.from({ length: numCourts }, (_, i) => i + 1).map((c) => (
            <option key={c} value={c}>
              Lapangan {c}
              {usedCourts.has(c) ? " — masih dipakai" : ""}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={() =>
          startQueuedMatch(
            queuedMatch.id,
            selectedCourt === "auto" ? undefined : selectedCourt
          )
        }
        disabled={isDisabled}
        className={`w-full py-2 font-bold rounded-lg transition flex justify-center items-center gap-2 ${
          isDisabled
            ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
            : "bg-yellow-400 text-black hover:bg-yellow-500"
        }`}
      >
        <Play size={16} />
        {buttonLabel}
      </button>

      {isDisabled && (
        <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-2 text-[11px] text-amber-700">
          <div className="mb-1 font-semibold">Alasan tombol dinonaktifkan:</div>
          <ul className="list-disc pl-4 space-y-0.5">
            {disabledReasons.map((reason, index) => (
              <li key={`${reason}-${index}`}>{reason}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
