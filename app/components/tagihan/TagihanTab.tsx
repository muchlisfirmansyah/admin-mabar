import { useState } from "react";
import { Image as ImageIcon, Printer } from "lucide-react";
import { useMabar } from "../../context/MabarContext";
import { useDownloadJpg } from "../../hooks/useDownloadJpg";
import type { PlayerStat } from "../../types/mabar";
import { AdjustPriceModal } from "../modals/AdjustPriceModal";
import { ImagePreviewModal } from "../modals/ImagePreviewModal";
import { ResumeReceipt, RESUME_RECEIPT_ID } from "./ResumeReceipt";

export function TagihanTab() {
  const { showAlert, setPlayerAdjustment } = useMabar();
  const [adjustTarget, setAdjustTarget] = useState<PlayerStat | null>(null);

  const { isDownloading, generatedImage, downloadJpg, clearImage } = useDownloadJpg(() =>
    showAlert("Gagal membuat gambar JPG. Silakan gunakan opsi 'Cetak PDF' sebagai alternatif.")
  );

  return (
    <div className="p-4 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300 print:p-0 print:space-y-2">
      <ResumeReceipt onAdjustPlayer={setAdjustTarget} />

      <div className="flex gap-3 mt-6 print:hidden">
        <button
          onClick={() => downloadJpg(RESUME_RECEIPT_ID)}
          disabled={isDownloading}
          className={`flex-1 py-3 font-bold rounded-xl transition flex justify-center items-center gap-2 shadow-md ${
            isDownloading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-yellow-400 text-black hover:bg-yellow-500"
          }`}
        >
          <ImageIcon size={20} /> Download JPG
        </button>
        <button
          onClick={() => window.print()}
          className="flex-1 py-3 bg-black text-yellow-400 font-bold rounded-xl hover:bg-zinc-800 transition flex justify-center items-center gap-2 shadow-md"
        >
          <Printer size={20} /> Cetak PDF
        </button>
      </div>

      {generatedImage && <ImagePreviewModal image={generatedImage} onClose={clearImage} />}

      {adjustTarget && (
        <AdjustPriceModal
          player={adjustTarget}
          onSave={(amount) => {
            setPlayerAdjustment(adjustTarget.id, amount);
            setAdjustTarget(null);
          }}
          onClose={() => setAdjustTarget(null)}
        />
      )}
    </div>
  );
}
