"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Heart, ChevronLeft } from "lucide-react";
import Section from "@/components/layouts/Section";
import { getSurveyDetail, getSurveys } from "@/lib/api/survey";
import { toggleFavorite } from "@/lib/api/favorite";
import { useParams, useRouter } from "next/navigation";
import PostInfo from "@/components/layouts/PostInfo";
import PostCard from "@/components/elements/PostCard";

export default function DetailPage() {
  const [data, setData] = useState<any>(null);
  const [favorited, setFavorited] = useState<boolean | null>(null);
  const [count, setCount] = useState(0);
  const [otherPosts, setOtherPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();

  // -----------------------------
  // データ取得
  // -----------------------------
  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      setIsLoading(true);

      // 詳細情報
      const result = await getSurveyDetail(id);
      if (result?.success) {
        setData(result.data);
        setFavorited(result.data.isFavorited);
        setCount(result.data.favoriteCount);
      }

      const category = result?.data?.companyCategory;
      const other = await getSurveys({
        page: 1,
        limit: 5,
        category: category,
      });
      // -------------------------

      if (other?.success) setOtherPosts(other.data);

      setIsLoading(false);
    }

    fetchData();
  }, [id]);

  // -----------------------------
  // お気に入りトグル
  // -----------------------------
  const handleFavoriteClick = async (e: React.MouseEvent) => {
    if (!id || favorited === null) return;
    const result = await toggleFavorite(id);

    if (result?.success) {
      setFavorited((prevFavorited) => {
        setCount((prevCount) => (prevFavorited ? prevCount - 1 : prevCount + 1));
        return !prevFavorited;
      });
    }
  };

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
        <div className="flex items-center justify-center w-[52px] h-[52px] bg-white rounded-full shadow-base">
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

      {/* メイン画像 */}
      <div className="relative w-full h-[292px] flex-shrink-0">
        <Image
          src={data?.thumbnailUrl ?? "/images/no-image.png"}
          alt=""
          fill
          className="object-cover"
        />
      </div>

      {/* 投稿情報 */}
      <div className="px-[24px]">
        <PostInfo
          size="lg"
          companyId={data.companyId}
          companyName={data.companyName}
          country={data.country}
          satisfactionLevel={data.satisfactionLevel}
          favoriteCount={count}
        />
      </div>

      {/* 投稿内容 */}
      <div className="flex flex-col gap-[16px] px-[24px]">
        <div className="px-[12px] py-[16px] rounded-[15px] bg-white">
          <p className="text-[14px] text-gray-dark leading-[1.7]">{data.description}</p>
        </div>
      </div>

      {/* 他の投稿 */}
      <Section title="Other Posts" className="px-[24px] gap-[16px]">
        <div className="flex flex-col gap-[20px]">
          {otherPosts.map((item) => (
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
