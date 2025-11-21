"use client";

import React from "react";
import {useQRCode} from "next-qrcode";

export default function QrCode() {
    const { Image } = useQRCode()

    return (
        <div className="flex flex-col items-center justify-center h-screen gap-10">
            <Image
                text={"https://zenn.dev/kate0418/articles/db4eecb906ba58#dockerfile"}
                options={{
                type: 'image/jpeg',
                quality: 0.3,
                errorCorrectionLevel: 'M',
                margin: 3,
                scale: 4,
                width: 240,
                color: {
                dark: '#000',
                light: '#fff',
                },
            }}
            />
            <p className="text-xl font-bold">Please cooperate with the survey 🤲</p>
        </div>
    );
}
