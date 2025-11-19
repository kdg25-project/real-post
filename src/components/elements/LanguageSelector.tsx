"use client"

import * as React from "react"
import { Check, ChevronDown, Globe } from "lucide-react"

import { cn } from "@/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const languages = [
    {
        value: "en",
        label: "English",
    },
    {
        value: "ja",
        label: "日本語",
    },
    {
        value: "zh-cn",
        label: "简体中文",
    },
    {
        value: "zh-tw",
        label: "繁體中文",
    },
    {
        value: "ko",
        label: "한국어",
    },
]

export function LanguageSelector() {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button className="flex items-center gap-[10px] px-[16px] py-[8px] bg-white rounded-full shadow-base">
                    <Globe size={32} />
                    {value
                        ? languages.find((framework) => framework.value === value)?.label
                        : "language"}
                    <ChevronDown className="" />
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-[175px] p-0">
                <Command>
                    {/* <CommandInput placeholder="Search..." className="h-9" /> */}
                    <CommandList>
                        <CommandEmpty>No framework found.</CommandEmpty>
                        <CommandGroup>
                            {languages.map((language) => (
                                <CommandItem
                                    key={language.value}
                                    value={language.value}
                                    onSelect={(currentValue) => {
                                        setValue(currentValue === value ? "" : currentValue)
                                        setOpen(false)
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
    )
}
