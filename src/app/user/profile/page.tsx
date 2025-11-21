'use client'

import TextForm from "@/components/layouts/TextForm";
import Header from "@/components/layouts/Header";
import Spacer from "@/components/elements/Spacer";
import Section from "@/components/layouts/Section";
import { updateUserProfile } from "@/lib/auth-client";
import { useState, useEffect } from "react";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";

const COUNTRIES = [
  "Japan",
  "United States",
  "United Kingdom",
  "China",
  "Korea",
  "Taiwan",
  "Thailand",
  "Vietnam",
  "Other"
];

export default function ProfilePage() {
    const [email, setEmail] = useState("");
    const [country, setCountry] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch("/api/auth/me");
                if (res.ok) {
                    const data = await res.json();
                    if (data.user) {
                        setEmail(data.user.email);
                    }
                    if (data.profile?.country) {
                        setCountry(data.profile.country);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch profile", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateUserProfile({ email, country });
            alert("Profile updated successfully");
        } catch (error) {
            console.error(error);
            alert("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Header searchArea={false} />
            <Spacer size="sm" />
            <Section title="Your Profile" className="gap-[16px]">
                <TextForm 
                    label="Email" 
                    type="email" 
                    placeholder="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <div className="flex flex-col gap-[12px] m-0">
                    <label className="text-[16px] font-bold">Country</label>
                    <div className="w-full px-[20px] py-[15px] rounded-[14px] bg-white shadow-base focus:outline-none relative">
                        <NativeSelect 
                            value={country} 
                            onChange={(e) => setCountry(e.target.value)} 
                            className="border-none shadow-none p-0 h-auto bg-transparent focus-visible:ring-0 w-full"
                        >
                            <NativeSelectOption value="">Select Country</NativeSelectOption>
                            {COUNTRIES.map((c) => (
                                <NativeSelectOption key={c} value={c}>{c}</NativeSelectOption>
                            ))}
                        </NativeSelect>
                    </div>
                </div>
                <div className="flex items-center gap-[16px]">
                    <button className="w-full bg-gray rounded-[15px] text-[20px] text-white font-medium py-[12px]">Cancel</button>
                    <button 
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full bg-primary rounded-[15px] text-[20px] text-white font-medium py-[12px] disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Save"}
                    </button>
                </div>
            </Section>
        </div>
    );
}
