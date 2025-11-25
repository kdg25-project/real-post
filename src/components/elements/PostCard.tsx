"use client";

import Image from "next/image";
import PostInfo from "../layouts/PostInfo";
import { Heart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toggleFavorite } from "@/lib/api/favorite";
import { useRouter } from "next/navigation";

export interface PostCardProps {
  id: string;
  thumbnailUrl: string | null;
  companyName: string;
  country: string;
  satisfactionLevel: number;
  favoriteCount: number;
  isFavorited: boolean | null;
}

export default function PostCard({
  id,
  thumbnailUrl,
  companyName,
  country,
  satisfactionLevel,
  favoriteCount,
  isFavorited,
}: PostCardProps) {
  const [favorited, setFavorited] = useState<boolean | null>(isFavorited);
  const [count, setCount] = useState(favoriteCount);
  const router = useRouter();

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();

    const result = await toggleFavorite(id);

    if (result?.success) {
      setFavorited((prev) => !prev);
      setCount((prev) => (favorited ? prev - 1 : prev + 1));
    }
  };

  return (
    <Link href={`/user/home/${id}`} className="block">
      <div className="flex flex-col gap-[8px] bg-white p-[16px] rounded-[15px] shadow-base">
        <div className="relative w-full h-[140px] rounded-[5px]">
          <Image
            src={thumbnailUrl ?? "/images/no-image.png"}
            alt={companyName}
            fill
            className="object-cover rounded-[15px]"
          />
        </div>

        <div className="flex items-center justify-between">
          <PostInfo
            companyName={companyName}
            country={country}
            satisfactionLevel={satisfactionLevel}
            favoriteCount={count}
          />

          <Heart
            size={28}
            className={`${favorited ? "fill-current text-primary" : "text-gray-dark"}`}
            onClick={(e) => {
              e.preventDefault();

              if (favorited === null) {
                router.push("/user/auth/login");
                return;
              }

              handleFavoriteClick(e);
            }}
          />
        </div>
      </div>
    </Link>
  );
}
