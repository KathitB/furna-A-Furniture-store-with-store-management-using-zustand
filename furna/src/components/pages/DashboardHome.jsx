import PageShell from "./PageShell";

export default function DashboardHome({ user }) {
  return (
    <PageShell
      kicker="Dashboard"
      title="Welcome to Furna"
      userName={user?.name}
      stats={[
        ["Total Products", "128"],
        ["Active Orders", "24"],
        ["Customers", "1.2k"],
      ]}
    />
  );
}
