'use client';

import { useState } from "react";
import { useTranslations } from "next-intl";
import TextForm from "@/components/layouts/TextForm";
import ImageUpload from "@/components/layouts/ImageUpload";

export default function GoodsRegistration() {
    const t = useTranslations();
    const [preview1, setPreview1] = useState<string | null>(null);

    return (
        <div className="flex flex-col justify-center gap-6">
            
            <h1 className="flex justify-center font-bold text-2xl py-5">{t('admin.goodsRegistration')}</h1>
            <TextForm label={t('admin.goodsName')} type="text" placeholder={t('admin.goodsNamePlaceholder')} />
            <ImageUpload
                label={t('admin.goodsImage')}
                title={t('admin.uploadImage')}
                preview={preview1 ?? undefined}
                onChange={(file) => {
                    if (!file) return;
                    const url = URL.createObjectURL(file);
                    setPreview1(url);
                }}
            />
        </div>
    )
}