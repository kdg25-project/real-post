"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import TextForm from "@/components/layouts/TextForm";
import PrimaryButton from "@/components/elements/PrimaryButton";

export default function SignUpPage() {
  const t = useTranslations();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
      <div className="flex flex-col justify-center items-center font-bold gap-20 py-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-dark text-[14px] font-semibold">{t("common.welcome")}</p>
            <h1 className="text-[26px] font-bold leading-tight">{t("common.appName")}</h1>
          </div>
        </div>
        <p className="text-2xl">{t("admin.registerTitle")}</p>
      </div>
      <div className="flex flex-col gap-[24px]">
        <TextForm
          label={t("admin.emailLabel")}
          type="email"
          placeholder="example@gmail.com"
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextForm
          label={t("admin.passwordLabel")}
          type="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <PrimaryButton
          text={t("admin.registerButton")}
          onClick={async () => {
            await signUp({
              email: email,
              password: password,
              accountType: "company",
            });
            router.push("/admin/auth/store-create");
          }}
        />
        <button
          className="flex justify-start w-fit text-[12px] text-gray-500 border-b-1 border-gray-500"
          onClick={() => router.push("/admin/auth/login")}
        >
          <p>{t("auth.alreadyHaveAccount")}</p>
        </button>
      </div>
    </div>
  );
}
