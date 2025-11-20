import BottomNav from "@/components/layouts/BottomNav"

export default function UserLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-[402px] h-screen mx-auto px-[24px] overflow-hidden overflow-y-auto">
            {children}
            <BottomNav />
        </div>
    )
}