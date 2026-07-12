import { useState } from "react";
import type { PlayerStat } from "../../types/mabar";

interface AdjustPriceModalProps {
  player: PlayerStat;
  onSave: (amount: number) => void;
  onClose: () => void;
}

export function AdjustPriceModal({ player, onSave, onClose }: AdjustPriceModalProps) {
  const [amount, setAmount] = useState(player.adjustment || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full animate-in fade-in zoom-in-95 duration-200 border-t-4 border-blue-500">
        <h3 className="text-lg font-black text-gray-900 mb-1">Penyesuaian Harga</h3>
        <p className="text-sm text-gray-500 mb-4">
          Atur potongan/tambahan harga khusus untuk{" "}
          <span className="font-bold text-black">{player.name}</span>
        </p>

        <div className="mb-4">
          <label className="block text-xs font-bold text-gray-700 mb-1">
            Nominal Adjustment (Rp)
          </label>
          <input
            type="number"
            value={amount || ""}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Gunakan minus (-) untuk diskon"
          />
          <p className="text-[10px] text-gray-400 mt-1">
            Gunakan angka minus (contoh: -10000) untuk diskon.
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
            onClick={() => onSave(amount)}
            className="px-4 py-2 text-sm font-bold rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
