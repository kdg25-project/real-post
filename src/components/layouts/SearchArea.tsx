"use client";

import { useState } from "react";
import { FilterButton } from "@/components/elements/FilterButton";
import { Search } from "lucide-react";

export default function SearchArea() {
    const [keyword, setKeyword] = useState("");

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            console.log("検索ワード:", keyword);
        }
    };

    return (
        <div className="flex gap-[12px]">
            <div className="relative w-full">
                <Search size={24} className="absolute top-1/2 -translate-y-1/2 left-[20px] " />
                <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search…"
                    className="w-full pl-[56px] pr-[20px] py-[15px] rounded-[14px] bg-white shadow-base focus:outline-none"
                />
            </div>
            <FilterButton />
        </div>
    )
}