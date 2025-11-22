'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoodsCreate, GoodsCreateRequest } from "@/lib/api/goods-create"
import TextForm from "@/components/layouts/TextForm";
import ImageUpload from "@/components/layouts/ImageUpload";
import PrimaryButton from "@/components/elements/PrimaryButton";

export default function GoodsRegistration() {
    const [preview1, setPreview1] = useState<string | null>(null);
    const router = useRouter();
    const [form, setForm] = useState<GoodsCreateRequest>({
        name: "",
        images: [new Blob()],
    })

    return (
        <div className="flex flex-col justify-center gap-6">
            
            <h1 className="flex justify-center font-bold text-2xl py-5">グッズ登録</h1>
            <TextForm label="グッズ名" type="text" placeholder="例 ご飯大好き缶バッチ" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} />
            <ImageUpload
                label="グッズ画像"
                title="画像をアップロード"
                preview={preview1 ?? undefined}
                onChange={(file) => {
                    if (!file) return;
                    const url = URL.createObjectURL(file);
                    setPreview1(url);
                    form.images = [file];
                }}
            />
            <PrimaryButton
            text="登録"
            onClick={async () => {
                const result = await GoodsCreate(form);
                if (result.success){
                    router.push("/admin/edit")
                }
            }}
            />
        </div>
    )
}