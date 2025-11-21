'use client'

import { useState } from "react";
import { signUp } from "@/lib/auth-client"
import Header from "@/components/layouts/Header"
import TextForm from "@/components/layouts/TextForm"
import PrimaryButton from "@/components/elements/PrimaryButton"
import Spacer from "@/components/elements/Spacer"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";

const COUNTRIES = [
  "Japan",
  "United States",
  "United Kingdom",
  "China",
  "Korea",
  "Taiwan",
  "Thailand",
  "Vietnam",
  "Other"
];

export default function SignUpPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [country, setCountry] = useState("");

    return (
        <div>
            <Header searchArea={false} />
            <Spacer size="sm" />
            <div className="flex flex-col gap-[24px]">
                <TextForm label="Email" type="email" placeholder="example@gmail.com" onChange={(e) => setEmail(e.target.value)} />
                <TextForm label="Password" type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)} />
                
                <div className="flex flex-col gap-[12px] m-0">
                    <label className="text-[16px] font-bold">Country</label>
                    <div className="w-full px-[20px] py-[15px] rounded-[14px] bg-white shadow-base focus:outline-none relative">
                        <NativeSelect 
                            value={country} 
                            onChange={(e) => setCountry(e.target.value)} 
                            className="border-none shadow-none p-0 h-auto bg-transparent focus-visible:ring-0 w-full"
                        >
                            <NativeSelectOption value="">Select Country</NativeSelectOption>
                            {COUNTRIES.map((c) => (
                                <NativeSelectOption key={c} value={c}>{c}</NativeSelectOption>
                            ))}
                        </NativeSelect>
                    </div>
                </div>

                <PrimaryButton
                    text="SignUp"
                    onClick={async () => {
                        await signUp({
                            email: email,
                            password: password,
                            accountType: "user",
                            country: country || undefined,
                        })
                    }}
                />
            </div>
        </div>
    )
}