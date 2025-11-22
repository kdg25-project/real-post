'use client'

import { useState } from "react";
import { authClient } from "@/lib/auth-client"
import Header from "@/components/layouts/Header"
import TextForm from "@/components/layouts/TextForm"
import PrimaryButton from "@/components/elements/PrimaryButton"
import Spacer from "@/components/elements/Spacer"
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    return (
        <div>
            <Header searchArea={false} />
            <Spacer size="sm" />
            <div className="flex flex-col gap-[24px]">
                <TextForm label="Email" type="email" placeholder="example@gmail.com" onChange={(e) => setEmail(e.target.value)} />
                <TextForm label="Password" type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)} />
                <PrimaryButton
                    text="Login"
                    onClick={async () => {
                        await authClient.signIn.email({
                            email: email,
                            password: password,
                            fetchOptions: {
                                onSuccess: () => {
                                    router.push('/user/home')
                                }
                            }
                        })
                    }}
                />
                <div
                    className="font-[14px] font-medium underline"
                    onClick={() => router.push('/user/auth/signup')}
                >
                    Don’t have an account ? Sing up
                </div>
            </div>
        </div>
    )
}