"use client";

import { motion } from "framer-motion";

// export default function DetailPage({ params }: { params: { id: string } }) {
export default function DetailPage() {
    return (
        <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed top-0 right-0 w-full h-full z-[999] p-6"
        >
            <h1 className="text-2xl font-bold">Detail: { }</h1>
            <p className="mt-4">これは投稿 { } の詳細ページです。</p>
        </motion.div>
    );
}
