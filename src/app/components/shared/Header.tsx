"use client";

import { useState } from "react";
import Link from "next/link";
import DarkModeToggle from "../shared/DarkModeToggleButton";
import { usePathname } from "next/navigation";
import Image from "next/image";

type HeaderProps = {
  navLinks?: { href: string; label: string }[];
};

export default function Header({ navLinks = [] }: HeaderProps) {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="flex justify-between items-center px-6 py-3 bg-[#001464] text-white shadow-md relative">
      {/* Left Section: Logo */}
      <div className="flex items-center">
        <Image
          src="/icon.svg"
          alt="Pistah Icon"
          width={40}
          height={40}
          className="mr-2"
        />
        <span className="font-allerta text-xl font-bold">Pistah</span>
      </div>

      {/* Right Section: Nav Links & Profile */}
      <div className="flex items-center gap-6 relative">
        {/* Navigation Links */}
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`${
              pathname === link.href ? "underline underline-offset-4" : ""
            } font-medium`}
          >
            {link.label}
          </Link>
        ))}

        {/* Profile Picture */}
        <div className="relative">
          <Image
            src="/profile.jpg" // Replace with your actual profile picture URL
            alt="Profile"
            width={40}
            height={40}
            className="w-10 h-10 rounded-full border border-white object-cover cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md text-gray-800 z-50">
              <ul className="py-2">
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="/profile">My Profile</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="/dashboard">My Dashboard</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <DarkModeToggle />
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
