"use client";

interface CategoryButtonProps {
  name: string;
  selected?: boolean;
  onClick?: () => void;
}

export default function CategoryButton({
  name,
  selected,
  onClick,
}: CategoryButtonProps) {
  return (
    <button
      className={`px-3.5 py-2 rounded-full text-[14px] font-semibold shadow-base ${
        selected ? "bg-primary text-white" : "bg-white text-black"
      }`}
      onClick={onClick}
    >
      {name}
    </button>
  );
}
