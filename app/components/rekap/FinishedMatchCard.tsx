import { Trash2 } from "lucide-react";
import { useMabar } from "../../context/MabarContext";
import { splitTeams } from "../../lib/match";
import type { Match } from "../../types/mabar";

interface FinishedMatchCardProps {
  match: Match;
}

export function FinishedMatchCard({ match }: FinishedMatchCardProps) {
  const { players, deleteMatch } = useMabar();
  const { teamA, teamB } = splitTeams(match);
  const isTeamAWon = match.scoreA > match.scoreB;
  const isTeamBWon = match.scoreB > match.scoreA;

  const playerName = (id: number) => players.find((p) => p.id === id)?.name || "?";

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-3 border-b pb-2">
        <span className="text-xs font-bold bg-yellow-100 px-2 py-1 rounded text-yellow-700">
          Selesai
        </span>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 font-medium">{match.shuttlecocks} Kok</span>
          <button onClick={() => deleteMatch(match.id)} className="text-red-400 hover:text-red-600">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div
          className={`flex flex-col items-center flex-1 ${
            isTeamAWon ? "text-yellow-600" : "text-gray-600"
          }`}
        >
          {teamA.map((playerId) => (
            <span key={playerId} className={`text-sm ${isTeamAWon ? "font-black" : "font-medium"}`}>
              {playerName(playerId)}
            </span>
          ))}
          <span
            className={`text-3xl font-black mt-1 ${isTeamAWon ? "text-yellow-500" : "text-gray-400"}`}
          >
            {match.scoreA}
          </span>
        </div>

        <div className="px-2 font-black text-gray-200">VS</div>

        <div
          className={`flex flex-col items-center flex-1 ${
            isTeamBWon ? "text-yellow-600" : "text-gray-600"
          }`}
        >
          {teamB.map((playerId) => (
            <span key={playerId} className={`text-sm ${isTeamBWon ? "font-black" : "font-medium"}`}>
              {playerName(playerId)}
            </span>
          ))}
          <span
            className={`text-3xl font-black mt-1 ${isTeamBWon ? "text-yellow-500" : "text-gray-400"}`}
          >
            {match.scoreB}
          </span>
        </div>
      </div>
    </div>
  );
}
