import AdminButtomNav  from "@/components/layouts/AdminBottomNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-[402px] h-screen mx-auto px-[24px] overflow-hidden overflow-y-auto">
            {children}
            <AdminButtomNav />
        </div>
    )
}