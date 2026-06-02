"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, User, type LucideIcon } from "lucide-react";

interface NavItem {
  /** Route segment this item links to. */
  href: string;
  label: string;
  icon: LucideIcon;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Trang chủ", icon: Home },
  { href: "/explore", label: "Khám phá", icon: Compass },
  { href: "/profile", label: "Hồ sơ", icon: User },
];

/**
 * Determines whether a nav item is active for the current pathname.
 * - Home ("/") is active only on an exact match.
 * - Other items are active on exact match or nested sub-routes (startsWith).
 */
function isItemActive(href: string, pathname: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Primary navigation (self-contained routing component).
 * - Desktop (md+): fixed left sidebar.
 * - Mobile: fixed bottom navigation bar.
 *
 * Active state is derived from `usePathname()` and each item is a real
 * `<Link>`, so navigation uses App Router route segments (back/forward and
 * direct URL loads work).
 */
export function NavBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Điều hướng chính"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-black/90 backdrop-blur md:inset-x-auto md:inset-y-0 md:left-0 md:w-20 md:flex-col md:border-r md:border-t-0 lg:w-56"
    >
      <ul className="flex items-center justify-around md:h-full md:flex-col md:items-stretch md:justify-start md:gap-2 md:px-2 md:pt-8">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = isItemActive(href, pathname);
          return (
            <li key={href} className="md:w-full">
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`flex w-full flex-col items-center gap-1 px-3 py-2 text-xs transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:flex-row md:gap-3 md:rounded-xl md:px-4 md:py-3 md:text-base ${
                  isActive
                    ? "text-white md:bg-white/10"
                    : "text-white/60 hover:text-white"
                }`}
              >
                <Icon
                  className={`h-6 w-6 shrink-0 ${
                    isActive ? "text-white" : ""
                  }`}
                  aria-hidden="true"
                />
                {/* Label: always visible on mobile + large desktop, hidden on the
                    narrow md sidebar to keep it icon-only. */}
                <span className="md:hidden lg:inline">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
