export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dark bg-background text-foreground min-h-screen">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">{children}</div>
    </div>
  );
}
