export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="h-screen bg-bg-primary">{children}</div>;
}
