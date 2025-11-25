"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoodsCreate, GoodsCreateRequest } from "@/lib/api/goods-create";
import { useTranslations } from "next-intl";
import TextForm from "@/components/layouts/TextForm";
import ImageUpload from "@/components/layouts/ImageUpload";
import PrimaryButton from "@/components/elements/PrimaryButton";

export default function GoodsRegistration() {
  const t = useTranslations();
  const [preview1, setPreview1] = useState<string | null>(null);
  const router = useRouter();
  const [form, setForm] = useState<GoodsCreateRequest>({
    name: "",
    images: [new Blob()],
  });

  return (
    <div className="flex flex-col justify-center gap-6">
      <h1 className="flex justify-center font-bold text-2xl py-5">
        {t("admin.goodsRegistration")}
      </h1>
      <TextForm
        label={t("admin.goodsName")}
        type="text"
        placeholder={t("admin.goodsNamePlaceholder")}
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <ImageUpload
        label={t("admin.goodsImage")}
        title={t("admin.uploadImage")}
        preview={preview1 ?? undefined}
        onChange={(file) => {
          if (!file) return;
          const url = URL.createObjectURL(file);
          setPreview1(url);
          setForm({
            ...form,
            images: [file],
          });
        }}
      />
      <PrimaryButton
        text={t("admin.registerButton")}
        onClick={async () => {
          const result = await GoodsCreate(form);
          if (result.success) {
            router.push("/admin/edit");
          }
        }}
      />
    </div>
  );
}
