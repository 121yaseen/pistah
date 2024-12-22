"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import ProfileIcon from "@/icons/profileIcon";
import CreateAdModal from "../modals/CreateAdModal";
import DarkModeToggle from "./DarkModeToggleButton";

type HeaderProps = {
  navLinks?: { href: string; label: string }[];
};

export default function Header({ navLinks = [] }: HeaderProps) {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null); // Ref for the dropdown menu
  const profilePicRef = useRef<HTMLDivElement | null>(null); // Ref for the profile picture container
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      root.classList.add("dark");
    }
  }, []);

  return (
    <header className="flex justify-between items-center px-6 py-3 bg-[#001464] text-white shadow-md relative">
      {/* Left Section: Logo */}
      <div className="flex items-center">
        <Link href="/" className="flex items-center">
          <Image
            src="/icon.svg"
            alt="Pistah Icon"
            width={40}
            height={40}
            className="mr-2"
          />
          <span className="font-allerta text-xl font-bold">Pistah</span>
        </Link>
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

        {/* Create Ad Button */}
        <button
          onClick={() => setIsModalOpen(true)} // Open the modal on click
          className="h-10 px-5 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-200 font-semibold text-lg rounded-full shadow-md border border-gray-300 dark:border-gray-700 hover:shadow-lg transition flex items-center justify-center"
        >
          Create Ad
        </button>

        {/* Profile Picture & Dropdown */}
        <div ref={profilePicRef} className="relative">
          <div className="flex items-center space-x-4">
            <div className="text-gray-100 text-2xl font-bold">{`{Company Name}`}</div>
            <div className="relative w-10 h-10 rounded-full flex items-center justify-center hover:ring-4 hover:ring-blue-800 transition">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-10 h-10 rounded-full border border-gray-200 bg-gray-200 dark:bg-gray-800 flex items-center justify-center
                text-gray-500 dark:text-gray-400 cursor-pointer transition"
              >
                <ProfileIcon />
              </button>
            </div>
          </div>
          {dropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md text-gray-800 z-50 dark:bg-gray-800 dark:text-white"
            >
              <ul className="py-2">
                <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Link href="/profile">My Profile</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Link href="/dashboard">My Dashboard</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Link href="/inventory">My Inventory</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <DarkModeToggle />
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Create Ad Modal */}
      {isModalOpen && <CreateAdModal onClose={() => setIsModalOpen(false)} />}
    </header>
  );
}
