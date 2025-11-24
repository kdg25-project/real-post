"use client";

import { useState } from "react";
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

interface FilterButtonProps {
  onApplyFilters?: (filters: {
    ageGroups: string[];
    countries: string[];
  }) => void;
}

export function FilterButton({ onApplyFilters }: FilterButtonProps) {
  const ageGroups = ["18-24", "25-34", "35-44", "45-54", "55+"];
  const countries = ["Japan", "USA", "UK", "Korea", "China"];

  const [selectedAgeGroups, setSelectedAgeGroups] =
    useState<string[]>(ageGroups);
  const [selectedCountries, setSelectedCountries] =
    useState<string[]>(countries);
  const [isOpen, setIsOpen] = useState(false);

  function toggleSelection<T>(
    items: T[],
    item: T,
    setItems: (items: T[]) => void,
  ) {
    if (items.includes(item)) {
      setItems(items.filter((i) => i !== item));
    } else {
      setItems([...items, item]);
    }
  }

  const handleApplyFilters = () => {
    if (onApplyFilters) {
      onApplyFilters({
        ageGroups: selectedAgeGroups,
        countries: selectedCountries,
      });
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      handleApplyFilters();
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>
        <div className="flex items-center justify-center shrink-0 w-[52px] h-[52px] rounded-full bg-primary">
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
                  selected={selectedAgeGroups.includes(age)}
                  onClick={() =>
                    toggleSelection(
                      selectedAgeGroups,
                      age,
                      setSelectedAgeGroups,
                    )
                  }
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
                  selected={selectedCountries.includes(c)}
                  onClick={() =>
                    toggleSelection(selectedCountries, c, setSelectedCountries)
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
