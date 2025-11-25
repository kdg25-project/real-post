"use client";

import { useEffect, useState } from "react";
import SearchArea from "@/components/layouts/SearchArea";
import InfiniteList from "./PostCards";
import { loadMoreSurveys } from "./loadMoreSurveys";
import Section from "@/components/layouts/Section";
import { useTranslations } from "next-intl";
import CategoryButton from "@/components/elements/CategoryButton";

interface Post {
  id: string;
  thumbnailUrl: string | null;
  companyName: string;
  country: string;
  satisfactionLevel: number;
  favoriteCount: number;
  isFavorited: boolean | null;
}

interface PostsContainerProps {
  initialPosts: Post[];
}

export default function PostsContainer({ initialPosts }: PostsContainerProps) {
  const categories = ["all", "food", "culture", "activity", "shopping", "other"];
  const [selectedCategory, setSelectedCategory] = useState("all");
  const t = useTranslations();
  const [keyword, setKeyword] = useState("");
  const [filters, setFilters] = useState<{
    ageGroups: string[];
    countries: string[];
  }>({
    ageGroups: [],
    countries: [],
  });
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [isLoading, setIsLoading] = useState(false);

  // Reload posts when search params change
  useEffect(() => {
    // Skip initial render
    if (keyword === "" && filters.ageGroups.length === 0 && filters.countries.length === 0) {
      return;
    }

    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const newPosts = await loadMoreSurveys(1, keyword, filters);
        setPosts(newPosts);
      } catch (error) {
        console.error("Failed to load posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [keyword, filters]);

  const handleSearch = (searchKeyword: string) => {
    setKeyword(searchKeyword);
  };

  const handleFilterChange = (newFilters: { ageGroups: string[]; countries: string[] }) => {
    setFilters(newFilters);
  };

  return (
    <Section title={t("home.posts")} className="gap-4 pb-24">
      <div className="sticky top-2 z-10">
        <div className="flex gap-[16px] py-2 overflow-x-auto">
          {categories.map((cat) => (
            <CategoryButton
              key={cat}
              name={t(`categories.${cat}`)}
              selected={selectedCategory === cat}
              onClick={() => setSelectedCategory(cat)}
            />
          ))}
        </div>
        <SearchArea onSearch={handleSearch} onFilterChange={handleFilterChange} />
      </div>
      {isLoading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <InfiniteList
          initialPosts={posts}
          loadMoreAction={loadMoreSurveys}
          keyword={keyword}
          filters={filters}
        />
      )}
    </Section>
  );
}
