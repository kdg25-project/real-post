'use client'

import { useState } from "react";
import { signUp } from "@/lib/auth-client"
import { useRouter } from "next/navigation";
import TextForm from "@/components/layouts/TextForm"
import PrimaryButton from "@/components/elements/PrimaryButton"

export default function SignUpPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    return (
        <div>
            <div className="flex flex-col justify-center items-center font-bold gap-20 py-5">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-dark text-[14px] font-semibold">welecome to</p>
                        <h1 className="text-[26px] font-bold leading-tight">Real Post</h1>
                    </div>
                </div>
                <p className="text-2xl">管理者登録</p>
            </div>
            <div className="flex flex-col gap-[24px]">
                <TextForm label="メールアドレス" type="email" placeholder="example@gmail.com" onChange={(e) => setEmail(e.target.value)} />
                <TextForm label="パスワード" type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)} />
                <PrimaryButton
                    text="登録"
                    onClick={async () => {
                        const result = await signUp({
                            email: email,
                            password: password,
                            accountType: "company"
                        })
                        if (result.success) {
                            router.push("/admin/auth/store-create")
                        }
                    }}
                />
            </div>
        </div>
    )
}