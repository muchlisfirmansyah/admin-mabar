import { useState } from "react";

export function useDownloadJpg(onError: () => void) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const downloadJpg = async (elementId: string) => {
    setIsDownloading(true);
    try {
      const { default: html2canvas } = await import("html2canvas-pro");
      const element = document.getElementById(elementId);
      if (!element) throw new Error(`Elemen #${elementId} tidak ditemukan`);

      const canvas = await html2canvas(element, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        logging: false,
      });

      setGeneratedImage(canvas.toDataURL("image/jpeg", 1.0));
    } catch (error) {
      console.error("Gagal mendownload gambar:", error);
      onError();
    } finally {
      setIsDownloading(false);
    }
  };

  const clearImage = () => setGeneratedImage(null);

  return { isDownloading, generatedImage, downloadJpg, clearImage };
}
