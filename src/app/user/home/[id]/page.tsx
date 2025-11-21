"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Heart, ChevronLeft } from "lucide-react";
import Section from "@/components/layouts/Section";
import { getSurveyDetail } from "@/lib/api/survey";

export default function DetailPage() {
    const [data, setData] = useState<any>(null);
    const id = "1"; // ← 本来はURLから取得する。今は仮。

    useEffect(() => {
        async function fetchData() {
            const result = await getSurveyDetail(id);
            console.log("📌 詳細データ:", result); // ← ここでログ確認

            if (result?.success) {
                setData(result.data);
            }
        }
        fetchData();
    }, [id]);

    return (
        <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed top-0 right-0 w-full h-full flex flex-col gap-[24px] pb-[94px] overflow-x-auto"
        >
            <div className="fixed top-[36px] left-1/2 -translate-x-1/2 flex items-center justify-between w-full px-[24px] z-[10]">
                <div className="flex items-center justify-center w-[52px] h-[52px] bg-white rounded-full shadow-base">
                    <ChevronLeft size={24} />
                </div>
                <div className="flex items-center justify-center w-[52px] h-[52px] bg-white rounded-full shadow-base">
                    <Heart size={24} />
                </div>
            </div>

            {/* メイン画像 */}
            <div className="relative w-full h-[292px] flex-shrink-0">
                <Image
                    src={data?.thumbnailUrl ?? "/images/image1.jpg"}
                    alt=""
                    fill
                    className="object-cover"
                />
            </div>

            {/* 説明文章 */}
            <div className="flex flex-col gap-[16px] px-[24px]">
                <div className="px-[12px] py-[16px] rounded-[15px] bg-white">
                    <p className="text-[14px] text-gray-dark leading-[1.7]">
                        {data?.description ?? "Loading..."}
                    </p>
                </div>
            </div>

            {/* その他投稿 */}
            <Section title="Other Posts" className="px-[24px]">
                <div className="flex flex-col gap-[20px]">
                    {/* ここに PostCard を map で並べる予定 */}
                </div>
            </Section>
        </motion.div>
    );
}
