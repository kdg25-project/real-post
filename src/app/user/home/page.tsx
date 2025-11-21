'use client';

import React, { useEffect } from "react";
import Header from "@/components/layouts/Header";
import Spacer from "@/components/elements/Spacer";
import Slider from "@/components/layouts/SliderArea";
import Section from "@/components/layouts/Section";
import CategoryButton from "@/components/elements/CategoryButton";
import PostCard from "@/components/elements/PostCard";
import { getSurveysForTop } from "@/lib/api/survey";

export default function HomePage() {
    const categories = ["All", "Web", "Mobile", "Design", "aiueo", "kakikukeko"];
    const [selectedCategory, setSelectedCategory] = React.useState("All");
    const [surveys, setSurveys] = React.useState<any[]>([]);

    useEffect(() => {
        async function fetchData() {
            const res = await getSurveysForTop(1, 10);
            if (res.success) {
                console.log(res)
                setSurveys(res.data);
            }
        }
        fetchData();
    }, []);

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
                        />
                    ))}
                </div>
            </Section>
            <Section title="Posts" className="gap-[16px]">
                <div className="flex flex-col gap-[20px] mb-[94px]">
                    <PostCard />
                    {/* {surveys.map((item) => (
                        <div key={item.id} className="p-2 border rounded">
                            {item.id}
                        </div>
                    ))} */}
                </div>
            </Section>
        </div>
    );
}
