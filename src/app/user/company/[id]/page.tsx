'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCompanyDetail } from "@/lib/api/company";
import { getSurveysForStore } from "@/lib/api/survey";
import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import PostInfo from "@/components/layouts/PostInfo";
import Section from "@/components/layouts/Section";
import PostCard from "@/components/elements/PostCard";
import GoodsCard from "@/components/elements/GoodsCard";
import { getCompanyGoods } from "@/lib/api/goods";

export default function CompanyDetailPage() {
    const params = useParams();
    const [data, setData] = useState(null);
    const [surveys, setSurveys] = useState([]);
    const [goods, setGoods] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const companyId = params?.id;
        if (!companyId || Array.isArray(companyId)) return;

        const fetchCompany = async () => {
            setIsLoading(true);

            // 店舗詳細
            const result = await getCompanyDetail(companyId);
            setData(result?.data ?? null);

            // アンケート
            const surveyResult = await getSurveysForStore(companyId, 1, 10);
            if (surveyResult?.success) setSurveys(surveyResult.data);

            // ✅ グッズ取得
            const goodsResult = await getCompanyGoods(companyId);
            if (goodsResult?.success) setGoods(goodsResult.data);

            setIsLoading(false);
        };

        fetchCompany();
    }, [params?.id]);

    // -----------------------------
    // ローディング表示
    // -----------------------------
    if (isLoading) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <p className="text-gray-500 text-lg">Loading...</p>
            </div>
        );
    }

    console.log(data.placeUrl)

    return (
        <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed top-0 right-0 w-full h-full flex flex-col gap-[24px] pb-[94px] overflow-x-auto"
        >
            {/* ヘッダー */}
            <div className="fixed top-[36px] left-1/2 -translate-x-1/2 flex items-center justify-between w-full px-[24px] z-[10]">
                <div
                    className="flex items-center justify-center w-[52px] h-[52px] bg-white rounded-full shadow-base"
                    onClick={router.back}
                >
                    <ChevronLeft size={24} />
                </div>
            </div>

            {/* メイン画像 */}
            <div className="relative w-full h-[292px] flex-shrink-0">
                <Image
                    src={data.image ?? "/images/no-image.png"}
                    alt=""
                    fill
                    className="object-cover"
                />
            </div>

            {/* 投稿情報 */}
            <div className="px-[24px]">
                <PostInfo
                    size="lg"
                    titleOnly
                    notLink
                    companyName={data.companyName}
                />
            </div>

            {data.placeUrl && (
                <Section title="Locate" className="px-[24px] gap-[16px]">

                    {(() => {
                        const extractLatLng = (url: string) => {
                            const match = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
                            if (!match) return null;
                            return `${match[1]},${match[2]}`;
                        };

                        const coords = extractLatLng(data.placeUrl);
                        console.log("coords:", coords);

                        return (
                            <iframe
                                src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&q=${coords ?? "Japan"}`}
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        );
                    })()}
                </Section>
            )}

            <Section title="Goods" className="px-[24px] gap-[16px]">
                <div className="flex flex-wrap gap-[16px]">
                    {goods.length > 0 ? (
                        goods.map((item) => (
                            <GoodsCard
                                key={item.id}
                                companyId={item.companyId}
                                imageUrl={item.images?.[0]?.imageUrl}
                            />
                        ))
                    ) : (
                        <p className="text-gray-400 text-sm">No Goods</p>
                    )}
                </div>
            </Section>

            <Section title="Other Posts" className="px-[24px] gap-[16px]">
                <div className="flex flex-col gap-[20px]">
                    {surveys.map((item) => (
                        <PostCard
                            key={item.id}
                            id={item.id}
                            thumbnailUrl={item.thumbnailUrl ?? null}
                            companyName={item.companyName}
                            country={item.country}
                            satisfactionLevel={item.satisfactionLevel}
                            favoriteCount={item.favoriteCount}
                            isFavorited={item.isFavorited}
                        />
                    ))}
                </div>
            </Section>
        </motion.div>
    );
}
