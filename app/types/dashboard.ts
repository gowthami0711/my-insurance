export type SidebarItem = {
  label: string;
  icon: string;
  active?: boolean;
};

export type Customer = {
  name: string;
  company: string;
  phone: string;
  email: string;
  country: string;
  status: "Active" | "Inactive";
};

export type StatCard = {
  title: string;
  value: string;
  change: string;
};
