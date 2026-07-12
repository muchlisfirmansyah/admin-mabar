import { useState } from "react";
import { Check, Pencil, Play, X } from "lucide-react";
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

  const allIds = [...queuedMatch.teamA, ...queuedMatch.teamB];
  const activeMatches = matches.filter((m) => m.status === "active");
  const isBusy = allIds.some((id) => activeMatches.some((m) => m.players.includes(id)));
  const isCourtFull = activeMatches.length >= numCourts;

  // Lapangan kosong bernomor terkecil — sama dengan pilihan startQueuedMatch
  const usedCourts = new Set(activeMatches.map((m) => m.court));
  let freeCourt: number | undefined;
  for (let c = 1; c <= numCourts; c++) {
    if (!usedCourts.has(c)) {
      freeCourt = c;
      break;
    }
  }

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

      <button
        onClick={() => startQueuedMatch(queuedMatch.id)}
        className={`w-full py-2 font-bold rounded-lg transition flex justify-center items-center gap-2 ${
          isBusy || isCourtFull
            ? "bg-gray-100 text-gray-400 border border-gray-200"
            : "bg-yellow-400 text-black hover:bg-yellow-500"
        }`}
      >
        <Play size={16} />
        {isBusy
          ? "Menunggu Pemain Selesai"
          : isCourtFull
            ? "Lapangan Penuh"
            : `Mulai Main di Lapangan ${freeCourt}`}
      </button>
    </div>
  );
}
