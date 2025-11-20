import Image from "next/image"
import PostInfo from "../layouts/PostInfo"

export default function GoodsCard() {
    return (
        // 店舗詳細のリンク
        <div className="flex flex-col gap-[6px] w-fit">
            <div className="relative w-[160px] h-[160px] bg-white rounded-[15px]">
                <Image
                    src={"/images/image2.png"}
                    alt=""
                    width={120}
                    height={120}
                    className="object-cover absolute top-1/2 left-1/2 -translate-1/2"
                >
                </Image>
            </div>
            <PostInfo size="lg" titleOnly isCenter />
        </div>
    )
}