"use client";

import Link from "next/link";
import { Star, Heart } from "lucide-react";

interface PostInfoProps {
  size?: "sm" | "lg";
  titleOnly?: boolean;
  isCenter?: boolean;
  notLink?: boolean;

  companyId?: string;
  companyName: string;
  country?: string;
  satisfactionLevel?: number;
  favoriteCount?: number;
}

export default function PostInfo({
  size = "sm",
  titleOnly = false,
  isCenter = false,
  notLink = false,

  companyId,
  companyName,
  country,
  satisfactionLevel,
  favoriteCount,
}: PostInfoProps) {
  const companyNameElement = (
    <p
      className={`${size === "sm" ? "text-[18px]" : "text-[24px] underline"} font-semibold ${isCenter ? "text-center" : ""}`}
    >
      {companyName}
    </p>
  );

  return (
    <div>
      {size === "lg" && !notLink ? (
        <Link href={`/user/company/${companyId}`}>{companyNameElement}</Link>
      ) : (
        companyNameElement
      )}

      <div
        className={`flex items-center gap-[16px] ${size === "sm" ? "pt-[8px]" : "pt-[12px]"} ${titleOnly ? "hidden" : ""}`}
      >
        {/* 国名 */}
        <div
          className={`flex items-center justify-center bg-gray rounded-[5px] ${size === "sm" ? "px-[6px] py-[4px]" : "px-[8px] py-[6px]"}`}
        >
          <p className={`${size === "sm" ? "text-[12px]" : "text-[16px]"} font-semibold`}>
            {country}
          </p>
        </div>

        {/* 評価 */}
        <div className="flex gap-[4px] text-gray-dark">
          <Star size={size === "sm" ? 20 : 24} />
          <p className={`${size === "sm" ? "text-[14px]" : "text-[18px]"} font-semibold`}>
            {satisfactionLevel}
          </p>
        </div>

        {/* お気に入り数 */}
        <div className="flex gap-[4px] text-gray-dark">
          <Heart size={size === "sm" ? 20 : 24} />
          <p className={`${size === "sm" ? "text-[14px]" : "text-[18px]"} font-semibold`}>
            {favoriteCount}
          </p>
        </div>
      </div>
    </div>
  );
}
