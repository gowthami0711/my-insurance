"use client";

import { useUIStore } from "@/store/ui-store";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { isSidebarCollapsed, isMobileMenuOpen, toggleSidebar, openMobileMenu, closeMobileMenu } =
    useUIStore();

  return (
    <div className="min-h-screen h-[100vh] overflow-hidden bg-[#f5f6fa] text-[#202224]">
      <div className="flex min-h-screen h-full">
        {isMobileMenuOpen ? (
          <button
            type="button"
            className="fixed inset-0 z-20 bg-black/35 lg:hidden"
            onClick={closeMobileMenu}
            aria-label="Close sidebar backdrop"
          />
        ) : null}
        <Sidebar
          isSidebarCollapsed={isSidebarCollapsed}
          isMobileMenuOpen={isMobileMenuOpen}
          onToggleSidebar={toggleSidebar}
          onCloseMobileMenu={closeMobileMenu}
        />
        <main className="w-full flex-1 p-4 sm:p-6 lg:p-8 h-full overflow-auto">
          <div className="mx-auto max-w-[100%] space-y-6">
            <Header onOpenMobileMenu={openMobileMenu} />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}