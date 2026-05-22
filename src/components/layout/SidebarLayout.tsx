import type React from 'react';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';

interface Item {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

interface SideBarLayoutProps {
  items: readonly Item[];
  activeItem: string;
  footerContent?: React.ReactNode;
}

export default function SideBarLayout({ items, activeItem, footerContent }: SideBarLayoutProps) {
  return (
    <aside className="fixed left-0 top-0 z-40 flex h-svh w-72 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-2xl shadow-slate-950/10">
      <div className="flex h-20 items-center gap-3 border-b border-sidebar-border px-5">
        <div className="flex size-11 items-center justify-center rounded-lg bg-white shadow-sm">
          <img src="/logo.png" alt="PIZZA FIVE GUYS logo" className="h-9 w-9 object-contain" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-black uppercase tracking-wide text-white">PIZZA FIVE GUYS</p>
          <p className="truncate text-xs font-medium text-sidebar-foreground/55">Central Kitchen System</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {items.map((item) => {
          const isActive = activeItem === item.href || (item.href !== '/' && activeItem.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'group flex h-11 items-center gap-3 rounded-md px-3 text-sm font-semibold transition',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                  : 'text-sidebar-foreground/72 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
              {item.badge != null && (
                <span
                  className={cn(
                    'flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold',
                    isActive ? 'bg-black/15 text-inherit' : 'bg-white/10 text-sidebar-foreground/70'
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {footerContent && <div className="border-t border-sidebar-border p-3">{footerContent}</div>}
    </aside>
  );
}
