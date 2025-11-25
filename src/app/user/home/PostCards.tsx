"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import PostCard from "@/components/elements/PostCard";
import { Loader2 } from "lucide-react";

interface Post {
  id: string;
  thumbnailUrl: string | null;
  companyName: string;
  country: string;
  satisfactionLevel: number;
  favoriteCount: number;
  isFavorited: boolean | null;
}

interface InfiniteListProps {
  initialPosts: Post[];
  loadMoreAction: (
    page: number,
    keyword?: string,
    filters?: {
      ageGroups: string[];
      countries: string[];
    }
  ) => Promise<Post[]>;
  keyword?: string;
  filters?: {
    ageGroups: string[];
    countries: string[];
  };
}

export default function InfiniteList({
  initialPosts,
  loadMoreAction,
  keyword,
  filters,
}: InfiniteListProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);

  // Reset posts when search params change
  useEffect(() => {
    setPosts(initialPosts);
    setPage(1);
    setHasMore(true);
    loadingRef.current = false;
  }, [initialPosts, keyword, filters]);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;

    loadingRef.current = true;
    const nextPage = page + 1;

    try {
      const nextPosts = await loadMoreAction(nextPage, keyword, filters);

      if (!nextPosts || nextPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prev) => {
          // 重複を防ぐため、既存のIDをSetで管理
          const existingIds = new Set(prev.map((post) => post.id));
          const uniqueNewPosts = nextPosts.filter((post) => !existingIds.has(post.id));
          return [...prev, ...uniqueNewPosts];
        });
        setPage(nextPage);
      }
    } catch (error) {
      console.error("Failed to load more posts:", error);
    } finally {
      loadingRef.current = false;
    }
  }, [page, hasMore, loadMoreAction, keyword, filters]);

  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          loadMore();
        }
      },
      {
        rootMargin: "100px",
      }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loadMore, keyword, filters]);

  return (
    <>
      <div className="flex flex-col gap-5">
        {posts.map((item) => (
          <PostCard
            key={item.id}
            id={item.id}
            thumbnailUrl={item.thumbnailUrl ?? null}
            companyName={item.companyName}
            country={item.country}
            satisfactionLevel={item.satisfactionLevel}
            favoriteCount={item.favoriteCount}
            isFavorited={item.isFavorited}
          />
        ))}
        {hasMore && (
          <div ref={loaderRef} className="text-center">
            <Loader2 className="animate-spin mx-auto" />
          </div>
        )}
      </div>
    </>
  );
}
