
type SidebarItem = {
  label: string;
  icon: string;
  href: string;
  active?: boolean;
}

export const sidebarItems: SidebarItem[] = [
  { label: "Dashboard", icon: "dashboard", href:"/" },
  { label: "Product", icon: "product",  href:"/product" },
  { label: "Customers", icon: "customer", href:"/customers"},
  { label: "Income", icon: "income",  href:"/income" },
  { label: "Promote", icon: "promote",  href:"/promote" },
  { label: "Help", icon: "help",  href:"/help" },
];


