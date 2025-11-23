'use client';

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Header from "@/components/layouts/Header";
import Spacer from "@/components/elements/Spacer";
import Slider from "@/components/layouts/SliderArea";
import Section from "@/components/layouts/Section";
import CategoryButton from "@/components/elements/CategoryButton";
import PostCard from "@/components/elements/PostCard";
import { getSurveys } from "@/lib/api/survey";

export default function HomePage() {
    const t = useTranslations();
    const categories = ["all", "food", "culture", "activity", "shopping", "other"];

    const [selectedCategory, setSelectedCategory] = useState("all");
    const [ageGroup, setAgeGroup] = useState("");
    const [country, setCountry] = useState("");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [surveys, setSurveys] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // ✅ called when FilterButton updates age/country
    const handleFilterChange = (age: string, country: string) => {
        setAgeGroup(age);
        setCountry(country);
    };

    // ✅ fetch whenever filter changes
    useEffect(() => {
        async function fetchFiltered() {
            setIsLoading(true);

            const params: any = {
                page: 1,
                limit: 10,
            };

            if (selectedCategory !== "all") params.category = selectedCategory;
            if (searchKeyword) params.query = searchKeyword;
            if (ageGroup) params.ageGroup = ageGroup;
            if (country) params.country = country;

            const res = await getSurveys(params);

            if (res?.success) setSurveys(res.data);

            setIsLoading(false);
        }

        fetchFiltered();
    }, [selectedCategory, searchKeyword, ageGroup, country]);

    // ✅ first load
    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            const res = await getSurveys({ page: 1, limit: 10 });
            if (res?.success) setSurveys(res.data);
            setIsLoading(false);
        }
        fetchData();
    }, []);

    return (
        <div>
            <Header
                searchArea={true}
                onSearch={(keyword) => {
                    setSearchKeyword(keyword);
                }}
                onFilterChange={handleFilterChange}
            />

            <Spacer size="lg" />
            <Slider />

            <Section title={t('home.categories')} className="pt-[24px] gap-0">
                <div className="flex gap-[16px] pt-[16px] pb-[24px] overflow-x-auto">
                    {categories.map((cat) => (
                        <CategoryButton
                            key={cat}
                            name={t(`categories.${cat}`)}
                            selected={selectedCategory === cat}
                            onClick={() => setSelectedCategory(cat)}
                        />
                    ))}
                </div>
            </Section>

            <Section title={t('home.posts')} className="gap-[16px]">
                <div className="flex flex-col gap-[20px] mb-[94px]">

                    {isLoading && (
                        <div className="text-center py-6 text-gray-500">
                            {t('common.loading')}
                        </div>
                    )}

                    {!isLoading &&
                        surveys.map((item) => (
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
        </div>
    );
}
