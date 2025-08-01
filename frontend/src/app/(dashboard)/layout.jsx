import DashboardSidebar from '@/components/dashboard-sidebar.jsx';
import DashboardHeader from '@/components/dashboard-header.jsx';
import { PageTransition } from '@/components/page-transition.jsx';

export default function DashboardLayout({
  children,
}) {
  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <DashboardSidebar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 flex-1">
        <DashboardHeader />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 bg-background">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
      </div>
    </div>
  );
}
