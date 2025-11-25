"use client";

import * as React from "react";
import Cookies from "js-cookie";
import { Check, ChevronDown, Globe } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const languages = [
  { value: "en", label: "English" },
  { value: "ja", label: "日本語" },
  { value: "zh-cn", label: "简体中文" },
  { value: "zh-tw", label: "繁體中文" },
  { value: "ko", label: "한국어" },
];

export function LanguageSelector() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  // ----------------------------
  // 初期値：Cookie があれば読み込む
  // ----------------------------
  React.useEffect(() => {
    const saved = Cookies.get("lang");

    if (saved) {
      setValue(saved);
      return;
    }

    // ------- ブラウザの言語を取得 -------
    const browserLang = navigator.language.toLowerCase();

    // ------- 対応言語一覧 -------
    const supported = languages.map((l) => l.value);

    // ------- マッチする言語を探す（部分一致も許可） -------
    const matched = supported.find((lang) => browserLang.startsWith(lang));

    // ------- 対応していればその言語、なければ en -------
    const initial = matched ? matched : "en";

    Cookies.set("lang", initial, { expires: 365 });
    setValue(initial);
  }, []);

  // ----------------------------
  // 言語変更 → Cookie に保存 → ページリロード
  // ----------------------------
  const changeLang = (lang: string) => {
    setValue(lang);
    Cookies.set("lang", lang, { expires: 365 });
    // Reload the page to apply new language
    window.location.reload();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-[10px] px-[16px] py-[8px] bg-white rounded-full shadow-base">
          <Globe size={32} />
          {value ? languages.find((l) => l.value === value)?.label : "Language"}
          <ChevronDown />
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-[175px] p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No language found.</CommandEmpty>
            <CommandGroup>
              {languages.map((language) => (
                <CommandItem
                  key={language.value}
                  value={language.value}
                  onSelect={() => {
                    changeLang(language.value);
                    setOpen(false);
                  }}
                >
                  {language.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === language.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
