'use client';

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Heart, ChevronLeft } from "lucide-react";
import Section from "@/components/layouts/Section";
import { getSurveyDetail } from "@/lib/api/survey";
import { useParams } from "next/navigation";
import { useRouter } from 'next/navigation';
import PostInfo from "@/components/layouts/PostInfo";

export default function DetailPage() {
    const [data, setData] = useState<any>(null);
    const params = useParams(); // URL パラメータ取得
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const router = useRouter();

    useEffect(() => {
        async function fetchData() {
            if (!id) return; // パラメータ未取得なら何もしない
            const result = await getSurveyDetail(id);

            if (result?.success) {
                setData(result.data);
            }
        }
        fetchData();
    }, [id]); // URL ID が変わるたび fetch

    return (
        <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed top-0 right-0 w-full h-full flex flex-col gap-[24px] pb-[94px] overflow-x-auto"
        >
            <div className="fixed top-[36px] left-1/2 -translate-x-1/2 flex items-center justify-between w-full px-[24px] z-[10]">
                <div className="flex items-center justify-center w-[52px] h-[52px] bg-white rounded-full shadow-base" onClick={router.back}>
                    <ChevronLeft size={24} />
                </div>
                <div className="flex items-center justify-center w-[52px] h-[52px] bg-white rounded-full shadow-base">
                    <Heart size={24} />
                </div>
            </div>

            <div className="relative w-full h-[292px] flex-shrink-0">
                <Image
                    src={data?.thumbnailUrl ?? "/images/no-image.png"}
                    alt=""
                    fill
                    className="object-cover"
                />
            </div>

            <div className="px-[24px]">
                {data && (
                    <PostInfo
                        companyName={data.companyName}
                        country={data.country}
                        satisfactionLevel={data.satisfactionLevel}
                        favoriteCount={data.favoriteCount}
                    />
                )}
            </div>

            <div className="flex flex-col gap-[16px] px-[24px]">
                <div className="px-[12px] py-[16px] rounded-[15px] bg-white">
                    <p className="text-[14px] text-gray-dark leading-[1.7]">
                        {data?.description ?? "Loading..."}
                    </p>
                </div>
            </div>

            <Section title="Other Posts" className="px-[24px]">
                <div className="flex flex-col gap-[20px]">
                    {/* TODO: PostCard の map で表示 */}
                </div>
            </Section>
        </motion.div>
    );
}
