import type { Match } from "../types/mabar";

export const splitTeams = (match: Match) => {
  const half = Math.ceil(match.players.length / 2);
  return {
    teamA: match.players.slice(0, half),
    teamB: match.players.slice(half),
  };
};
