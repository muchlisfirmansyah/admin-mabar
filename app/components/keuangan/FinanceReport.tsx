import { useMabar } from "../../context/MabarContext";
import { formatDate, formatRp } from "../../lib/format";

export const FINANCE_REPORT_ID = "struk-keuangan";

export function FinanceReport() {
  const {
    pbName,
    matchDate,
    totalBiayaTerkumpul,
    expKokSlopQty,
    expKokSlopPrice,
    expKokSatuanQty,
    expKokSatuanPrice,
    expLapangan,
    expLain,
    totalPengeluaranKokSlop,
    totalPengeluaranKokSatuan,
    totalPengeluaran,
    saldoAkhir,
  } = useMabar();

  return (
    <div
      id={FINANCE_REPORT_ID}
      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 print:shadow-none print:border-none print:p-0 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-2 bg-black print:hidden"></div>

      <div className="text-center mb-6 mt-2">
        <h2 className="text-2xl font-black text-gray-800 uppercase tracking-wide">
          Laporan Keuangan
        </h2>
        {pbName && <p className="text-base font-bold text-gray-900 mt-2">{pbName}</p>}
        {matchDate && <p className="text-xs text-gray-500 mt-1">{formatDate(matchDate)}</p>}
      </div>

      {/* Bagian Pendapatan */}
      <div className="mb-4">
        <h3 className="text-xs font-bold text-green-600 uppercase tracking-wider mb-2 border-b border-gray-200 pb-1">
          Pendapatan
        </h3>
        <div className="flex justify-between items-center py-1">
          <span className="text-sm font-medium text-gray-700">Total Uang Kas Masuk</span>
          <span className="font-bold text-gray-900">{formatRp(totalBiayaTerkumpul)}</span>
        </div>
      </div>

      {/* Bagian Pengeluaran */}
      <div className="mb-4">
        <h3 className="text-xs font-bold text-red-500 uppercase tracking-wider mb-2 border-b border-gray-200 pb-1">
          Pengeluaran
        </h3>
        <div className="space-y-2">
          {expKokSlopQty > 0 && (
            <div className="flex justify-between items-center py-1">
              <span className="text-sm text-gray-600">
                Kok ({expKokSlopQty} slop @ {formatRp(expKokSlopPrice)})
              </span>
              <span className="font-medium text-gray-800">{formatRp(totalPengeluaranKokSlop)}</span>
            </div>
          )}
          {expKokSatuanQty > 0 && (
            <div className="flex justify-between items-center py-1">
              <span className="text-sm text-gray-600">
                Kok Ecer ({expKokSatuanQty} pcs @ {formatRp(expKokSatuanPrice)})
              </span>
              <span className="font-medium text-gray-800">
                {formatRp(totalPengeluaranKokSatuan)}
              </span>
            </div>
          )}
          {expLapangan > 0 && (
            <div className="flex justify-between items-center py-1">
              <span className="text-sm text-gray-600">Sewa Lapangan</span>
              <span className="font-medium text-gray-800">{formatRp(expLapangan)}</span>
            </div>
          )}
          {expLain > 0 && (
            <div className="flex justify-between items-center py-1">
              <span className="text-sm text-gray-600">Lain-lain</span>
              <span className="font-medium text-gray-800">{formatRp(expLain)}</span>
            </div>
          )}

          {/* Total Pengeluaran */}
          <div className="flex justify-between items-center py-2 mt-2 bg-red-50 px-2 rounded">
            <span className="text-sm font-bold text-red-800">Total Pengeluaran</span>
            <span className="font-black text-red-700">{formatRp(totalPengeluaran)}</span>
          </div>
        </div>
      </div>

      {/* Saldo Akhir */}
      <div
        className={`mt-6 pt-4 border-t-2 border-dashed flex justify-between items-center ${
          saldoAkhir >= 0 ? "border-green-200" : "border-red-200"
        }`}
      >
        <span className="text-base font-black text-gray-800 uppercase">Saldo Akhir</span>
        <span
          className={`text-2xl font-black ${saldoAkhir >= 0 ? "text-green-600" : "text-red-600"}`}
        >
          {formatRp(saldoAkhir)}
        </span>
      </div>
    </div>
  );
}
