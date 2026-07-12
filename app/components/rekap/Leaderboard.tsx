import { Medal, Trophy } from "lucide-react";
import { useMabar } from "../../context/MabarContext";
import { splitTeams } from "../../lib/match";
import { LEVELS } from "../../lib/pairing";

interface Standing {
  id: number;
  name: string;
  level: string;
  played: number;
  win: number;
  lose: number;
  pointDiff: number;
}

export function Leaderboard() {
  const { players, matches } = useMabar();

  const standings: Record<number, Standing> = {};
  players.forEach((p) => {
    standings[p.id] = {
      id: p.id,
      name: p.name,
      level: LEVELS[p.level].short,
      played: 0,
      win: 0,
      lose: 0,
      pointDiff: 0,
    };
  });

  matches
    .filter((m) => m.status === "finished")
    .forEach((match) => {
      const { teamA, teamB } = splitTeams(match);
      const diff = Math.abs(match.scoreA - match.scoreB);
      const teamAWin = match.scoreA > match.scoreB;
      const teamBWin = match.scoreB > match.scoreA;

      teamA.forEach((id) => {
        const s = standings[id];
        if (!s) return;
        s.played += 1;
        if (teamAWin) {
          s.win += 1;
          s.pointDiff += diff;
        } else if (teamBWin) {
          s.lose += 1;
          s.pointDiff -= diff;
        }
      });
      teamB.forEach((id) => {
        const s = standings[id];
        if (!s) return;
        s.played += 1;
        if (teamBWin) {
          s.win += 1;
          s.pointDiff += diff;
        } else if (teamAWin) {
          s.lose += 1;
          s.pointDiff -= diff;
        }
      });
    });

  const ranked = Object.values(standings)
    .filter((s) => s.played > 0)
    .sort((a, b) => (b.win !== a.win ? b.win - a.win : b.pointDiff - a.pointDiff));

  const rankIcon = (idx: number) => {
    if (idx === 0) return <Trophy size={18} className="mx-auto text-yellow-500" />;
    if (idx === 1) return <Medal size={18} className="mx-auto text-gray-400" />;
    if (idx === 2) return <Medal size={18} className="mx-auto text-amber-700" />;
    return <span className="text-gray-400 font-bold">{idx + 1}</span>;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {ranked.length === 0 ? (
        <p className="text-center p-6 text-sm text-gray-400">
          Belum ada pertandingan yang selesai.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
              <tr>
                <th className="p-3 font-semibold text-center w-10">#</th>
                <th className="p-3 font-semibold">Pemain</th>
                <th className="p-3 font-semibold text-center">M</th>
                <th className="p-3 font-semibold text-center">W</th>
                <th className="p-3 font-semibold text-center">L</th>
                <th className="p-3 font-semibold text-center">+/-</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ranked.map((s, idx) => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3 text-center">{rankIcon(idx)}</td>
                  <td className="p-3 font-bold text-gray-800">
                    {s.name}{" "}
                    <span className="text-[9px] font-bold bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded text-gray-500">
                      {s.level}
                    </span>
                  </td>
                  <td className="p-3 text-center font-bold text-gray-600">{s.played}</td>
                  <td className="p-3 text-center font-black text-emerald-600">{s.win}</td>
                  <td className="p-3 text-center font-black text-red-400">{s.lose}</td>
                  <td className="p-3 text-center font-black text-blue-600">
                    {s.pointDiff > 0 ? `+${s.pointDiff}` : s.pointDiff}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
