
import { DashboardShell } from "../components/customer/DashboardShell";
import { StatsCards } from "../components/customer/StatsCards";
import { WorkspaceLayout } from "../components/workspace/WorkspaceLayout";

export default function CustomersPage() {
  return (
    <DashboardShell>
      <StatsCards />
      <WorkspaceLayout />
    </DashboardShell>
  );
}