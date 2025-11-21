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
    const [country, setCountry] = useState("Japan"); // デフォルト値を設定

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
                    <option value="Japan">Japan: 日本</option>
                    <option value="Korea">Korea: 한국</option>
                    <option value="USA">USA: English</option>
                    <option value="China">China: 中国</option>
                    <option value="France">France: Français</option>
                    <option value="Germany">Germany: Deutsch</option>
                    <option value="Spain">Spain: Español</option>
                    <option value="Italy">Italy: Italiano</option>
                    <option value="Russia">Russia: Русский</option>
                    <option value="Thailand">Thailand: ไทย</option>
                    <option value="Vietnam">Vietnam: Tiếng Việt</option>
                    <option value="India">India: हिन्दी</option>
                    <option value="Brazil">Brazil: Português</option>
                    <option value="Egypt">Egypt: العربية</option>
                    <option value="SaudiArabia">Saudi Arabia: العربية</option>
                    <option value="Sweden">Sweden: Svenska</option>
                    <option value="Norway">Norway: Norsk</option>
                    <option value="Finland">Finland: Suomi</option>
                    <option value="Netherlands">Netherlands: Nederlands</option>
                    <option value="Belgium">Belgium: Nederlands / Français</option>
                </select>

                <PrimaryButton
                    text="SignUp"
                    onClick={async () => {
                        await signUp({
                            email: email,
                            password: password,
                            accountType: "user",
                            country: country, // ここで国も送信
                        })
                    }}
                />
            </div>
        </div>
    )
}
