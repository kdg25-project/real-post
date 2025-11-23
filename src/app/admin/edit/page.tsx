'use client';

import { useState } from "react";
import { useEffect } from "react";
import Image from "next/image";
import TextForm from "@/components/layouts/TextForm";
import ImageUpload from "@/components/layouts/ImageUpload";
import { CategoryForm,NativeSelectOption, NativeSelectOptGroup } from "@/components/layouts/CategoryForm";
import { CompanyEdit, CompanyEditRequest ,} from "@/lib/api/company-edit";
import { UpdateGoods, UpdateGoodsRequest } from "@/lib/api/update-goods";
import { getCompanyDetail } from "@/lib/api/company";
import PrimaryButton from "@/components/elements/PrimaryButton";
import { get } from "http";

export default function EditPage() {
    const [preview1, setPreview1] = useState<string | null>(null);
    const [preview2, setPreview2] = useState<string | null>(null);


    const [companyImageUrl, setCompanyImageUrl] = useState<string | null>(null);

    const [company, setCompany] = useState<getCompanyDetail>({
        data: {
            id: "",
            companyName: "",
            companyCategory: "",
            imageUrl: "",
        }
    })

    const[form, setForm] = useState<CompanyEditRequest>({
        companyName: "",
        companyCategory: "",
        imageFile: new Blob(),
    });

    const[goods, setGoods] = useState<UpdateGoodsRequest>({
        name: "",
        images: [],
        deleteImageIds: [],
    });
    

    const handleSubmit = async () => {
        try {
            const result = await CompanyEdit(form);
            const result2 = await UpdateGoods(goods, );

            if (result.success && result2.success) {
                alert("情報を編集しました");
            } else {
                alert("情報の編集に失敗しました");
            }
        } catch (err) {
            console.error(err);
            alert("通信エラーが発生しました");
        }
    };

    const handleIndex = async() => {
        const res = await getCompanyDetail();
        // setFormでフォームの値に初期値を入れる
    }
    
    useEffect(() => {
        handleIndex();
    }, []);

    return (
        <div className="flex flex-col justify-center gap-6 pb-[104px] pt-10">
            {companyImageUrl && (
                <Image
                    src={companyImageUrl}
                    alt="店舗画像"
                    width={100}
                    height={100}
                    className="w-full h-[100px] mx-auto"
                />
            )}
            <p className="flex justify-center items-center text-2xl font-bold">編集</p>
            <TextForm label="店舗名" type="text" placeholder="例 ご飯大好きの会" onChange={(e) => setForm({...form, companyName: e.target.value})} />
            <TextForm label="住所" type="text" placeholder="例 名古屋市中村区日本橋1-1" />
            <CategoryForm title="カテゴリー" onChange={(e) => setForm({...form, companyCategory: e.target.value})}>
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
                title="画像をアップロード"
                preview={preview1 ?? undefined}
                onChange={(file) => {
                    if (!file) return;
                    const url = URL.createObjectURL(file);
                    setPreview1(url);
                    setCompanyImageUrl(url); 
                    form.imageFile = file;
                }}
            />
            <TextForm label="グッズ名" type="text" placeholder="例 ご飯大好き缶バッチ" value={goods.name} onChange={(e) => setGoods({...goods, name: e.target.value})} />
            <ImageUpload
                label="グッズ画像"
                title="画像をアップロード"
                preview={preview2 ?? undefined}
                onChange={(file) => {
                    if (!file) return;
                    const url = URL.createObjectURL(file);
                    setPreview2(url);
                    goods.images = [file];
                }}
            />
            <PrimaryButton
                text="更新"
                onClick={handleSubmit}
            />
        </div>
    )
}