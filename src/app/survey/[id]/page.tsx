'use client'

import React, { useEffect } from "react"
import { useTranslations } from "next-intl";
import { Check } from "lucide-react"
import { useState } from "react"
import Header from "@/components/layouts/Header"
import ImageUpload from "@/components/layouts/ImageUpload"
import TextForm from "@/components/layouts/TextForm"
import { CategoryForm, NativeSelectOption, NativeSelectOptGroup } from "@/components/layouts/CategoryForm"
import { SurveyCreate, SurveyCreateRequest } from "@/lib/api/survey-create"
import PrimaryButton from "@/components/elements/PrimaryButton"
import { useRouter } from "next/navigation"
import { useParams, useSearchParams } from "next/navigation"
import { getCompanyDetail } from "@/lib/api/company";

type CompanyData = {
    imageUrl?: string | null;
    companyName?: string | null;
    placeUrl?: string | null;
    placeId?: string | null;
    [key: string]: unknown;
};

export default function Survey() {
    const router = useRouter();
    const t = useTranslations();
    const token = useSearchParams().get("token");
    const id = useParams().id
    const [preview1, setPreview1] = useState<string | null>(null);
    const [isChecked, setIsChecked] = useState(false);
    const [validToken, setValidToken] = useState(true);
    const [company, setCompany] = useState<CompanyData | null>(null);
    const [form, setForm] = useState<SurveyCreateRequest>({
        country: "",
        gender: null,
        ageGroup: null,
        satisfactionLevel: 0,
        description: "",
        thumbnail: new Blob(),
        images: [new Blob()],
    })

    useEffect(() => {
        fetch(`/api/surveys/token?company_id=${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(response => response.json())
            .then(async data => {

                const result = await getCompanyDetail(id as string);
                if (result.success) {
                    setCompany(result.data);
                }

                if (data.data.isValid) {
                    setValidToken(true);
                } else {
                    setValidToken(false);
                }
            })
            .catch(() => {
                setValidToken(false);
            });
    }, [token, id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsChecked(e.target.checked);
    };

    return (
        validToken === false ? (
            <div className="flex flex-col gap-6 w-[402px] h-screen mx-auto mb-20 px-[24px] overflow-hidden overflow-y-auto">
                <Header searchArea={false} />
                <div className="flex flex-col justify-center items-center text-black pt-35">
                    <p className="text-2xl font-bold">{company?.companyName ?? ""}</p>
                    <p className="text-center">{t('survey.invalidTokenMessage')}</p>
                </div>
            </div>
        ) : (
            <div className="flex flex-col gap-6 w-[402px] h-screen mx-auto mb-20 px-[24px] overflow-hidden overflow-y-auto">
                <Header searchArea={false} />
                <div className="flex flex-col justify-center items-center text-black pt-35">
                    <p className="text-2xl font-bold">{company?.companyName ?? ""}</p>
                    <p>{t('survey.pleaseParticipate')}</p>
                </div>
                <ImageUpload
                    label={t('survey.postThumbnail')}
                    title={t('survey.selectFile')}
                    preview={preview1 ?? undefined}
                    onChange={(file) => {
                        if (!file) return;
                        const url = URL.createObjectURL(file);
                        setPreview1(url);
                        setForm({
                            ...form,
                            thumbnail: file,
                            images: [file],
                        })

                    }}
                />
                <TextForm label={t('survey.yourCountry')} placeholder="Japan" type="text" onChange={(e) => setForm({ ...form, country: e.target.value })} />
                <CategoryForm title={t('survey.yourGender')} defaultValue={4} onChange={(e) => setForm({ ...form, gender: (e.target.value || null) as "male" | "female" | "other" | null })} >
                    <NativeSelectOptGroup label={t('survey.yourGender')}>
                        <NativeSelectOption value="male">{t('gender.male')}</NativeSelectOption>
                        <NativeSelectOption value="female">{t('gender.female')}</NativeSelectOption>
                        <NativeSelectOption value="other">{t('gender.other')}</NativeSelectOption>
                        <NativeSelectOption value="">{t('gender.noAnswer')}</NativeSelectOption>
                    </NativeSelectOptGroup>
                </CategoryForm>
                <CategoryForm title={t('survey.yourAge')} defaultValue={6} onChange={(e) => setForm({ ...form, ageGroup: (e.target.value || null) as "18-24" | "25-34" | "35-44" | "45-54" | "55+" | null })}>
                    <NativeSelectOptGroup label={t('survey.yourAge')}>
                        <NativeSelectOption value="1">{t('ageGroup.18-24')}</NativeSelectOption>
                        <NativeSelectOption value="2">{t('ageGroup.25-34')}</NativeSelectOption>
                        <NativeSelectOption value="3">{t('ageGroup.35-44')}</NativeSelectOption>
                        <NativeSelectOption value="4">{t('ageGroup.45-54')}</NativeSelectOption>
                        <NativeSelectOption value="5">{t('ageGroup.55+')}</NativeSelectOption>
                        <NativeSelectOption value="6">{t('ageGroup.noAnswer')}</NativeSelectOption>
                    </NativeSelectOptGroup>
                </CategoryForm>
                <CategoryForm title={t('survey.yourSatisfaction')} defaultValue={5} onChange={(e) => setForm({ ...form, satisfactionLevel: Number(e.target.value) })}>
                    <NativeSelectOptGroup label={t('survey.yourSatisfaction')}>
                        <NativeSelectOption value="1">1</NativeSelectOption>
                        <NativeSelectOption value="2">2</NativeSelectOption>
                        <NativeSelectOption value="3">3</NativeSelectOption>
                        <NativeSelectOption value="4">4</NativeSelectOption>
                        <NativeSelectOption value="5">5</NativeSelectOption>
                    </NativeSelectOptGroup>
                </CategoryForm>
                <div className="flex flex-col gap-[12px] m-0">
                    <p>{t('survey.yourReview')}</p>
                    <textarea className=" w-full h-40 p-5 bg-white shadow-base rounded-[14px] resize-none" name={t('survey.yourReview')} id="" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}>

                    </textarea>
                </div>

                <input className="hidden" checked={isChecked} onChange={handleChange} type="checkbox" id="policy" />
                <label htmlFor="policy" className="cursor-pointer select-none">
                    <div className="flex justify-center items-center gap-2">
                        {isChecked
                            ? <div className="flex justify-center items-center w-[18px] h-[18px] border-1 border-black bg-blue-400 rounded-[5px]" >
                                <Check size={12} className="text-white" />
                            </div>
                            : (
                                <div className="w-[18px] h-[18px] border-1 border-black bg-white rounded-[5px]" />
                            )}
                        <p>{t('survey.agreePolicy')}</p>
                    </div>
                </label>
                <PrimaryButton
                    text={t('survey.submit')}
                    onClick={async () => {
                        if (!isChecked) return;
                        await SurveyCreate(form, id as string, token);
                        router.push("/survey/completion")
                    }} />
            </div>
        ))
}