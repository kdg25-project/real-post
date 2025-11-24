"use client";

import { useState } from "react";
import { signUp } from "@/lib/auth-client";
import Header from "@/components/layouts/Header";
import TextForm from "@/components/layouts/TextForm";
import PrimaryButton from "@/components/elements/PrimaryButton";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState("");
  const router = useRouter();

  return (
    <div>
      <Header />
      <div className="flex flex-col gap-[24px]">
        <TextForm
          label="Email"
          type="email"
          placeholder="example@gmail.com"
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextForm
          label="Password"
          type="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-full px-[20px] py-[15px] rounded-[14px] bg-white shadow-base focus:outline-none appearance-none"
        >
          <option value="JP">Japan: 日本</option>
          <option value="KR">Korea: 한국</option>
          <option value="US">USA: English</option>
          <option value="CN">China: 中国</option>
          <option value="GB">United Kingdom: English</option>
          <option value="CA">Canada: English / Français</option>
          <option value="AU">Australia: English</option>
          <option value="FR">France: Français</option>
          <option value="DE">Germany: Deutsch</option>
          <option value="ES">Spain: Español</option>
          <option value="IT">Italy: Italiano</option>
          <option value="RU">Russia: Русский</option>
          <option value="TH">Thailand: ไทย</option>
          <option value="VN">Vietnam: Tiếng Việt</option>
          <option value="IN">India: हिन्दी</option>
          <option value="ID">Indonesia: Bahasa Indonesia</option>
          <option value="MY">Malaysia: Bahasa Melayu</option>
          <option value="PH">Philippines: English / Filipino</option>
          <option value="SG">Singapore: English / 中文</option>
          <option value="BR">Brazil: Português</option>
          <option value="MX">Mexico: Español</option>
          <option value="AR">Argentina: Español</option>
          <option value="EG">Egypt: العربية</option>
          <option value="SA">Saudi Arabia: العربية</option>
          <option value="TR">Turkey: Türkçe</option>
          <option value="ZA">South Africa: English</option>
          <option value="SE">Sweden: Svenska</option>
          <option value="NO">Norway: Norsk</option>
          <option value="FI">Finland: Suomi</option>
          <option value="DK">Denmark: Dansk</option>
          <option value="NL">Netherlands: Nederlands</option>
          <option value="BE">Belgium: Nederlands / Français</option>
          <option value="CH">Switzerland: Deutsch / Français</option>
          <option value="PL">Poland: Polski</option>
          <option value="UA">Ukraine: Українська</option>
        </select>

        <PrimaryButton
          text="SignUp"
          onClick={async () => {
            const result = await signUp({
              email: email,
              password: password,
              accountType: "user",
              country: country,
            });

            if (result.success) {
              router.push("/user/home");
            }
          }}
        />
        <div
          className="font-[14px] font-medium underline"
          onClick={() => router.push("/user/auth/login")}
        >
          Already have an account ? Login
        </div>
      </div>
    </div>
  );
}
