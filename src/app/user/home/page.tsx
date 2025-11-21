'use client';

import React, { useEffect } from "react";
import Header from "@/components/layouts/Header";
import Spacer from "@/components/elements/Spacer";
import Slider from "@/components/layouts/SliderArea";
import Section from "@/components/layouts/Section";
import CategoryButton from "@/components/elements/CategoryButton";
import PostCard from "@/components/elements/PostCard";
import { getSurveysForTop, getSurveys } from "@/lib/api/survey";

export default function HomePage() {
    const categories = ["All", "Food", "Culture", "Activity", "Shopping", "Other"];
    const [selectedCategory, setSelectedCategory] = React.useState("All");
    const [surveys, setSurveys] = React.useState<any[]>([]);
    const [isFilteredMode, setIsFilteredMode] = React.useState(false);

    // -----------------------------
    // 初回トップ一覧
    // -----------------------------
    useEffect(() => {
        async function fetchData() {
            const res = await getSurveysForTop(1, 10);
            if (res?.success) {
                setSurveys(res.data);
            }
        }
        fetchData();
    }, []);

    // -----------------------------
    // カテゴリ変更時（条件付き一覧モード）
    // -----------------------------
    useEffect(() => {
        if (!isFilteredMode) return;

        async function fetchFiltered() {
            // 現在はカテゴリのみ対応。検索・絞り込みは後で追加
            const res = await getSurveys({
                page: 1,
                limit: 10,
                category: selectedCategory !== "All" ? selectedCategory : undefined,
            });

            if (res?.success) setSurveys(res.data);
        }

        fetchFiltered();
    }, [isFilteredMode, selectedCategory]);

    return (
        <div>
            <Header searchArea={true} />

            <Spacer size="lg" />
            <Slider />
            <Section title="Categories" className="pt-[24px] gap-0">
                <div className="flex gap-[16px] pt-[16px] pb-[24px] overflow-x-auto">
                    {categories.map((cat) => (
                        <CategoryButton
                            key={cat}
                            name={cat}
                            selected={selectedCategory === cat}
                        // onClick={() => {
                        //     setSelectedCategory(cat);
                        //     setIsFilteredMode(true); // ← 絞り込みモードに切り替え
                        // }}
                        />
                    ))}
                </div>
            </Section>
            <Section title="Posts" className="gap-[16px]">
                <div className="flex flex-col gap-[20px] mb-[94px]">
                    {surveys.map((item) => (
                        <PostCard
                            key={item.id}
                            id={item.id}
                            thumbnailUrl={item.thumbnailUrl ?? null}
                            companyName={item.companyName}
                            country={item.country}
                            satisfactionLevel={item.satisfactionLevel}
                            favoriteCount={item.favoriteCount}
                            isFavorite={item.isFavorite}
                        />
                    ))}
                </div>
            </Section>
        </div>
    );
}
