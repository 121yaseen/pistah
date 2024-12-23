"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import ProfileIcon from "@/icons/profileIcon";
import CreateAdModal from "../modals/CreateAdModal";
import DarkModeToggle from "./DarkModeToggleButton";
import InventoryIcon from "@/icons/inventoryIcon";
import DashboardIcon from "@/icons/dashboardIcon";
import { signOut, useSession } from "next-auth/react";

type HeaderProps = {
  navLinks?: { href: string; label: string }[];
};

export default function Header({ navLinks = [] }: HeaderProps) {
  const { data: session } = useSession();

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

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        profilePicRef.current &&
        !profilePicRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleSignOut = () => {
    signOut({
      callbackUrl: "/login", // Redirect to login page after sign out
    });
  };
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
        {/* Create Ad Button */}
        <button
          onClick={() => setIsModalOpen(true)} // Open the modal on click
          className="h-10 px-5 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-200 font-semibold text-lg rounded-full shadow-md border border-gray-300 dark:border-gray-700 hover:shadow-lg transition flex items-center justify-center"
        >
          Create Ad
        </button>

        {/* Navigation Links */}
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`${pathname === link.href ? "underline underline-offset-4" : ""} font-medium`}>
            {link.label}
          </Link>
        ))}

        {/* Icons Section */}
        <div className="flex items-center space-x-6">
          {/* Dashboard Icon */}
          <Link
            className={`flex flex-col items-center group ${pathname === "/dashboard"
                ? "text-white border-b-2"
                : "text-gray-500"
              }`}
            href="/dashboard"
          >
            <span
              className={`text-xs mt-1 group-hover:text-white ${pathname === "/dashboard" ? "text-white" : "text-gray-500"
                }`}
            >
              <DashboardIcon />
            </span>
            <span
              className={`text-xs mt-1 group-hover:text-white ${pathname === "/dashboard" ? "text-white" : "text-gray-400"
                }`}
            >
              Dashboard
            </span>
          </Link>

          {/* Inventory Icon */}
          <Link
            className={`flex flex-col items-center group ${pathname === "/inventory"
                ? "text-white border-b-2"
                : "text-gray-500"
              }`}
            href="/inventory"
          >
            <span
              className={`text-xs mt-1 group-hover:text-white ${pathname === "/inventory" ? "text-white" : "text-gray-500"
                }`}
            >
              <InventoryIcon />
            </span>
            <span
              className={`text-xs mt-1 group-hover:text-white ${pathname === "/inventory" ? "text-white" : "text-gray-400"
                }`}
            >
              Inventory
            </span>
          </Link>

          {/* Profile Picture */}
          <div
            ref={profilePicRef}
            className="flex flex-col items-center relative group"
          >
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-8 h-8 rounded-full border bg-gray-200 dark:bg-gray-800 flex items-center justify-center
text-gray-500 dark:text-gray-400 cursor-pointer transition group-hover:ring-4 group-hover:ring-blue-700"
            >
              <div className="w-9 h-9 flex items-center justify-center">
                <ProfileIcon />
              </div>
            </button>
            <div className="flex items-center mt-1 space-x-1">
              <span className="text-gray-400 text-xs group-hover:text-white">
                {session?.user?.name || "Guest"}
              </span>
            </div>
          </div>
        </div>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div
            ref={dropdownRef}
            className="absolute right-0 mt-[48%] w-48 bg-white shadow-lg rounded-md text-gray-800 z-50 dark:bg-gray-800 dark:text-white"
          >
            <ul className="py-2">
              <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                <Link href="/profile">My Profile</Link>
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                <DarkModeToggle />
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                <button
                  onClick={handleSignOut}
                  className="w-full text-left text-gray-800 dark:text-gray-200 font-medium hover:text-gray-600 dark:hover:text-gray-400 transition"
                >
                  Sign Out
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
      {/* Create Ad Modal */}
      {isModalOpen && <CreateAdModal onClose={() => setIsModalOpen(false)} />}
    </header>
  );
}