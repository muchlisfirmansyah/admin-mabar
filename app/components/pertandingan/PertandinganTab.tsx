import { useState } from "react";
import { Hand, LandPlot, ListOrdered, Shuffle } from "lucide-react";
import { useMabar } from "../../context/MabarContext";
import { MabarSettingsForm } from "../tagihan/MabarSettingsForm";
import { ActiveMatchCard } from "./ActiveMatchCard";
import { QueuedMatchCard } from "./QueuedMatchCard";

type PairingMode = "otomatis" | "manual";

export function PertandinganTab() {
  const {
    players,
    matches,
    selectedPlayers,
    toggleSelectPlayer,
    createMatch,
    queue,
    generateMatches,
    numCourts,
  } = useMabar();
  const [generateCount, setGenerateCount] = useState(1);
  const [pairingMode, setPairingMode] = useState<PairingMode>("otomatis");

  const presentPlayers = players.filter((p) => p.present);
  const selectedCount = selectedPlayers.length;
  const activeMatches = matches.filter((m) => m.status !== "finished");
  const courts = Array.from({ length: numCourts }, (_, i) => i + 1);
  // Match aktif tanpa nomor lapangan valid (mis. jumlah lapangan dikurangi saat match berjalan)
  const unassignedMatches = activeMatches.filter((m) => !m.court || m.court > numCourts);

  return (
    <div className="p-4 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* --- PENGATURAN MABAR --- */}
      <MabarSettingsForm />

      {/* --- LAPANGAN / SEDANG MAIN --- */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-gray-800 px-1 flex items-center gap-2">
          <LandPlot size={20} className="text-emerald-600" /> Lapangan (
          {activeMatches.length}/{numCourts} Terpakai)
        </h2>
        {presentPlayers.length < numCourts * 4 && (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            Pemain hadir {presentPlayers.length} orang — untuk {numCourts} lapangan
            jalan bersamaan butuh {numCourts * 4} pemain. Saat ini maksimal{" "}
            {Math.max(1, Math.floor(presentPlayers.length / 4))} match bisa main paralel.
          </p>
        )}
        {courts.map((court) => {
          const match = activeMatches.find((m) => m.court === court);
          return match ? (
            <ActiveMatchCard key={court} match={match} />
          ) : (
            <div
              key={court}
              className="border-2 border-dashed border-emerald-200 bg-emerald-50/50 rounded-xl p-4 text-center"
            >
              <span className="text-sm font-bold text-emerald-600">
                Lapangan {court} — Tersedia
              </span>
            </div>
          );
        })}
        {unassignedMatches.map((match) => (
          <ActiveMatchCard key={match.id} match={match} />
        ))}
      </div>

      {/* --- MODE PAIRING --- */}
      <div className="flex bg-gray-200 p-1 rounded-xl">
        <button
          onClick={() => setPairingMode("otomatis")}
          className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-bold transition-all ${
            pairingMode === "otomatis"
              ? "bg-white text-gray-800 shadow"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Shuffle size={16} /> Pairing Otomatis
        </button>
        <button
          onClick={() => setPairingMode("manual")}
          className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-bold transition-all ${
            pairingMode === "manual"
              ? "bg-white text-gray-800 shadow"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Hand size={16} /> Input Manual
        </button>
      </div>

      {pairingMode === "otomatis" ? (
        <>
          {/* --- AUTO-PAIRING --- */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-4">
              Tim dipasangkan seimbang: selisih level & jumlah main maksimal 1. Hasil
              generate tetap bisa diedit sebelum dimainkan.
            </p>
            <div className="flex gap-2">
              <select
                value={generateCount}
                onChange={(e) => setGenerateCount(Number(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>
                    {n} Match
                  </option>
                ))}
              </select>
              <button
                onClick={() => generateMatches(generateCount)}
                className="flex-1 py-2 bg-black text-yellow-400 font-bold rounded-lg hover:bg-zinc-800 transition flex justify-center items-center gap-2"
              >
                <Shuffle size={18} /> Generate Antrean
              </button>
            </div>
          </div>

          {/* --- ANTREAN --- */}
          {queue.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-gray-800 px-1 flex items-center gap-2">
                <ListOrdered size={20} className="text-blue-500" /> Antrean ({queue.length})
              </h2>
              {queue.map((queuedMatch, idx) => (
                <QueuedMatchCard
                  key={queuedMatch.id}
                  queuedMatch={queuedMatch}
                  position={idx + 1}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        /* --- BUAT MANUAL --- */
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-4">
            Pilih 2 - 4 pemain yang akan bertanding (Terpilih: {selectedCount}/4)
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {presentPlayers.map((player) => {
              const isSelected = selectedPlayers.includes(player.id);
              const isBusy = activeMatches.some((m) => m.players.includes(player.id));

              return (
                <button
                  key={player.id}
                  onClick={() => toggleSelectPlayer(player.id)}
                  disabled={isBusy}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                    isBusy
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200 opacity-60"
                      : isSelected
                        ? "bg-black text-yellow-400 shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {player.name}{" "}
                  {isBusy && <span className="text-[10px] font-normal ml-1">(Main)</span>}
                </button>
              );
            })}
          </div>

          <button
            onClick={createMatch}
            className={`w-full py-3 rounded-xl font-bold transition-all ${
              selectedCount >= 2
                ? "bg-yellow-400 text-black hover:bg-yellow-500 shadow-md"
                : "bg-gray-300 text-white"
            }`}
          >
            Mulai Pertandingan
          </button>
        </div>
      )}
    </div>
  );
}
