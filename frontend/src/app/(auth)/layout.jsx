import Logo from '@/components/logo.jsx';

export default function AuthLayout({
  children,
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 antialiased">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        {children}
      </div>
    </div>
  );
}
