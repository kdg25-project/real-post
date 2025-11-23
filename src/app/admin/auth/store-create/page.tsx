'use client';

import { useState } from "react";
import { useTranslations } from "next-intl";
import TextForm from "@/components/layouts/TextForm";
import ImageUpload from "@/components/layouts/ImageUpload";
import { CategoryForm,NativeSelectOption, NativeSelectOptGroup } from "@/components/layouts/CategoryForm";
import { companyCreate, CompanyCreateRequest } from "@/lib/api/company-create"
import { useRouter } from "next/navigation";
import PrimaryButton from "@/components/elements/PrimaryButton"
export default function StoreInformationCreationPage() {
    const t = useTranslations();
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
            alert(t('admin.requiredFields'));
            return;
        }

        const result = await companyCreate(form);

        if (result.success) {
            router.push("/admin/auth/goods-register");
        } else {
            alert(result.message);
        }
    }

    return (
        <div className="flex flex-col justify-center gap-6">
            
            <h1 className="flex justify-center font-bold text-2xl py-5">{t('admin.storeCreation')}</h1>
            <TextForm label={t('admin.companyName')} type="text" placeholder="例 ご飯大好きの会" value={form.companyName} onChange={(e) => setForm({...form, companyName: e.target.value})} />
            <TextForm label={t('admin.placeUrl')} type="text" placeholder="例 名古屋市中村区日本橋1-1" value={form.placeUrl} onChange={(e) => setForm({...form, placeUrl: e.target.value})} />
            <CategoryForm title={t('admin.companyCategory')} defaultValue="1" onChange={(e) => setForm({...form, companyCategory: e.target.value})} >
                <NativeSelectOptGroup label={t('admin.companyCategory')}>
                    <NativeSelectOption value="1">{t('categories.food')}</NativeSelectOption>
                    <NativeSelectOption value="2">{t('categories.culture')}</NativeSelectOption>
                    <NativeSelectOption value="3">{t('categories.activity')}</NativeSelectOption>
                    <NativeSelectOption value="4">{t('categories.shopping')}</NativeSelectOption>
                    <NativeSelectOption value="5">{t('categories.other')}</NativeSelectOption>
                </NativeSelectOptGroup>
            </CategoryForm>
            <ImageUpload
                label={t('admin.storeImage')}
                title={t('admin.uploadImage')}
                preview={preview ?? undefined}
                onChange={(file) => {
                    if (!file) return;
                    const url = URL.createObjectURL(file);
                    setPreview(url);
                    form.imageFile = (file);
                }}
            />
            <PrimaryButton
                text="登録"
                onClick={async () => {
                    const result = await companyCreate(form);
                    if (result.success) {
                        router.push("/admin/auth/goods-register")
                    }
                }}
            />
        </div>
    )
}