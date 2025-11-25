"use client";

import React, { useEffect } from "react";
import { useQRCode } from "next-qrcode";

export default function QrCode({ url }: { url: string }) {
  const { Image } = useQRCode();

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-10">
      <Image
        key={url}
        text={url}
        options={{
          type: "image/jpeg",
          quality: 0.3,
          errorCorrectionLevel: "M",
          margin: 3,
          scale: 4,
          width: 240,
          color: {
            dark: "#000",
            light: "#fff",
          },
        }}
      />
      <p className="text-xl font-bold">Please cooperate with the survey 🤲</p>
    </div>
  );
}
