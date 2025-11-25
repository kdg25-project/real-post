"use client";

import * as React from "react";
import { Settings2 } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import CategoryButton from "./CategoryButton";

type Props = {
  onFilterChange?: (age: string, country: string) => void;
};

export function FilterButton({ onFilterChange }: Props) {
  const [ageGroup, setAgeGroup] = React.useState("");
  const [country, setCountry] = React.useState("");

  const ageGroups = ["18-24", "25-34", "35-44", "45-54", "55+"];
  const countries = ["Japan", "USA", "UK", "Korea", "China"];

  // ✅ 選択した瞬間に親へ通知
  React.useEffect(() => {
    if (!onFilterChange) return;
    onFilterChange(ageGroup, country);
  }, [ageGroup, country]);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <div className="flex items-center justify-center flex-shrink-0 w-[52px] h-[52px] rounded-full bg-primary">
          <Settings2 size={28} className="text-white" />
        </div>
      </DrawerTrigger>

      <DrawerContent>
        <div className="mx-auto w-full max-w-sm p-4">
          <DrawerHeader>
            <DrawerTitle>Filter</DrawerTitle>
            <DrawerDescription>Choose your filter criteria.</DrawerDescription>
          </DrawerHeader>

          <div className="mt-4">
            <p className="font-medium mb-2">Age Group</p>
            <div className="flex flex-wrap gap-2">
              {ageGroups.map((age) => (
                <CategoryButton
                  key={age}
                  name={age}
                  selected={ageGroup === age}
                  onClick={() => setAgeGroup(age)}
                />
              ))}
            </div>
          </div>

          <div className="mt-6">
            <p className="font-medium mb-2">Country</p>
            <div className="flex flex-wrap gap-2">
              {countries.map((c) => (
                <CategoryButton
                  key={c}
                  name={c}
                  selected={country === c}
                  onClick={() => setCountry(c)}
                />
              ))}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
