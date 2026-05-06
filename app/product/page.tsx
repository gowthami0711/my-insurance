import { DashboardShell } from "../components/customer/DashboardShell";

export default function ProductPage() {
  return (
    <DashboardShell>
      <div className="rounded-3xl bg-white p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#f0eeff]">
          </div>
          <h1 className="text-2xl font-semibold text-[#202224]">Product</h1>
        </div>
        <p className="text-sm text-[#acacac] mb-8">Manage your insurance products and policies.</p>
      </div>
    </DashboardShell>
  );
}