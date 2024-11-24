"use client";

import Link from "next/link";
import DarkModeToggle from "../shared/DarkModeToggleButton";
import { usePathname } from "next/navigation";

type HeaderProps = {
    navLinks: { href: string; label: string; image: string }[];
};

export default function Header({ navLinks }: HeaderProps) {
    const pathname = usePathname();

    return (
        <header className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 shadow">
            {/* Logo and Company Name */}
            <div className="flex items-center">
                <img
                    src="https://as2.ftcdn.net/jpg/10/50/72/43/1000_F_1050724335_jsTk7FhgKsLD9hvp8M8sQhf2er8wR5zi.jpg"
                    alt="PistaH"
                    width={40}
                    height={40}
                />
                <span className="ml-2 text-3xl font-bold text-gray-800 dark:text-white">
                    Pistah
                </span>
                <span className="ml-2 text-xl font-semibold text-gray-800 dark:text-white">
                    | Where brands find you
                </span>
            </div>

            {/* Right-side icons and links */}
            <div className="flex items-center space-x-4">
                <DarkModeToggle />
                {navLinks
                    .filter((link) => link.href !== pathname) // Exclude current page link
                    .map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="flex items-center text-gray-800 dark:text-white text-2xl font-bold">
                            <img
                                src={link.image}
                                alt="PistaH"
                                width={40}
                                height={40}
                                className="mr-2"
                            /> {link.label}
                        </Link>
                    ))}
            </div>
        </header>
    );
}
