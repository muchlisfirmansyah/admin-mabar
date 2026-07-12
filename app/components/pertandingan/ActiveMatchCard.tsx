import { Check, Minus, Plus, Trash2 } from "lucide-react";
import { useMabar } from "../../context/MabarContext";
import { splitTeams } from "../../lib/match";
import type { Match } from "../../types/mabar";

interface ActiveMatchCardProps {
  match: Match;
}

export function ActiveMatchCard({ match }: ActiveMatchCardProps) {
  const { players, updateKok, updateScore, finishMatch, deleteMatch } = useMabar();
  const { teamA, teamB } = splitTeams(match);

  const playerName = (id: number) => players.find((p) => p.id === id)?.name || "?";

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-3 border-b pb-2">
        <span className="text-xs font-bold bg-emerald-100 px-2 py-1 rounded text-emerald-700">
          {match.court ? `Lapangan ${match.court}` : "Aktif"}
        </span>
        <button onClick={() => deleteMatch(match.id)} className="text-red-400 hover:text-red-600">
          <Trash2 size={16} />
        </button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col items-center flex-1">
          {teamA.map((playerId) => (
            <span key={playerId} className="font-semibold text-gray-800 text-sm">
              {playerName(playerId)}
            </span>
          ))}
          <input
            type="number"
            min="0"
            value={match.scoreA || ""}
            onChange={(e) => updateScore(match.id, "scoreA", e.target.value)}
            placeholder="0"
            className="mt-2 w-16 text-center text-xl font-black border-b-2 border-gray-200 focus:border-yellow-400 outline-none pb-1"
          />
        </div>
        <div className="px-2 font-black text-gray-300 italic">VS</div>
        <div className="flex flex-col items-center flex-1">
          {teamB.map((playerId) => (
            <span key={playerId} className="font-semibold text-gray-800 text-sm">
              {playerName(playerId)}
            </span>
          ))}
          <input
            type="number"
            min="0"
            value={match.scoreB || ""}
            onChange={(e) => updateScore(match.id, "scoreB", e.target.value)}
            placeholder="0"
            className="mt-2 w-16 text-center text-xl font-black border-b-2 border-gray-200 focus:border-yellow-400 outline-none pb-1"
          />
        </div>
      </div>

      <div className="flex items-center justify-between bg-yellow-50 p-3 rounded-lg border border-yellow-200 mb-3">
        <span className="font-bold text-yellow-800 text-sm">Kok Terpakai:</span>
        <div className="flex items-center gap-4">
          <button
            onClick={() => updateKok(match.id, -1)}
            className="bg-white p-1.5 rounded-full shadow-sm text-gray-600 hover:bg-gray-50 border border-gray-200"
          >
            <Minus size={18} />
          </button>
          <span className="font-bold text-lg w-6 text-center">{match.shuttlecocks}</span>
          <button
            onClick={() => updateKok(match.id, 1)}
            className="bg-yellow-400 p-1.5 rounded-full shadow-sm text-black hover:bg-yellow-500"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      <button
        onClick={() => finishMatch(match.id)}
        className="w-full py-2 bg-black text-yellow-400 font-bold rounded-lg hover:bg-zinc-800 transition flex justify-center items-center gap-2"
      >
        <Check size={18} strokeWidth={3} /> Selesai & Simpan Score
      </button>
    </div>
  );
}
