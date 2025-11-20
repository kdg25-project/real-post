'use client'

import { useState } from "react";
import { authClient } from "@/lib/auth-client"
import Header from "@/components/layouts/Header"
import TextForm from "@/components/layouts/TextForm"
import PrimaryButton from "@/components/elements/PrimaryButton"
import Spacer from "@/components/elements/Spacer"

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div>
            <Header searchArea={false} />
            <Spacer size="sm" />
            <TextForm label="Email" type="email" placeholder="example@gmail.com" />
            <TextForm label="Password" type="password" placeholder="password" />
            <PrimaryButton
                text="Login"
                onClick={async () => {
                    await authClient.signIn.email({
                        email: email,
                        password: password
                    })
                }}
            />
        </div>
    )
}