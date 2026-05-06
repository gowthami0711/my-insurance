"use client";

import { useStats } from "@/hooks/useStats";
import Image from "next/image";

export function StatsCards() {
  const { data, isLoading } = useStats();

  const cards = [
    {
      title: "Total Customers",
      value: data?.totalCustomers ?? "—",
      change: "↗ 16% this month",
      changeColor: "text-[#00ac4f]",
      icons: "/images/total-customers.svg"
    },
    {
      title: "Members",
      value: data?.members ?? "—",
      change: "↘ 1% this month",
      changeColor: "text-[#df0404]",
      icons: "/images/member.svg"
    },
    {
      title: "Active Now",
      value: data?.activeNow ?? "—",
      change: "↗ 14% this month",
      changeColor: "text-[#00ac4f]",
      icons: "/images/active-now.svg"
    },
   
  ];

  return (
    <section className="grid gap-4 rounded-3xl bg-white p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-3 divide-x-1 divide-solid divide-[#F0F0F0] ">
      {cards.map((stat) => (
        <article key={stat.title} className="p-4 flex">
          <Image src={stat.icons} alt="stat.title" width={84} height={84} />
          <div className="pl-4">
          <p className="text-xs text-[#acacac]">{stat.title}</p>
          {isLoading ? (
            <div className="mt-1 h-8 w-24 animate-pulse rounded bg-[#f0f0f0]" />
          ) : (
            <p className="mt-1 text-[28px] font-semibold leading-tight">
              {stat.value.toLocaleString()}
            </p>
          )}
          <p className={`mt-1 text-xs ${stat.changeColor}`}>{stat.change}</p>
          </div>
        </article>
      ))}
    </section>
  );
}