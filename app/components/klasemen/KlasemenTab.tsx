import { Trophy } from "lucide-react";
import { Leaderboard } from "./Leaderboard";

export function KlasemenTab() {
  return (
    <div className="p-4 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <h2 className="text-lg font-bold text-gray-800 mb-2 px-1 flex items-center gap-2">
        <Trophy size={20} className="text-yellow-500" /> Klasemen
      </h2>
      <Leaderboard />
    </div>
  );
}
