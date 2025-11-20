'use client';

import { useState } from "react";
import TextForm from "@/components/layouts/TextForm";
import ImageUpload from "@/components/layouts/ImageUpload";
import { CategoryForm,NativeSelectOption, NativeSelectOptGroup } from "@/components/layouts/CategoryForm";

export default function EditPage() {
    const [preview, setPreview] = useState<string | null>(null);
    return (
        <div>
            <TextForm label="店舗名" type="text" placeholder="例 ご飯大好きの会" />
            <TextForm label="住所" type="text" placeholder="例 名古屋市中村区日本橋1-1" />
            <CategoryForm>
                <NativeSelectOptGroup label="カテゴリー">
                    <NativeSelectOption value="1">飲食</NativeSelectOption>
                    <NativeSelectOption value="2">文化・歴史</NativeSelectOption>
                    <NativeSelectOption value="3">ものづくり・ワークショップ</NativeSelectOption>
                    <NativeSelectOption value="4">買い物</NativeSelectOption>
                    <NativeSelectOption value="5">その他</NativeSelectOption>
                </NativeSelectOptGroup>
            </CategoryForm>
            <TextForm label="SNS" type="text" placeholder="例 https://example.com/" />
            <ImageUpload
                label="店舗画像"
                preview={preview ?? undefined}
                onChange={(file) => {
                    if (!file) return;
                    const url = URL.createObjectURL(file);
                    setPreview(url);
                }}
            />
        </div>
    )
}