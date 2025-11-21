'use client'

import { useState } from "react";
import { signUp } from "@/lib/auth-client"
import Header from "@/components/layouts/Header"
import TextForm from "@/components/layouts/TextForm"
import PrimaryButton from "@/components/elements/PrimaryButton"
import Spacer from "@/components/elements/Spacer"
import { CategoryForm, NativeSelectOptGroup, NativeSelectOption } from "@/components/layouts/CategoryForm";

export default function SignUpPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [country, setCountry] = useState("JP"); // デフォルト値を設定

    return (
        <div>
            <Header searchArea={false} />
            <Spacer size="sm" />
            <div className="flex flex-col gap-[24px]">
                <TextForm label="Email" type="email" placeholder="example@gmail.com" onChange={(e) => setEmail(e.target.value)} />
                <TextForm label="Password" type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)} />

                {/* <CategoryForm>
                    <NativeSelectOptGroup label="国">
                        <NativeSelectOption value="Japan">Japan: 日本</NativeSelectOption>
                        <NativeSelectOption value="Korea">Korea: 한국</NativeSelectOption>
                        <NativeSelectOption value="USA">USA: English</NativeSelectOption>
                        <NativeSelectOption value="China">China: 中国</NativeSelectOption>
                        <NativeSelectOption value="France">France: Français</NativeSelectOption>
                        <NativeSelectOption value="Germany">Germany: Deutsch</NativeSelectOption>
                        <NativeSelectOption value="Spain">Spain: Español</NativeSelectOption>
                        <NativeSelectOption value="Italy">Italy: Italiano</NativeSelectOption>
                        <NativeSelectOption value="Russia">Russia: Русский</NativeSelectOption>
                        <NativeSelectOption value="Thailand">Thailand: ไทย</NativeSelectOption>
                        <NativeSelectOption value="Vietnam">Vietnam: Tiếng Việt</NativeSelectOption>
                        <NativeSelectOption value="India">India: हिन्दी</NativeSelectOption>
                        <NativeSelectOption value="Brazil">Brazil: Português</NativeSelectOption>
                        <NativeSelectOption value="Egypt">Egypt: العربية</NativeSelectOption>
                        <NativeSelectOption value="SaudiArabia">Saudi Arabia: العربية</NativeSelectOption>
                        <NativeSelectOption value="Sweden">Sweden: Svenska</NativeSelectOption>
                        <NativeSelectOption value="Norway">Norway: Norsk</NativeSelectOption>
                        <NativeSelectOption value="Finland">Finland: Suomi</NativeSelectOption>
                        <NativeSelectOption value="Netherlands">Netherlands: Nederlands</NativeSelectOption>
                        <NativeSelectOption value="Belgium">Belgium: Nederlands / Français</NativeSelectOption>
                    </NativeSelectOptGroup>
                </CategoryForm> */}

                <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-[20px] py-[15px] rounded-[14px] bg-white shadow-base focus:outline-none appearance-none"
                >
                    <option value="JP">Japan: 日本</option>
                    <option value="KR">Korea: 한국</option>
                    <option value="US">USA: English</option>
                    <option value="CN">China: 中国</option>
                    <option value="GB">United Kingdom: English</option>
                    <option value="CA">Canada: English / Français</option>
                    <option value="AU">Australia: English</option>
                    <option value="FR">France: Français</option>
                    <option value="DE">Germany: Deutsch</option>
                    <option value="ES">Spain: Español</option>
                    <option value="IT">Italy: Italiano</option>
                    <option value="RU">Russia: Русский</option>
                    <option value="TH">Thailand: ไทย</option>
                    <option value="VN">Vietnam: Tiếng Việt</option>
                    <option value="IN">India: हिन्दी</option>
                    <option value="ID">Indonesia: Bahasa Indonesia</option>
                    <option value="MY">Malaysia: Bahasa Melayu</option>
                    <option value="PH">Philippines: English / Filipino</option>
                    <option value="SG">Singapore: English / 中文</option>
                    <option value="BR">Brazil: Português</option>
                    <option value="MX">Mexico: Español</option>
                    <option value="AR">Argentina: Español</option>
                    <option value="EG">Egypt: العربية</option>
                    <option value="SA">Saudi Arabia: العربية</option>
                    <option value="TR">Turkey: Türkçe</option>
                    <option value="ZA">South Africa: English</option>
                    <option value="SE">Sweden: Svenska</option>
                    <option value="NO">Norway: Norsk</option>
                    <option value="FI">Finland: Suomi</option>
                    <option value="DK">Denmark: Dansk</option>
                    <option value="NL">Netherlands: Nederlands</option>
                    <option value="BE">Belgium: Nederlands / Français</option>
                    <option value="CH">Switzerland: Deutsch / Français</option>
                    <option value="PL">Poland: Polski</option>
                    <option value="UA">Ukraine: Українська</option>
                </select>

                <PrimaryButton
                    text="SignUp"
                    onClick={async () => {
                        await signUp({
                            email: email,
                            password: password,
                            accountType: "user",
                            // country: country, // ここで国も送信
                        })
                    }}
                />
            </div>
        </div>
    )
}
