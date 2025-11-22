import Slider from "@/components/layouts/SliderArea";
import Section from "@/components/layouts/Section";
import GoodsCard from "@/components/elements/GoodsCard";

export default function GoodsPage() {
    return (
        <div className="flex flex-col gap-[24px] pt-[56px] pb-[94px]">
            <Slider />
            <Section title="Goods" className="gap-[24px]">
                <div className="flex flex-wrap justify-between w-full gap-[24px]">
                    <GoodsCard />
                    <GoodsCard />
                    <GoodsCard />
                    <GoodsCard />
                    <GoodsCard />
                    <GoodsCard />
                    <GoodsCard />
                    <GoodsCard />
                    <GoodsCard />
                    <GoodsCard />
                    <GoodsCard />
                    <GoodsCard />
                </div>
            </Section>
        </div>
    );
}
