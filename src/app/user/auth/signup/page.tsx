'use client'

import { useState } from "react";
import { useTranslations } from "next-intl";
import { signUp } from "@/lib/auth-client"
import Header from "@/components/layouts/Header"
import TextForm from "@/components/layouts/TextForm"
import PrimaryButton from "@/components/elements/PrimaryButton"
import Spacer from "@/components/elements/Spacer"
import { useRouter } from "next/navigation";

export default function SignUpPage() {
    const t = useTranslations();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [country, setCountry] = useState("");
    const router = useRouter();

    return (
        <div>
            <Header searchArea={false} />
            <Spacer size="sm" />
            <div className="flex flex-col gap-[24px]">
                <TextForm label={t('auth.email')} type="email" placeholder="example@gmail.com" onChange={(e) => setEmail(e.target.value)} />
                <TextForm label={t('auth.password')} type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)} />

                <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-[20px] py-[15px] rounded-[14px] bg-white shadow-base focus:outline-none appearance-none"
                >
                    <option value="JP">{t('countries.JP')}</option>
                    <option value="KR">{t('countries.KR')}</option>
                    <option value="US">{t('countries.US')}</option>
                    <option value="CN">{t('countries.CN')}</option>
                    <option value="GB">{t('countries.GB')}</option>
                    <option value="CA">{t('countries.CA')}</option>
                    <option value="AU">{t('countries.AU')}</option>
                    <option value="FR">{t('countries.FR')}</option>
                    <option value="DE">{t('countries.DE')}</option>
                    <option value="ES">{t('countries.ES')}</option>
                    <option value="IT">{t('countries.IT')}</option>
                    <option value="RU">{t('countries.RU')}</option>
                    <option value="TH">{t('countries.TH')}</option>
                    <option value="VN">{t('countries.VN')}</option>
                    <option value="IN">{t('countries.IN')}</option>
                    <option value="ID">{t('countries.ID')}</option>
                    <option value="MY">{t('countries.MY')}</option>
                    <option value="PH">{t('countries.PH')}</option>
                    <option value="SG">{t('countries.SG')}</option>
                    <option value="BR">{t('countries.BR')}</option>
                    <option value="MX">{t('countries.MX')}</option>
                    <option value="AR">{t('countries.AR')}</option>
                    <option value="EG">{t('countries.EG')}</option>
                    <option value="SA">{t('countries.SA')}</option>
                    <option value="TR">{t('countries.TR')}</option>
                    <option value="ZA">{t('countries.ZA')}</option>
                    <option value="SE">{t('countries.SE')}</option>
                    <option value="NO">{t('countries.NO')}</option>
                    <option value="FI">{t('countries.FI')}</option>
                    <option value="DK">{t('countries.DK')}</option>
                    <option value="NL">{t('countries.NL')}</option>
                    <option value="BE">{t('countries.BE')}</option>
                    <option value="CH">{t('countries.CH')}</option>
                    <option value="PL">{t('countries.PL')}</option>
                    <option value="UA">{t('countries.UA')}</option>
                </select>

                <PrimaryButton
                    text={t('auth.signup')}
                    onClick={async () => {
                        const result = await signUp({
                            email: email,
                            password: password,
                            accountType: "user",
                            country: country,
                        })

                        if (result.success) {
                            router.push('/user/home')
                        }
                    }}
                />
                <div
                    className="font-[14px] font-medium underline"
                    onClick={() => router.push('/user/auth/login')}
                >
                    {t('auth.alreadyHaveAccount')}
                </div>
            </div>
        </div>
    )
}
