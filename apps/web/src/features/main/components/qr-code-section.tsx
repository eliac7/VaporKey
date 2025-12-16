"use client";

import { Download, QrCode, Share2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";

interface QRCodeSectionProps {
  url: string;
}

export function QRCodeSection({ url }: QRCodeSectionProps) {
  const t = useTranslations("resultCard");
  const [showQR, setShowQR] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const convertSVGToBlob = async (): Promise<Blob | null> => {
    try {
      const svgElement = qrRef.current?.querySelector("svg");
      if (!svgElement) return null;

      const svgData = new XMLSerializer().serializeToString(svgElement);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const blobUrl = URL.createObjectURL(svgBlob);

      return new Promise((resolve) => {
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          URL.revokeObjectURL(blobUrl);

          canvas.toBlob((blob) => {
            resolve(blob);
          }, "image/png");
        };
        img.src = blobUrl;
      });
    } catch (err) {
      console.error("Failed to convert SVG", err);
      return null;
    }
  };

  const handleDownloadQR = async () => {
    const blob = await convertSVGToBlob();
    if (!blob) return;

    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = "vaporkey-qr-code.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  };

  const handleShareQR = async () => {
    if (!navigator.share) {
      // Fallback: copy URL to clipboard
      try {
        await navigator.clipboard.writeText(url);
      } catch (err) {
        console.error("Failed to copy URL", err);
      }
      return;
    }

    try {
      const blob = await convertSVGToBlob();
      if (!blob) return;

      const file = new File([blob], "vaporkey-qr-code.png", { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "VaporKey QR Code",
          text: "Scan this QR code to access the secret",
        });
      } else {
        // Fallback to sharing just the URL
        await navigator.share({
          title: "VaporKey Secret Link",
          text: "Access the secret via this link",
          url: url,
        });
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        console.error("Failed to share", err);
      }
    }
  };

  return (
    <>
      <div className="gap-3 mt-3">
        <button
          onClick={() => setShowQR(!showQR)}
          className={`h-10 w-full rounded-xl text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer border ${showQR
            ? "bg-zinc-200 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
            : "bg-transparent border-zinc-300 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
            }`}
        >
          <QrCode className="w-4 h-4" />
          {showQR ? t("hideQR") : t("qrCode")}
        </button>
      </div>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${showQR ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0 mt-0"
          }`}
      >
        <div className="flex justify-center p-4 bg-white rounded-xl" ref={qrRef}>
          <QRCodeSVG value={url} size={180} />
        </div>
        {showQR && (
          <div className="grid md:grid-cols-2 grid-cols-1 gap-2 mt-3">
            <button
              onClick={handleDownloadQR}
              className="h-10 rounded-xl text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer border bg-transparent border-zinc-300 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
            >
              <Download className="w-4 h-4" />
              {t("downloadQR")}
            </button>
            <button
              onClick={handleShareQR}
              className="h-10 rounded-xl text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer border bg-transparent border-zinc-300 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
            >
              <Share2 className="w-4 h-4" />
              {t("shareQR")}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

