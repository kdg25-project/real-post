import Header from "@/components/layouts/Header";
import { loadMoreSurveys } from "./loadMoreSurveys";
import PostsContainer from "./PostsContainer";
import Slider from "@/components/layouts/SliderArea";

export default async function HomePage() {
  const initialPosts = await loadMoreSurveys(1);

  return (
    <div>
      <Header />
      <div className="pt-2 pb-4">
        <Slider />
      </div>
      <PostsContainer initialPosts={initialPosts} />
    </div>
  );
}
