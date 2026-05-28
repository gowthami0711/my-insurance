"use client";

import { memo } from "react";
import { sidebarItems } from "@/app/data/dashboard";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";

type SidebarProps = {
  pathname: string;
  isSidebarCollapsed: boolean;
  isMobileMenuOpen: boolean;
  onToggleSidebar: () => void;
  onCloseMobileMenu: () => void;
};

type SidebarNavItemProps = {
  label: string;
  icon: string;
  href: string;
  isActive: boolean;
  isSidebarCollapsed: boolean;
  onNavigate: () => void;
};

const SidebarNavItem = memo(function SidebarNavItem({
  label,
  icon,
  href,
  isActive,
  isSidebarCollapsed,
  onNavigate,
}: SidebarNavItemProps) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`flex w-full items-center rounded-xl px-3 py-3 text-sm transition ${
        isActive
          ? "bg-[#5932ea] text-white"
          : "text-[#9197b3] hover:bg-[#f4f5ff]"
      } ${isSidebarCollapsed ? "justify-center" : "gap-3"}`}
    >
      <Icon
        name={icon}
        size={20}
        active={isActive}
        className={isActive ? "brightness-0 invert" : "opacity-60"}
      />
      {!isSidebarCollapsed ? (
        <>
          <span className="flex-1 text-left">{label}</span>
          {label !== "Dashboard" ? (
            <Image
              src="/images/chevron-right.svg"
              alt=""
              width={12}
              height={12}
              className={isActive ? "brightness-0 invert" : "opacity-60"}
            />
          ) : null}
        </>
      ) : null}
    </Link>
  );
});

const SidebarNav = memo(function SidebarNav({
  pathname,
  isSidebarCollapsed,
  onCloseMobileMenu,
}: {
  pathname: string;
  isSidebarCollapsed: boolean;
  onCloseMobileMenu: () => void;
}) {
  return (
    <nav className="space-y-2">
      {sidebarItems.map((item) => (
        <SidebarNavItem
          key={item.href}
          label={item.label}
          icon={item.icon}
          href={item.href}
          isActive={pathname === item.href}
          isSidebarCollapsed={isSidebarCollapsed}
          onNavigate={onCloseMobileMenu}
        />
      ))}
    </nav>
  );
});

const SidebarHeader = memo(function SidebarHeader({
  isSidebarCollapsed,
  onToggleSidebar,
}: {
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}) {
  return (
    <div className="mb-6 flex items-center justify-between px-2">
      <div className="flex items-center gap-3">
        <Image
          src="/images/setting.svg"
          alt="settings"
          width={36}
          height={36}
          onClick={onToggleSidebar}
        />
        {!isSidebarCollapsed ? (
          <p className="text-xl font-semibold">
            Dashboard{" "}
            <span className="text-[10px] font-medium text-[#838383]">v.01</span>
          </p>
        ) : null}
      </div>
    </div>
  );
});

const SidebarPromo = memo(function SidebarPromo({
  isSidebarCollapsed,
}: {
  isSidebarCollapsed: boolean;
}) {
  if (isSidebarCollapsed) return null;

  return (
    <div className="rounded-2xl bg-gradient-to-b from-[#eaabf0] to-[#5c35ee] p-4 text-center text-white">
      <p className="text-sm font-medium">
        Upgrade to PRO to get access all Features!
      </p>
      <button
        type="button"
        className="mt-4 w-full rounded-xl bg-white py-2 text-sm font-semibold text-[#5d3eea]"
      >
        Get Pro Now!
      </button>
    </div>
  );
});

const SidebarUser = memo(function SidebarUser({
  isSidebarCollapsed,
}: {
  isSidebarCollapsed: boolean;
}) {
  const { data: session } = useSession();

  return (
    <div
      className={`relative flex items-center rounded-xl border border-[#eef0f7] p-2 ${
        isSidebarCollapsed ? "justify-center" : "gap-3"
      }`}
    >
      <div className="grid h-10 w-10 place-items-center rounded-full bg-[#efefef] font-semibold">
        E
      </div>
      {!isSidebarCollapsed ? (
        <div className="overflow-hidden">
          <p className="truncate text-sm font-semibold">{session?.user?.name}</p>
          <p className="truncate text-xs text-[#757575]">{session?.user?.role}</p>
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => signOut()}
        className="absolute top-[20px] right-[10px] text-xs text-[#9197b3] transition hover:text-red-500"
      >
        Sign out
      </button>
    </div>
  );
});

export const Sidebar = memo(function Sidebar({
  pathname,
  isSidebarCollapsed,
  isMobileMenuOpen,
  onToggleSidebar,
  onCloseMobileMenu,
}: SidebarProps) {
  return (
    <aside
      className={`fixed top-0 left-0 z-30 bottom-0 bg-white shadow-xl transition-all duration-300 lg:static lg:shadow-none ${
        isSidebarCollapsed ? "w-[86px]" : "w-[280px]"
      } ${
        isMobileMenuOpen
          ? "translate-x-0"
          : "-translate-x-full lg:translate-x-0"
      }`}
    >
      <div className="flex h-full flex-col p-4">
        <SidebarHeader
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={onToggleSidebar}
        />

        <SidebarNav
          pathname={pathname}
          isSidebarCollapsed={isSidebarCollapsed}
          onCloseMobileMenu={onCloseMobileMenu}
        />

        <div className="mt-auto space-y-4">
          <SidebarPromo isSidebarCollapsed={isSidebarCollapsed} />
          <SidebarUser isSidebarCollapsed={isSidebarCollapsed} />
        </div>
      </div>
    </aside>
  );
});
