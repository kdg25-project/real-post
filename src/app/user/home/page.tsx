import Header from "@/components/layouts/Header";
import Section from "@/components/layouts/Section";
import { loadMoreSurveys } from "./loadMoreSurveys";
import PostsContainer from "./PostsContainer";

export default async function HomePage() {
  const initialPosts = await loadMoreSurveys(1);

  return (
    <div>
      <Header />

      <Section title="Posts" className="gap-4 pb-24">
        <PostsContainer initialPosts={initialPosts} />
      </Section>
    </div>
  );
}
