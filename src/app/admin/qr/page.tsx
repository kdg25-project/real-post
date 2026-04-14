'use client';

import QrCode from "@/components/layouts/QrCode";
import TextForm from "@/components/layouts/TextForm";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSession } from "@/lib/auth-client";

export default function Page() {
    const t = useTranslations();
    const [count, setCount] = useState("1");
    const [url, setUrl] = useState<string | undefined>(undefined);
    const [isGenerated, setIsGenerated] = useState(false);
    const session = useSession();

    function generateQrCode() {
        fetch("/api/surveys/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ maxUses: parseInt(count)}),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                setUrl(`${window.location.origin}/survey/${session?.data?.user?.id}?token=${data.data.token}`);
                setIsGenerated(true);
            } else {
                alert(t('admin.qrGenerationFailed'));
            }
        })
        .catch(() => {
            alert(t('admin.qrGenerationFailed'));
        });
    }

    return (
        !isGenerated ? (
            <div className="max-w-2xl mx-auto p-6 space-y-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">{t('admin.qrIssue')}</h1>

                    <div className="mb-6 flex justify-center items-center min-h-[200px] bg-gray-50 rounded-lg p-4">
                        {url ? (
                            <QrCode url={url} />
                        ) : (
                            <p className="text-center text-gray-500">{t('admin.pleaseIssueQr')}</p>
                        )}
                    </div>

                    <div className="space-y-4">
                        <TextForm
                            label={t('admin.qrUsageCount')}
                            type="number"
                            placeholder={t('admin.qrUsageCountPlaceholder')}
                            value={count}
                            onChange={(e) => setCount(e.target.value)}
                        />
                        <br />
                        <Button className="w-full" onClick={generateQrCode}>
                            {t('admin.issueQrButton')}
                        </Button>
                    </div>
                </div>
            </div>
        ) : (
            <div>
                <QrCode url={url || ""} />
            </div>
        )
    );
}