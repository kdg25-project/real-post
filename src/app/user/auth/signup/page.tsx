'use client'

import { useState } from "react";
import { signUp } from "@/lib/auth-client"
import Header from "@/components/layouts/Header"
import TextForm from "@/components/layouts/TextForm"
import PrimaryButton from "@/components/elements/PrimaryButton"
import Spacer from "@/components/elements/Spacer"

export default function SignUpPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div>
            <Header searchArea={false} />
            <Spacer size="sm" />
            <TextForm label="Email" type="email" placeholder="example@gmail.com" onChange={(e) => setEmail(e.target.value)} />
            <TextForm label="Password" type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)} />
            <PrimaryButton
                text="SignUp"
                onClick={async () => {
                    await signUp({
                        email: email,
                        password: password,
                        accountType: "user",
                    })
                }}
            />
        </div>
    )
}