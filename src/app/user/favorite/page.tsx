import Header from "@/components/layouts/Header";
import Spacer from "@/components/elements/Spacer";
import Section from "@/components/layouts/Section";
import PostCard from "@/components/elements/PostCard";

export default function FavoritePage() {
    return (
        <div>
            <Header searchArea={true} />

            <Spacer size="lg" />
            <Section title="Favorite Posts" className="gap-[16px]">
                <div className="flex flex-col gap-[20px] mb-[94px]">
                    {/* <PostCard />
                    <PostCard />
                    <PostCard />
                    <PostCard />
                    <PostCard /> */}
                </div>
            </Section>
        </div>
    );
}
