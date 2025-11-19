"use client";

interface HeaderProps {
    searchArea?: boolean;
}

export default function Header({ searchArea = false }: HeaderProps) {
    return (
        <header className="fixed t-0 left-0 w-full pt-[56px] px-[24px] pb-[24px]">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-dark text-[14px] font-semibold">welecome to</p>
                    <h1 className="text-[26px] font-bold leading-tight">Real Post</h1>
                </div>
                <div>English</div>
            </div>
            <div>

            </div>
        </header>
    )
}