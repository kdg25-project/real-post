'use client'

import { useState } from "react";
import { signUp } from "@/lib/auth-client"
import { useRouter } from "next/navigation";
import TextForm from "@/components/layouts/TextForm"
import PrimaryButton from "@/components/elements/PrimaryButton"

export default function SignUpPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div>
            <div className="flex flex-col justify-center items-center font-bold gap-20 py-5">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-dark text-[14px] font-semibold">welcome to</p>
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
                        await signUp({
                            email: email,
                            password: password,
                            accountType: "company",
                        })
                        router.push("/admin/auth/store-create")
                    }}
                />
                <button className="flex justify-start w-fit text-[12px] text-gray-500 border-b-1 border-gray-500" 
                    onClick={() => router.push("/admin/auth/login") }>
                    <p>すでにアカウントをお持ちですか? ログイン</p>
                </button>
            </div>
        </div>
    )
}