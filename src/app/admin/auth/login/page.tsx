"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import TextForm from "@/components/layouts/TextForm";
import PrimaryButton from "@/components/elements/PrimaryButton";

export default function LoginPage() {
  const t = useTranslations();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  return (
    <div className="flex flex-col justify-center ">
      <div className="flex flex-col justify-center items-center font-bold gap-20 py-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-dark text-[14px] font-semibold">welcome to</p>
            <h1 className="text-[26px] font-bold leading-tight">Real Post</h1>
          </div>
        </div>
        <p className="text-2xl">{t("auth.adminLogin")}</p>
      </div>
      <div className="flex flex-col gap-[24px]">
        <TextForm
          label={t("admin.emailLabel")}
          type="email"
          placeholder="example@gmail.com"
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextForm
          label="パスワード"
          type="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <PrimaryButton
          text={t("admin.loginButton")}
          onClick={async () => {
            await authClient.signIn.email({
              email: email,
              password: password,
              fetchOptions: {
                onSuccess: () => {
                  router.push("/admin/edit");
                },
              },
            });
          }}
        />
        <button
          className="flex justify-start w-fit  text-[12px] text-gray-500 border-b-1 border-gray-500"
          onClick={() => router.push("/admin/auth/signup")}
        >
          <p>{t("admin.noAccountMessage")}</p>
        </button>
      </div>
    </div>
  );
}
