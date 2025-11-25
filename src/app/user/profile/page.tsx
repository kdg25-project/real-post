"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { authClient } from "@/lib/auth-client";
import PrimaryButton from "@/components/elements/PrimaryButton";
import Header from "@/components/layouts/Header";
import Spacer from "@/components/elements/Spacer";
import Section from "@/components/layouts/Section";
import { CategoryForm } from "@/components/layouts/CategoryForm";
import { NativeSelectOptGroup } from "@/components/layouts/CategoryForm";
import { NativeSelectOption } from "@/components/layouts/CategoryForm";

interface Profile {
  email: string;
}

export default function ProfilePage() {
  const t = useTranslations();
  // 初期値を空文字にして制御コンポーネントに
  const [profile, setProfile] = useState<Profile>({ email: "" });
  const [initialProfile, setInitialProfile] = useState<Profile>({ email: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched data:", data);
        // user.email から取得
        const fetchedProfile = { email: data.user?.email ?? "" };
        setProfile(fetchedProfile);
        setInitialProfile(fetchedProfile);
      })
      .catch((err) => console.error("Fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, email: e.target.value });
  };

  const handleCancel = () => {
    setProfile(initialProfile); // 元に戻す
  };

  const handleSave = () => {
    // 本番ではここで API PUT/PATCH リクエストを送る
    console.log("Save data:", profile);
  };

  if (loading) return <p>{t("common.loading")}</p>;

  return (
    <div>
      <Header searchArea={false} />
      <Spacer size="sm" />
      <Section title={t("profile.title")} className="gap-[16px]">
        <div className="flex flex-col gap-[12px]">
          <label htmlFor="email" className="text-[16px] font-bold">
            {t("profile.email")}
          </label>
          <input
            id="email"
            type="email"
            placeholder={t("profile.emailPlaceholder")}
            value={profile.email}
            onChange={handleChange}
            className="w-full px-[20px] py-[15px] rounded-[14px] bg-white shadow-base focus:outline-none"
          />
          <CategoryForm>
            <NativeSelectOptGroup label={t("admin.countryLabel")}>
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
              <NativeSelectOption value="Belgium">
                Belgium: Nederlands / Français
              </NativeSelectOption>
            </NativeSelectOptGroup>
          </CategoryForm>
        </div>

        <div className="flex items-center gap-[16px] mt-[16px]">
          <button
            className="w-full bg-gray rounded-[15px] text-[20px] text-white font-medium py-[12px]"
            onClick={handleCancel}
          >
            {t("profile.cancel")}
          </button>
          <button
            className="w-full bg-primary rounded-[15px] text-[20px] text-white font-medium py-[12px]"
            onClick={handleSave}
          >
            {t("profile.save")}
          </button>
        </div>
      </Section>

      <div className="fixed bottom-[94px] left-1/2 -translate-x-1/2 w-full px-[24px]">
        <PrimaryButton
          text={t("auth.logout")}
          onClick={async () => {
            try {
              await authClient.signOut(); // auth-client のログアウト
              window.location.href = "/user/home"; // ログアウト後にリダイレクト
            } catch (err) {
              console.error("Logout error:", err);
            }
          }}
        />
      </div>
    </div>
  );
}
