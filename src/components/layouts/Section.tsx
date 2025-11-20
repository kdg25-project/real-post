"use client";

interface SectionProps {
    title: string;
    children: React.ReactNode;
    className?: string;
}

export default function Section({ title, children, className = "" }: SectionProps) {
    return (
        <section className={`flex flex-col ${className}`}>
            <h2 className="text-[20px] font-bold">{title}</h2>
            <div className="flex flex-col gap-[16px]">
                {children}
            </div>
        </section>
    );
}