import { Image as ImageIcon } from "lucide-react";
import { useMabar } from "../../context/MabarContext";
import { useDownloadJpg } from "../../hooks/useDownloadJpg";
import { ImagePreviewModal } from "../modals/ImagePreviewModal";
import { ExpenseForm } from "./ExpenseForm";
import { FinanceReport, FINANCE_REPORT_ID } from "./FinanceReport";

export function KeuanganTab() {
  const { showAlert } = useMabar();

  const { isDownloading, generatedImage, downloadJpg, clearImage } = useDownloadJpg(() =>
    showAlert("Gagal membuat gambar JPG. Silakan gunakan opsi 'Cetak PDF' sebagai alternatif.")
  );

  return (
    <div className="p-4 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300 print:p-0 print:space-y-2">
      <ExpenseForm />

      <FinanceReport />

      <div className="flex gap-3 mt-6 print:hidden">
        <button
          onClick={() => downloadJpg(FINANCE_REPORT_ID)}
          disabled={isDownloading}
          className={`flex-1 py-3 font-bold rounded-xl transition flex justify-center items-center gap-2 shadow-md ${
            isDownloading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-black text-yellow-400 hover:bg-zinc-800"
          }`}
        >
          <ImageIcon size={20} /> Download Laporan JPG
        </button>
      </div>

      {generatedImage && <ImagePreviewModal image={generatedImage} onClose={clearImage} />}
    </div>
  );
}
