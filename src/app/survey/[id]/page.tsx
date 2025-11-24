"use client";

import React, { useEffect } from "react";
import { Check } from "lucide-react";
import { useState } from "react";
import Header from "@/components/layouts/Header";
import ImageUpload from "@/components/layouts/ImageUpload";
import TextForm from "@/components/layouts/TextForm";
import {
  CategoryForm,
  NativeSelectOption,
  NativeSelectOptGroup,
} from "@/components/layouts/CategoryForm";
import { SurveyCreate, SurveyCreateRequest } from "@/lib/api/survey-create";
import PrimaryButton from "@/components/elements/PrimaryButton";
import { useParams, useSearchParams } from "next/navigation";

export default function Survey() {
  const token = useSearchParams().get("token");
  const id = useParams().id;
  const [preview1, setPreview1] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [validToken, setValidToken] = useState(true);
  const [form, setForm] = useState<SurveyCreateRequest>({
    country: "",
    gender: null,
    ageGroup: null,
    satisfactionLevel: 0,
    description: "",
    thumbnail: new Blob(),
    images: [new Blob()],
  });

  useEffect(() => {
    fetch(`/api/surveys/token?company_id=${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.data.isValid) {
          setValidToken(true);
        } else {
          setValidToken(false);
        }
      })
      .catch(() => {
        setValidToken(false);
      });
  }, [token, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
  };

  return validToken === false ? (
    <div className="flex flex-col gap-6 w-[402px] h-screen mx-auto mb-20 px-[24px] overflow-hidden overflow-y-auto">
      <Header />
      <div className="flex flex-col justify-center items-center text-black pt-35">
        <p className="text-2xl font-bold">Invalid Survey Token</p>
        <p className="text-center">
          The survey link you used is invalid or has expired.
        </p>
      </div>
    </div>
  ) : (
    <div className="flex flex-col gap-6 w-[402px] h-screen mx-auto mb-20 px-[24px] overflow-hidden overflow-y-auto">
      <Header />
      <div className="flex flex-col justify-center items-center text-black pt-35">
        <p className="text-2xl font-bold">Blue Fork Bistro</p>
        <p>Please take part in our survey</p>
      </div>
      <ImageUpload
        label="Post Thumbnail"
        title="Select File"
        preview={preview1 ?? undefined}
        onChange={(file) => {
          if (!file) return;
          const url = URL.createObjectURL(file);
          setPreview1(url);
          setForm({
            ...form,
            thumbnail: file,
            images: [file],
          });
        }}
      />
      <TextForm
        label="Your Country"
        placeholder="Japan"
        type="text"
        onChange={(e) => setForm({ ...form, country: e.target.value })}
      />
      <CategoryForm
        title="Your Gender"
        defaultValue={4}
        onChange={(e) =>
          setForm({
            ...form,
            gender: (e.target.value || null) as
              | "male"
              | "female"
              | "other"
              | null,
          })
        }
      >
        <NativeSelectOptGroup label="Your Gender">
          <NativeSelectOption value="male">male</NativeSelectOption>
          <NativeSelectOption value="female">female</NativeSelectOption>
          <NativeSelectOption value="other">Other</NativeSelectOption>
          <NativeSelectOption value="">do not answer</NativeSelectOption>
        </NativeSelectOptGroup>
      </CategoryForm>
      <CategoryForm
        title="Your Age"
        defaultValue={6}
        onChange={(e) =>
          setForm({
            ...form,
            ageGroup: (e.target.value || null) as
              | "18-24"
              | "25-34"
              | "35-44"
              | "45-54"
              | "55+"
              | null,
          })
        }
      >
        <NativeSelectOptGroup label="Your Age">
          <NativeSelectOption value="1">18-24</NativeSelectOption>
          <NativeSelectOption value="2">25-34</NativeSelectOption>
          <NativeSelectOption value="3">35-44</NativeSelectOption>
          <NativeSelectOption value="4">45-54</NativeSelectOption>
          <NativeSelectOption value="5">55+</NativeSelectOption>
          <NativeSelectOption value="6">do not answer</NativeSelectOption>
        </NativeSelectOptGroup>
      </CategoryForm>
      <CategoryForm
        title="Your Satisfaction"
        defaultValue={5}
        onChange={(e) =>
          setForm({ ...form, satisfactionLevel: Number(e.target.value) })
        }
      >
        <NativeSelectOptGroup label="Your Satisfaction">
          <NativeSelectOption value="1">1</NativeSelectOption>
          <NativeSelectOption value="2">2</NativeSelectOption>
          <NativeSelectOption value="3">3</NativeSelectOption>
          <NativeSelectOption value="4">4</NativeSelectOption>
          <NativeSelectOption value="5">5</NativeSelectOption>
        </NativeSelectOptGroup>
      </CategoryForm>
      <div className="flex flex-col gap-[12px] m-0">
        <p>Your Review</p>
        <textarea
          className=" w-full h-40 p-5 bg-white shadow-base rounded-[14px] resize-none"
          name="Your Review"
          id=""
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        ></textarea>
      </div>

      <input
        className="hidden"
        checked={isChecked}
        onChange={handleChange}
        type="checkbox"
        id="policy"
      />
      <label htmlFor="policy" className="cursor-pointer select-none">
        <div className="flex justify-center items-center gap-2">
          {isChecked ? (
            <div className="flex justify-center items-center w-[18px] h-[18px] border-1 border-black bg-blue-400 rounded-[5px]">
              <Check size={12} className="text-white" />
            </div>
          ) : (
            <div className="w-[18px] h-[18px] border-1 border-black bg-white rounded-[5px]" />
          )}
          <p>I agree to the privacy policy</p>
        </div>
      </label>
      <PrimaryButton
        text="submit"
        onClick={async () => {
          if (!isChecked) return;
          await SurveyCreate(form, id as string, token);
        }}
      />
    </div>
  );
}
