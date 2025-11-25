"use client";

import { useEffect, useState } from "react";
import SearchArea from "@/components/layouts/SearchArea";
import InfiniteList from "./PostCards";
import { loadMoreSurveys } from "./loadMoreSurveys";

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
    <>
      <div className="sticky top-5 z-10">
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
    </>
  );
}
