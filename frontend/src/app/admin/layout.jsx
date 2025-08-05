import Logo from "@/components/logo.jsx";
import UserNav from "@/components/user-nav.jsx";
import PrivateRoute from "@/components/private-route.jsx";

export default function AdminLayout({
                                        children,
                                    }) {
    return (
        <PrivateRoute>
            <div className="flex min-h-screen w-full flex-col">
                <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
                    <Logo />
                    <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                        <span className="font-bold text-lg">Admin Panel</span>
                    </nav>
                    <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                        <div className="ml-auto flex-1 sm:flex-initial">
                            <UserNav />
                        </div>
                    </div>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                    {children}
                </main>
            </div>
        </PrivateRoute>
    );
}
