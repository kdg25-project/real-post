import Image from "next/image";
import PostInfo from "../layouts/PostInfo";
import { Heart } from "lucide-react";

export default function PostCard() {
    return (
        <div className="flex flex-col gap-[8px] bg-white p-[10px] rounded-[15px]">
            <div className="relative w-full h-[140px] rounded-[5px]">
                <Image
                    src="/images/image1.jpg"
                    alt=""
                    fill
                    className="object-cover rounded-[15px]"
                />
            </div>
            <div className="flex items-center justify-between">
                <PostInfo />
                <Heart size={28} />
            </div>
        </div>
    )
}