"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Heart } from "lucide-react";
import PostInfo from "@/components/layouts/PostInfo";
import Section from "@/components/layouts/Section";
import { ChevronLeft } from "lucide-react";
import PostCard from "@/components/elements/PostCard";

// export default function DetailPage({ params }: { params: { id: string } }) {
export default function DetailPage() {
    return (
        <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed top-0 right-0 w-full h-full flex flex-col gap-[24px] pb-[94px] overflow-x-auto"
        >
            <div className="fixed top-[36px] left-1/2 -translate-x-1/2 flex items-center justify-between w-full px-[24px] z-[10]">
                <div className="flex items-center justify-center w-[52px] h-[52px] bg-white rounded-full color-gray-dark shadow-base">
                    <ChevronLeft size={24} />
                </div>
                <div className="flex items-center justify-center w-[52px] h-[52px] bg-white rounded-full color-gray-dark shadow-base">
                    <Heart size={24} />
                </div>
            </div>
            <div className="relative w-full h-[292px] flex-shrink-0">
                <Image
                    src={"/images/image1.jpg"}
                    alt=""
                    fill
                    className="object-cover"
                >
                </Image>
            </div>
            <div className="flex flex-col gap-[16px] px-[24px]">
                {/* <PostInfo size="lg" /> */}
                <div className="px-[12px] py-[16px] rounded-[15px] bg-white">
                    <p className="text-[14px] font-regular text-gray-dark leading-[1.7]">Here you go ✨📘
                        As the lines of text flow endlessly, a gentle rhythm starts to appear 🌊. The words themselves mean little, yet they create a strangely soothing atmosphere ✨. Before you know it, you’re carried along by the stream of simple phrases— light, quiet, and drifting like a soft breeze 🌬️💭.</p>
                </div>
            </div>
            <Section title="Other Posts" className="px-[24px]">
                <div className="flex flex-col gap-[20px]">
                    {/* <PostCard />
                    <PostCard />
                    <PostCard />
                    <PostCard />
                    <PostCard /> */}
                </div>
            </Section>
        </motion.div>
    );
}
