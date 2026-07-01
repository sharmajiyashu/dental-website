import AdminSidebar from "@/components/admin/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar Navigation */}
      <AdminSidebar />

      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col min-w-0 overflow-x-hidden relative">
        {/* Top Spacer for Mobile Bar */}
        <div className="h-16 lg:hidden border-b border-border bg-card px-4 flex items-center justify-end">
          <span className="font-outfit text-sm font-semibold text-teal-600 dark:text-teal-400">
            Healthy Life Admin
          </span>
        </div>
        
        {/* Page Content */}
        <div className="flex-1 p-4 md:p-8 lg:p-10 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
