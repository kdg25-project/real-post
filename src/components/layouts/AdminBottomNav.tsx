"use client";

import Link from "next/link";
import { SquarePen, QrCode, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";

export default function AdminBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed items-center bottom-0 left-0 flex w-full h-[70px] bg-white px-[10px] shadow-base z-[10]">
      <Link
        href="/admin/edit"
        className={`w-full text-center ${pathname === "/admin/edit" ? "text-primary" : "text-gray-dark"}`}
      >
        <SquarePen size={28} className="mx-auto"></SquarePen>
        <p className="text-[12px] font-medium">Edit</p>
      </Link>
      <Link
        href="/admin/qr"
        className={`w-full text-center ${pathname === "/admin/qr" ? "text-primary" : "text-gray-dark"}`}
      >
        <QrCode size={28} className="mx-auto"></QrCode>
        <p className="text-[12px] font-medium">QR</p>
      </Link>
      <Link
        href="/"
        className={`w-full text-center ${pathname === "/" ? "text-primary" : "text-gray-dark"}`}
      >
        <LogOut size={28} className="mx-auto"></LogOut>
        <p className="text-[12px] font-medium">ログアウト</p>
      </Link>
    </nav>
  );
}
