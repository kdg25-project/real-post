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

export default function CompanyDetailPage() {
    const params = useParams();
    const [data, setData] = useState<any>(null);
    const [surveys, setSurveys] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const companyId = params?.id;
        if (!companyId || Array.isArray(companyId)) return;

        const fetchCompany = async () => {
            setIsLoading(true);

            // 会社詳細取得
            const result = await getCompanyDetail(companyId);
            setData(result?.data ?? null);

            // 店舗アンケート取得
            const surveyResult = await getSurveysForStore(companyId, 1, 10);
            if (surveyResult?.success) setSurveys(surveyResult.data);

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
                    companyName={data.companyName}
                />
            </div>

            {data.placeUrl && (
                <Section title="Location" className="px-[24px] gap-[16px]">
                    <div className="w-full h-[300px]">
                        {/* <iframe src={data.placeUrl} width="600" height="450" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe> */}
                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3261.573611769696!2d136.87627027591108!3d35.16725325803687!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x600376e698b4d345%3A0xf982b9328122786b!2z44CSNDUzLTA4MDEg5oSb55-l55yM5ZCN5Y-k5bGL5biC5Lit5p2R5Yy65aSq6Zak77yT5LiB55uu77yS4oiS77yR77yU!5e0!3m2!1sja!2sjp!4v1763782795926!5m2!1sja!2sjp" width="600" height="450" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                    </div>
                </Section>
            )}

            <Section title="Goods" className="px-[24px] gap-[16px]">
                <div></div>
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
