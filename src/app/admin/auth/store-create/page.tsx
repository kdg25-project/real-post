"use client";

import { useState } from "react";
import TextForm from "@/components/layouts/TextForm";
import ImageUpload from "@/components/layouts/ImageUpload";
import {
  CategoryForm,
  NativeSelectOption,
  NativeSelectOptGroup,
} from "@/components/layouts/CategoryForm";
import { companyCreate, CompanyCreateRequest } from "@/lib/api/company-create";
import { useRouter } from "next/navigation";
import PrimaryButton from "@/components/elements/PrimaryButton";
export default function StoreInformationCreationPage() {
  const [preview, setPreview] = useState<string | null>(null);
  const [form, setForm] = useState<CompanyCreateRequest>({
    companyName: "",
    companyCategory: "",
    placeUrl: "",
    imageFile: new Blob(),
  });

  const router = useRouter();

  const handleSubmit = async () => {
    if (!form.companyName || !form.companyCategory || !form.imageFile) {
      alert("会社名・カテゴリー・画像は必須です");
      return;
    }

    const result = await companyCreate(form);

    if (result.success) {
      router.push("/admin/auth/goods-register");
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="flex flex-col justify-center gap-6">
      <h1 className="flex justify-center font-bold text-2xl py-5">店舗登録</h1>
      <TextForm
        label="店舗名"
        type="text"
        placeholder="例 ご飯大好きの会"
        value={form.companyName}
        onChange={(e) => setForm({ ...form, companyName: e.target.value })}
      />
      <TextForm
        label="住所"
        type="text"
        placeholder="例 名古屋市中村区日本橋1-1"
        value={form.placeUrl}
        onChange={(e) => setForm({ ...form, placeUrl: e.target.value })}
      />
      <CategoryForm
        title="カテゴリー"
        defaultValue="1"
        onChange={(e) => setForm({ ...form, companyCategory: e.target.value })}
      >
        <NativeSelectOptGroup label="カテゴリー">
          <NativeSelectOption value="1">飲食</NativeSelectOption>
          <NativeSelectOption value="2">文化・歴史</NativeSelectOption>
          <NativeSelectOption value="3">ものづくり・ワークショップ</NativeSelectOption>
          <NativeSelectOption value="4">買い物</NativeSelectOption>
          <NativeSelectOption value="5">その他</NativeSelectOption>
        </NativeSelectOptGroup>
      </CategoryForm>
      <ImageUpload
        label="店舗画像"
        title="画像をアップロード"
        preview={preview ?? undefined}
        onChange={(file) => {
          if (!file) return;
          const url = URL.createObjectURL(file);
          setPreview(url);
          form.imageFile = file;
        }}
      />
      <PrimaryButton
        text="登録"
        onClick={async () => {
          const result = await companyCreate(form);
          if (result.success) {
            router.push("/admin/auth/goods-register");
          }
        }}
      />
    </div>
  );
}
