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
    <aside className="fixed left-0 top-0 z-40 flex h-svh w-72 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-2xl shadow-black/40">
      {/* Brand Section */}
      <div className="flex h-20 items-center gap-3 border-b border-sidebar-border/60 px-6">
        <div className="flex size-11 items-center justify-center rounded-xl bg-white p-1.5 shadow-md shadow-black/10 ring-2 ring-white/10 transition-transform hover:scale-105 duration-300">
          <img src="/logo.png" alt="PIZZA FIVE GUYS logo" className="h-full w-full object-contain" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-extrabold uppercase tracking-wider text-white">PIZZA FIVE GUYS</p>
          <p className="truncate text-xs font-semibold text-sidebar-foreground/50 tracking-wide uppercase">Central Kitchen</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto px-4 py-6 scrollbar-thin scrollbar-thumb-white/10">
        {items.map((item) => {
          const isActive = activeItem === item.href || (item.href !== '/' && activeItem.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'group relative flex h-11 items-center gap-3 rounded-lg px-3.5 text-sm font-semibold transition-all duration-300 ease-out',
                isActive
                  ? 'bg-gradient-to-r from-primary to-primary/85 text-primary-foreground shadow-md shadow-primary/20'
                  : 'text-sidebar-foreground/75 hover:bg-white/[0.04] hover:text-white hover:translate-x-1'
              )}
            >
              {/* Active Indicator Line */}
              {isActive && (
                <span className="absolute -left-1 top-1/3 h-1/3 w-1.5 rounded-r bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              )}
              
              <Icon className={cn(
                "size-4 shrink-0 transition-transform duration-300 group-hover:scale-110",
                isActive ? "text-white" : "text-sidebar-foreground/50 group-hover:text-white"
              )} />
              
              <span className="min-w-0 flex-1 truncate tracking-wide">{item.label}</span>
              
              {item.badge != null && (
                <span
                  className={cn(
                    'flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-extrabold tracking-tight transition-colors duration-300',
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-white/10 text-sidebar-foreground/70 group-hover:bg-white/25 group-hover:text-white'
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Content */}
      {footerContent && (
        <div className="border-t border-sidebar-border/60 bg-black/10 p-4">
          {footerContent}
        </div>
      )}
    </aside>
  );
}
