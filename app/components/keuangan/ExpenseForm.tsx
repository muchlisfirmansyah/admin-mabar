import { PieChart } from "lucide-react";
import { useMabar } from "../../context/MabarContext";
import { formatNumberInput, parseNumberInput } from "../../lib/format";

export function ExpenseForm() {
  const {
    expKokSlopQty,
    setExpKokSlopQty,
    expKokSlopPrice,
    setExpKokSlopPrice,
    expKokSatuanQty,
    setExpKokSatuanQty,
    expKokSatuanPrice,
    setExpKokSatuanPrice,
    expLapangan,
    setExpLapangan,
    expLain,
    setExpLain,
  } = useMabar();

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 print:hidden">
      <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <PieChart size={20} className="text-red-500" /> Catat Pengeluaran
      </h2>

      <div className="space-y-4">
        <div className="border border-gray-100 p-3 rounded-lg bg-gray-50">
          <label className="block text-xs font-bold text-gray-800 mb-2">Beli Kok (Slop)</label>
          <div className="flex gap-2">
            <div className="w-1/3">
              <label className="text-[10px] text-gray-500">Jml Slop</label>
              <input
                type="text"
                inputMode="numeric"
                value={expKokSlopQty === 0 ? "" : formatNumberInput(expKokSlopQty)}
                onChange={(e) => setExpKokSlopQty(parseNumberInput(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm outline-none bg-white"
              />
            </div>
            <div className="flex-1">
              <label className="text-[10px] text-gray-500">Harga per Slop (Rp)</label>
              <input
                type="text"
                inputMode="numeric"
                value={expKokSlopPrice === 0 ? "" : formatNumberInput(expKokSlopPrice)}
                onChange={(e) => setExpKokSlopPrice(parseNumberInput(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm outline-none bg-white"
              />
            </div>
          </div>
        </div>

        <div className="border border-gray-100 p-3 rounded-lg bg-gray-50">
          <label className="block text-xs font-bold text-gray-800 mb-2">
            Beli Kok (Satuan/Ecer)
          </label>
          <div className="flex gap-2">
            <div className="w-1/3">
              <label className="text-[10px] text-gray-500">Jml Satuan</label>
              <input
                type="text"
                inputMode="numeric"
                value={expKokSatuanQty === 0 ? "" : formatNumberInput(expKokSatuanQty)}
                onChange={(e) => setExpKokSatuanQty(parseNumberInput(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm outline-none bg-white"
              />
            </div>
            <div className="flex-1">
              <label className="text-[10px] text-gray-500">Harga per Satuan (Rp)</label>
              <input
                type="text"
                inputMode="numeric"
                value={expKokSatuanPrice === 0 ? "" : formatNumberInput(expKokSatuanPrice)}
                onChange={(e) => setExpKokSatuanPrice(parseNumberInput(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm outline-none bg-white"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Sewa Lapangan Total (Rp)
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={expLapangan === 0 ? "" : formatNumberInput(expLapangan)}
            onChange={(e) => setExpLapangan(parseNumberInput(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Pengeluaran Lain-lain (Minum, Parkir, dll)
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={expLain === 0 ? "" : formatNumberInput(expLain)}
            onChange={(e) => setExpLain(parseNumberInput(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
          />
        </div>
      </div>
    </div>
  );
}
