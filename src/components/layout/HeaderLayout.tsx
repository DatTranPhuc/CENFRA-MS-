import { Bell, Search } from 'lucide-react';

interface HeaderLayoutProps {
  welcomeHighlight: string;
}

export default function HeaderLayout({ welcomeHighlight }: HeaderLayoutProps) {
  const display = welcomeHighlight?.trim() || 'bạn';

  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-background/90 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between gap-4 px-5 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">Xin chào, {display}</p>
          <p className="truncate text-xs text-muted-foreground">Theo dõi vận hành bếp trung tâm trong ngày.</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden h-9 w-72 items-center gap-2 rounded-md border border-border bg-white px-3 text-sm text-muted-foreground shadow-sm lg:flex">
            <Search className="size-4" />
            <span className="truncate">Tìm kiếm nhanh...</span>
          </div>
          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-md border border-border bg-white text-muted-foreground shadow-sm transition hover:bg-secondary hover:text-foreground"
            aria-label="Thông báo"
          >
            <Bell className="size-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
