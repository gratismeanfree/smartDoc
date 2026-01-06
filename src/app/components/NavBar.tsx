"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/document", label: "Documents" },
  { href: "/faq", label: "FAQ" },
  { href: "/pricing", label: "Pricing" },
  { href: "/feedback", label: "Feedback" }
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="w-full border-b bg-white/70 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-semibold text-lg">
          📄 DocMind
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6">
          {navItems.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  text-sm transition
                  ${
                    active
                      ? "text-blue-600 font-medium border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  }
                `}
              >
                {item.label}
              </Link>
            );
          })}

          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </nav>
  );
}
