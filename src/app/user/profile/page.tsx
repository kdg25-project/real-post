'use client'

import TextForm from "@/components/layouts/TextForm";
import PrimaryButton from "@/components/elements/PrimaryButton";
import Header from "@/components/layouts/Header";
import Spacer from "@/components/elements/Spacer";
import Section from "@/components/layouts/Section";

export default function ProfilePage() {
    return (
        <div>
            <Header searchArea={false} />
            <Spacer size="sm" />
            <Section title="Your Profile" className="gap-[16px]">
                <TextForm label="Email" type="email" placeholder="email" />
                <div className="flex items-center gap-[16px]">
                    <button className="w-full bg-gray rounded-[15px] text-[20px] text-white font-medium py-[12px]">Cancel</button>
                    <button className="w-full bg-primary rounded-[15px] text-[20px] text-white font-medium py-[12px]">Save</button>
                </div>
            </Section>
        </div>
    );
}
