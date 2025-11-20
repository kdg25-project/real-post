"use client";

import Link from 'next/link'
import { Home, Heart, Gift, User2 } from 'lucide-react'
import { usePathname } from "next/navigation";

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className='fixed items-center bottom-0 left-0 flex w-full h-[70px] bg-white px-[10px] shadow-base'>
            <Link href="/user/home" className={`w-full text-center ${pathname === "/user/home" ? "text-primary" : "text-gray-dark"}`}>
                <Home size={28} className='mx-auto'></Home>
                <p className='text-[12px] font-medium'>Home</p>
            </Link>
            <Link href="/user/favorite" className={`w-full text-center ${pathname === "/user/favorite" ? "text-primary" : "text-gray-dark"}`}>
                <Heart size={28} className='mx-auto'></Heart>
                <p className='text-[12px] font-medium'>Favorite</p>
            </Link>
            <Link href="/user/goods" className={`w-full text-center ${pathname === "/user/goods" ? "text-primary" : "text-gray-dark"}`}>
                <Gift size={28} className='mx-auto'></Gift>
                <p className='text-[12px] font-medium'>Goods</p>
            </Link>
            <Link href="/user/profile" className={`w-full text-center ${pathname === "/user/profile" ? "text-primary" : "text-gray-dark"}`}>
                <User2 size={28} className='mx-auto'></User2>
                <p className='text-[12px] font-medium'>Profile</p>
            </Link>
        </nav>
    )
}