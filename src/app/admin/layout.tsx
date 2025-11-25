"use client";

import AdminButtomNav from "@/components/layouts/AdminBottomNav";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const showNav = !pathname.startsWith("/admin/auth");

  return (
    <div className="w-[402px] h-screen mx-auto px-[24px] overflow-hidden overflow-y-auto">
      {children}
      {showNav && <AdminButtomNav />}
    </div>
  );
}
