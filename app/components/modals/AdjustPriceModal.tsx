import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import type { PlayerStat } from "../../types/mabar";

interface AdjustPriceModalProps {
  player: PlayerStat;
  onSave: (amount: number) => void;
  onClose: () => void;
}

type AdjustmentMode = "diskon" | "tambahan";

export function AdjustPriceModal({ player, onSave, onClose }: AdjustPriceModalProps) {
  const initial = player.adjustment || 0;
  const [mode, setMode] = useState<AdjustmentMode>(initial < 0 ? "diskon" : "tambahan");
  const [amount, setAmount] = useState(Math.abs(initial));

  const signedAmount = mode === "diskon" ? -Math.abs(amount) : Math.abs(amount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full animate-in fade-in zoom-in-95 duration-200 border-t-4 border-blue-500">
        <h3 className="text-lg font-black text-gray-900 mb-1">Penyesuaian Harga</h3>
        <p className="text-sm text-gray-500 mb-4">
          Atur potongan/tambahan harga khusus untuk{" "}
          <span className="font-bold text-black">{player.name}</span>
        </p>

        <div className="flex bg-gray-100 p-1 rounded-lg mb-3">
          <button
            onClick={() => setMode("diskon")}
            className={`flex-1 py-1.5 rounded-md flex items-center justify-center gap-1 text-xs font-bold transition-all ${
              mode === "diskon"
                ? "bg-white text-red-600 shadow"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Minus size={14} /> Diskon
          </button>
          <button
            onClick={() => setMode("tambahan")}
            className={`flex-1 py-1.5 rounded-md flex items-center justify-center gap-1 text-xs font-bold transition-all ${
              mode === "tambahan"
                ? "bg-white text-emerald-600 shadow"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Plus size={14} /> Tambahan
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-bold text-gray-700 mb-1">
            Nominal {mode === "diskon" ? "Diskon" : "Tambahan"} (Rp)
          </label>
          <input
            type="number"
            min="0"
            value={amount || ""}
            onChange={(e) => setAmount(Math.abs(Number(e.target.value)))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Contoh: 10000"
          />
          <p className="text-[10px] text-gray-400 mt-1">
            {mode === "diskon"
              ? "Tagihan pemain akan dikurangi sebesar nominal ini."
              : "Tagihan pemain akan ditambah sebesar nominal ini."}
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 text-sm font-bold hover:bg-gray-100 rounded-lg transition"
          >
            Batal
          </button>
          <button
            onClick={() => onSave(signedAmount)}
            className="px-4 py-2 text-sm font-bold rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
