"use client";

interface CategoryButtonProps {
    name: string;
    selected?: boolean;
    onClick?: () => void;
}

export default function CategoryButton({
    name,
    selected = false,
    onClick,
}: CategoryButtonProps) {
    return (
        <button
            className={`px-[14px] py-[8px] rounded-full text-[14px] font-semibold shadow-base whitespace-nowrap ${selected ? "bg-primary text-white" : "bg-white text-black"
                }`}
            onClick={onClick}
        >
            {name}
        </button>
    );
}
