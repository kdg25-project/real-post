"use client";

import React,{useRef} from "react";
import{Upload} from "lucide-react"
import Image from "next/image";


interface ImageUploadProps {
    label: string;
    title: string;
    className?: string;
    onChange?:(file: File|null) => void
    preview?: string
}

export default function ImageUpload({ title, label, onChange, preview }: ImageUploadProps) {
    const fileRef = useRef<HTMLInputElement| null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (onChange){
            onChange(file);
        }
    };
    
    return(
        <div className="flex flex-col gap-[12px]">
            <label htmlFor="" className="text-[16px] font-bold">{label}</label>
            <label className="flex items-center justify-center gap-4 w-full px-[20px] py-[15px] rounded-[14px] bg-gray-300 shadow-base focus:outline-none"
            onClick={() => fileRef.current?.click()}>
                <Upload size={24} />
                <p className="text-[16px]">{title}</p>
            <input 
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileRef}
            onChange={handleFileChange}
            />
            </label>

            {preview && (
                <Image
                    src={preview}
                    alt="preview"
                    width={120}
                    height={120}
                    className="object-cover rounded-md"
                />
            )}
        </div>
    )
}