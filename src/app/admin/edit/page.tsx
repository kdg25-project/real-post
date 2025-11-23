'use client';

import { useState } from "react";
import { useEffect } from "react";
import Image from "next/image";
import TextForm from "@/components/layouts/TextForm";
import ImageUpload from "@/components/layouts/ImageUpload";
import { CategoryForm, NativeSelectOption, NativeSelectOptGroup } from "@/components/layouts/CategoryForm";
import { CompanyEdit, CompanyEditRequest, } from "@/lib/api/company-edit";
import { UpdateGoods, UpdateGoodsRequest } from "@/lib/api/update-goods";
import { getCompanyDetail } from "@/lib/api/company";
import PrimaryButton from "@/components/elements/PrimaryButton";
import { useSession } from "@/lib/auth-client";

export default function EditPage() {
    const { data } = useSession();
    // companyのフォーム情報
    const [company, setCompany] = useState<CompanyEditRequest>({
        companyName: "",
        companyCategory: "",
        imageFile: new Blob(),
    });
    // goodsのフォーム情報
    const [goods, setGoods] = useState<UpdateGoodsRequest>({
        name: "",
        images: [],
        deleteImageIds: [],
    });
    // 画像のURL（フォームの画像のURL）
    const [imageUrls, setImageUrls] = useState({
        companyImageUrl: "",
        goodsImageUrl: "",
    });
    const [goodsId, setGoodsId] = useState("");

    const handleSubmit = async () => {
        try {
            const result = await CompanyEdit(company);
            const result2 = await UpdateGoods(goods, goodsId);
            // nullチェック
            if (result?.success && result2?.success) {
                alert("情報を編集しました");
            } else {
                alert("情報の編集に失敗しました");
            }
        } catch (err) {
            console.error(err);
            alert("通信エラーが発生しました");
        }
    };

    const handleIndex = async () => {
        if (!data?.user.id) return;
        const res = await getCompanyDetail(data?.user.id);
        if (res.success === false) {
            // TODO: alertを良いUIに変更する。
            alert(res.message);
            return;
        }
        setCompany({
            companyName: res.data.companyName,
            companyCategory: res.data.companyCategory,
            // ここに画像ファイルを入れる。
            imageFile: new Blob(),
        });

        if (!res.data.goods) return;
        setGoods({
            name: res.data.goods.name,
            images: [],
            deleteImageIds: [res.data.goods.id],
        });
        setImageUrls({
            companyImageUrl: res.data.imageUrl,
            goodsImageUrl: res.data.goods.imageUrl,
        });
        setGoodsId(res.data.goods.id);
    }

    useEffect(() => {
        handleIndex();
    }, [data]);

    return (
        <div className="flex flex-col justify-center gap-6 pb-[104px] pt-10">
            {/* {imageUrls.companyImageUrl &&
                <Image
                    src={imageUrls.companyImageUrl}
                    alt="店舗画像"
                    width={100}
                    height={100}
                    className="w-full h-[100px] mx-auto"
                />
            } */}
            <p className="flex justify-center items-center text-2xl font-bold">編集</p>
            <TextForm label="店舗名" type="text" placeholder="例 ご飯大好きの会" value={company.companyName} onChange={(e) => setCompany({ ...company, companyName: e.target.value })} />
            <TextForm label="住所" type="text" placeholder="例 名古屋市中村区日本橋1-1" />
            <CategoryForm title="カテゴリー" value={company.companyCategory} onChange={(e) => setCompany({ ...company, companyCategory: e.target.value })}>
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
                preview={imageUrls.companyImageUrl ?? undefined}
                onChange={(file) => {
                    if (!file) return;
                    const url = URL.createObjectURL(file);
                    setImageUrls({
                        ...imageUrls,
                        companyImageUrl: url
                    })
                    company.imageFile = file;
                }}
            />
            <TextForm label="グッズ名" type="text" placeholder="例 ご飯大好き缶バッチ" value={goods.name} onChange={(e) => setGoods({ ...goods, name: e.target.value })} />
            <ImageUpload
                label="グッズ画像"
                title="画像をアップロード"
                preview={imageUrls.goodsImageUrl || undefined}
                onChange={(file) => {
                    if (!file) return;
                    const url = URL.createObjectURL(file);
                    setImageUrls({
                        ...imageUrls,
                        goodsImageUrl: url
                    });
                    setGoods({ ...goods, images: [file] });
                }}
            />
            <PrimaryButton
                text="更新"
                onClick={handleSubmit}
            />
        </div>
    )
}