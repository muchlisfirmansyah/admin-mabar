interface ImagePreviewModalProps {
  image: string;
  onClose: () => void;
}

export function ImagePreviewModal({ image, onClose }: ImagePreviewModalProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 flex-col animate-in fade-in duration-200">
      <div className="w-full max-w-sm relative">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 bg-red-500 text-white p-2 rounded-full font-bold text-sm px-4 shadow-lg"
        >
          Tutup
        </button>
        <div className="bg-white p-2 rounded-xl shadow-2xl max-h-[80vh] overflow-y-auto">
          <img
            src={image}
            alt="Struk Download"
            className="w-full h-auto rounded-lg border border-gray-200"
          />
        </div>
        <div className="bg-yellow-400 text-black p-3 rounded-xl mt-4 text-center text-sm font-bold shadow-lg">
          📸 Tekan Tahan (Atau Klik Kanan) gambar di atas, lalu pilih "Simpan Gambar" / "Save
          Image".
        </div>
      </div>
    </div>
  );
}
