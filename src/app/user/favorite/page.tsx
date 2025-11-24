"use client";

import { useEffect, useState } from "react";
import Header from "@/components/layouts/Header";
import Section from "@/components/layouts/Section";
import PostCard from "@/components/elements/PostCard";
import { getFavoriteSurveys } from "@/lib/api/survey";

export default function FavoritePage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchFavorites = async () => {
      setIsLoading(true);
      const result = await getFavoriteSurveys();

      // result が null の場合は空配列を入れる
      setFavorites(result?.data ?? []);
      setIsLoading(false);
    };

    fetchFavorites();
  }, []);

  return (
    <div>
      <Header />
      <Section title="Favorite Posts" className="gap-[16px]">
        <div className="flex flex-col gap-[20px] mb-[94px]">
          {isLoading && (
            <div className="text-center py-6 text-gray-500">Loading...</div>
          )}

          {!isLoading && favorites.length === 0 && (
            <p className="text-center text-gray-500">No favorites yet.</p>
          )}

          {!isLoading &&
            favorites.map((item) => (
              <PostCard
                key={item.id}
                id={item.survey.id}
                thumbnailUrl={item.survey.thumbnailUrl ?? null}
                companyName={item.survey.companyName}
                country={item.survey.country}
                satisfactionLevel={item.survey.satisfactionLevel}
                favoriteCount={item.survey.favoriteCount}
                isFavorited={true}
              />
            ))}
        </div>
      </Section>
    </div>
  );
}
