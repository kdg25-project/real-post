"use client";

import { useTranslations } from "next-intl";
import { LanguageSelector } from "@/components/elements/LanguageSelector";
import SearchArea from "./SearchArea";

interface HeaderProps {
  searchArea?: boolean;
  onSearch?: (keyword: string) => void;
  onFilterChange?: (age: string, country: string) => void;
}

export default function Header({ searchArea = false, onSearch, onFilterChange }: HeaderProps) {
  const t = useTranslations();

  return (
    <header className="fixed t-0 left-0 flex flex-col gap-[24px] w-full pt-[56px] px-[24px] pb-[24px] bg-gray-more-light z-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-dark text-[14px] font-semibold">{t("common.welcome")}</p>
          <h1 className="text-[26px] font-bold leading-tight">{t("common.appName")}</h1>
        </div>
        <LanguageSelector />
      </div>

      {searchArea && <SearchArea onSearch={onSearch} onFilterChange={onFilterChange} />}
    </header>
  );
}
