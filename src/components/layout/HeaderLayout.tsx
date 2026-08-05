import { Bell, Search } from 'lucide-react';

interface HeaderLayoutProps {
  welcomeHighlight: string;
}

export default function HeaderLayout({ welcomeHighlight }: HeaderLayoutProps) {
  const display = welcomeHighlight?.trim() || 'bạn';

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between gap-4 px-6 sm:px-8">
        {/* Welcome message */}
        <div className="min-w-0">
          <p className="truncate text-sm text-muted-foreground font-medium">
            Xin chào, <span className="font-bold text-primary">{display}</span> 👋
          </p>
          <p className="truncate text-xs text-muted-foreground/80 mt-0.5">Theo dõi vận hành bếp trung tâm trong ngày.</p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Quick search input */}
          <div className="hidden h-9 w-64 items-center gap-2.5 rounded-lg border border-border bg-card px-3 text-xs text-muted-foreground/70 shadow-sm transition-all hover:border-border/90 hover:shadow lg:flex cursor-pointer">
            <Search className="size-3.5 text-muted-foreground/60" />
            <span className="truncate tracking-wide font-medium">Tìm kiếm nhanh...</span>
          </div>

          {/* Notification bell */}
          <button
            type="button"
            className="relative flex size-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground/80 shadow-sm transition-all duration-300 hover:bg-secondary hover:text-foreground hover:scale-105"
            aria-label="Thông báo"
          >
            <Bell className="size-4" />
            {/* Notification ping badge */}
            <span className="absolute right-2 top-2 size-2 rounded-full bg-primary ring-2 ring-background animate-pulse" />
          </button>
        </div>
      </div>
    </header>
  );
}
