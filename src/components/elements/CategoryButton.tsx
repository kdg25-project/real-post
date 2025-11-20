"use client";

interface CategoryButtonProps {
    name: string;
    selected?: boolean;
}

export default function CategoryButton({
    name,
    selected = false,
}: CategoryButtonProps) {
    return (
        <button
            className={`px-[14px] py-[8px] rounded-full text-[14px] font-semibold shadow-base ${selected ? "bg-primary text-white" : "bg-white text-black"}`}
        >
            {name}
        </button>
    );
}
