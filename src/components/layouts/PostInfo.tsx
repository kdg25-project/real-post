"use client";

import { Star, Heart } from "lucide-react";

interface PostInfoProps {
    size?: "sm" | "lg";
    titleOnly?: boolean;
    isCenter?: boolean;
}

export default function PostInfo({ size = "sm", titleOnly = false, isCenter = false, }: PostInfoProps) {
    return (
        <div>
            <p className={`${size == "sm" ? "text-[14px]" : "text-[18px] underline"} font-semibold  ${isCenter ? "text-center" : ""}`}>Blue Fork Bistro</p>
            <div className={`flex items-center gap-[16px] ${size == "sm" ? "pt-[4px]" : "pt-[12px]"} ${titleOnly ? "hidden" : ""}`}>
                <div className={`flex items-center justify-center bg-gray ${size === "sm" ? "rounded-[5px] w-[36px] h-[18px]" : "rounded-[5px] w-[58px] h-[24px]"}`}>
                    <p className={`${size == "sm" ? "text-[8px]" : "text-[12px]"} font-semibold`}>China</p>
                </div>
                <div className="flex gap-[4px] text-gray-dark">
                    <Star size={size == "sm" ? 14 : 20} />
                    <p className={`${size === "sm" ? "text-[10px]" : "text-[14px]"} font-semibold`}>3.2</p>
                </div>
                <div className="flex gap-[4px] text-gray-dark">
                    <Heart size={size == "sm" ? 14 : 20} />
                    <p className={`${size === "sm" ? "text-[10px]" : "text-[14px]"} font-semibold`}>102</p>
                </div>
            </div>
        </div>
    );
}
