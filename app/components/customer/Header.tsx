"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";

type HeaderProps = {
  onOpenMobileMenu: () => void;
};

export function Header({ onOpenMobileMenu }: HeaderProps) {
  const { data: session } = useSession();

  const firstName = session?.user?.name?.split(" ")[0] ?? "there";

  return (
    <header className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-xl border border-[#d9d9d9] bg-white text-lg lg:hidden"
          onClick={onOpenMobileMenu}
          aria-label="Open sidebar menu"
        >
          ☰
        </button>
        <h1 className="text-2xl font-semibold">
          Hello {firstName} <span className="text-xl"></span>
        </h1>
      </div>

      <div className="hidden min-w-[230px] items-center rounded-xl bg-white px-4 py-3 sm:flex">
        <Image src="/images/search.svg" alt="Search Customers" width={24} height={24}/>
        <input
          type="search"
          placeholder="Search"
          className="ml-3 w-full bg-transparent text-sm text-[#292d32] outline-none placeholder:text-[#b5b7c0]"
        />
      </div>
    </header>
  );
}