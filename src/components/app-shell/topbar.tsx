export function Topbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b px-6">
      <div className="text-muted-foreground text-sm">
        <span>Dashboard</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="bg-muted text-muted-foreground flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium">
          U
        </div>
      </div>
    </header>
  );
}
