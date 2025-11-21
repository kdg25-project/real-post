import Image from "next/image";
import PostInfo from "../layouts/PostInfo";
import { Heart } from "lucide-react";
import Link from "next/link";

interface PostCardProps {
    id: string;
    thumbnailUrl: string | null;
    companyName: string;
    country: string;
    satisfactionLevel: number;
    favoriteCount: number;
    isFavorite: boolean;
}

export default function PostCard({
    id,
    thumbnailUrl,
    companyName,
    country,
    satisfactionLevel,
    favoriteCount,
    isFavorite
}: PostCardProps) {
    return (
        <Link href={`/user/home/${id}`} className="block">
            <div className="flex flex-col gap-[8px] bg-white p-[10px] rounded-[15px] shadow-base">
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
                        favoriteCount={favoriteCount}
                    />

                    <Heart
                        size={28}
                        className={`${isFavorite
                            ? "text-primary-color"
                            : "text-gray-dark"
                            }`}
                    />
                </div>
            </div>
        </Link>
    );
}
