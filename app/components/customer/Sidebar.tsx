"use client";

import { sidebarItems } from "@/app/data/dashboard";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/icon";

type SidebarProps = {
  isSidebarCollapsed: boolean;
  isMobileMenuOpen: boolean;
  onToggleSidebar: () => void;
  onCloseMobileMenu: () => void;
};

export function Sidebar({
  isSidebarCollapsed,
  isMobileMenuOpen,
  onToggleSidebar,
  onCloseMobileMenu,
}: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  return (
    <aside
      className={`fixed top-0 left-0 z-30 bottom-0  bg-white shadow-xl transition-all duration-300 lg:static  lg:shadow-none ${isSidebarCollapsed ? "w-[86px]" : "w-[280px]"
        } ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
    >
      <div className="flex h-full flex-col p-4">
        <div className="mb-6 flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <img src="images/setting.png" alt="settings" width={36} height={36} onClick={onToggleSidebar} />
            {!isSidebarCollapsed ? (
              <p className="text-xl font-semibold">Dashboard <span className="text-[10px] font-medium text=[#838383]">v.01</span></p>
            ) : null}
          </div>

          {/* <button
            type="button"
            className="grid h-8 w-8 place-items-center rounded-lg border border-[#e2e8f0] text-sm hover:bg-[#f5f6fa]"
          
            aria-label={isSidebarCollapsed ? "Maximize sidebar" : "Minimize sidebar"}
          >
            {isSidebarCollapsed ? "›" : "‹"}
          </button> */}
        </div>

        <nav className="space-y-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onCloseMobileMenu}
                className={`flex w-full items-center rounded-xl px-3 py-3 text-sm transition ${isActive
                    ? "bg-[#5932ea] text-white"
                    : "text-[#9197b3] hover:bg-[#f4f5ff]"
                  } ${isSidebarCollapsed ? "justify-center" : "gap-3"}`}
              >
                <Icon
                  name={item.icon}
                  size={20}
                  active={isActive}
                  className={isActive ? "brightness-0 invert" : "opacity-60"}
                />
                {!isSidebarCollapsed ? (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.label !== "Dashboard" ? (
                      <Image src="/images/chevron-right.svg" alt="" width={12} height={12}  className={isActive ? "brightness-0 invert" : "opacity-60"} />
                    ) : null}
                  </>
                ) : null}

              </Link>
            )
          })}
        </nav>

        <div className="mt-auto space-y-4">
          {!isSidebarCollapsed ? (
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
          ) : null}

          <div
            className={`flex items-center rounded-xl relative border border-[#eef0f7] p-2 ${isSidebarCollapsed ? "justify-center" : "gap-3"
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
              className="text-xs text-[#9197b3] hover:text-red-500 transition absolute top-[20px] right-[10px]"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
