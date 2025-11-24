"use client";

import { useEffect, useState } from "react";
import Slider from "@/components/layouts/SliderArea";
import Section from "@/components/layouts/Section";
import GoodsCard from "@/components/elements/GoodsCard";
import { getGoodsList } from "@/lib/api/goods";

export default function GoodsPage() {
  const [goods, setGoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGoods = async () => {
      const res = await getGoodsList(1, 20);

      if (res && res.data) {
        setGoods(res.data);
      }

      setLoading(false);
    };

    fetchGoods();
  }, []);

  if (loading) {
    return <div className="pt-[56px] text-center">Loading...</div>;
  }

  if (!goods.length) {
    return <div className="pt-[56px] text-center">No Goods</div>;
  }

  return (
    <div className="flex flex-col gap-[24px] pt-[56px] pb-[94px]">
      <Slider />
      <Section title="Goods" className="gap-[24px]">
        <div className="flex flex-wrap justify-between w-full gap-[24px]">
          {goods.map((item) => (
            <GoodsCard
              key={item.id}
              companyId={item.companyId}
              imageUrl={item.images?.[0]?.imageUrl}
            />
          ))}
        </div>
      </Section>
    </div>
  );
}
