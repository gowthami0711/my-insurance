"use client";

import { useStats } from "@/hooks/useStats";
import Image from "next/image";

const STATS_CARD_CONFIG = [
  {
    title: "Total Customers",
    key: "totalCustomers",
    change: "↗ 16% this month",
    changeColor: "text-[#00ac4f]",
    icon: "/images/total-customers.svg",
  },
  {
    title: "Members",
    key: "members",
    change: "↘ 1% this month",
    changeColor: "text-[#df0404]",
    icon: "/images/member.svg",
  },
  {
    title: "Active Now",
    key: "activeNow",
    change: "↗ 14% this month",
    changeColor: "text-[#00ac4f]",
    icon: "/images/active-now.svg",
  },
] as const;

function formatStatValue(value: number | undefined) {
  return value == null ? "—" : value.toLocaleString();
}

export function StatsCards() {
  const { data, isLoading } = useStats();

  return (
    <section className="grid gap-4 divide-x divide-solid divide-[#F0F0F0] rounded-3xl bg-white p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
      {STATS_CARD_CONFIG.map((stat) => (
        <article key={stat.title} className="p-4 flex">
          <Image src={stat.icon} alt={stat.title} width={84} height={84} />
          <div className="pl-4">
          <p className="text-xs text-[#acacac]">{stat.title}</p>
          {isLoading ? (
            <div className="mt-1 h-8 w-24 animate-pulse rounded bg-[#f0f0f0]" />
          ) : (
            <p className="mt-1 text-[28px] font-semibold leading-tight">
              {formatStatValue(data?.[stat.key])}
            </p>
          )}
          <p className={`mt-1 text-xs ${stat.changeColor}`}>{stat.change}</p>
          </div>
        </article>
      ))}
    </section>
  );
}