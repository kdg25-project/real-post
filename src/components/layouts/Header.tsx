import { LanguageSelector } from "@/components/elements/LanguageSelector";

export default function Header() {
  return (
    <header className="flex flex-col gap-6 w-full pt-14 pb-6 bg-gray-more-light">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-dark text-[14px] font-semibold">
            welecome to
          </p>
          <h1 className="text-[26px] font-bold leading-tight">Real Post</h1>
        </div>
        <LanguageSelector />
      </div>
    </header>
  );
}
