import type React from 'react';
import { useLocation } from 'react-router';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut } from 'lucide-react';
import { Role } from '@/Types';
import { translateRole } from '@/utils/labelMapping';
import SideBarLayout from './SidebarLayout';
import HeaderLayout from './HeaderLayout';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: readonly NavItem[];
  roleLabel: string;
}

const getStoreDisplayName = (userName: string, user: any) => {
  if (user?.storeName) return user.storeName;
  return userName ? `Cửa hàng ${userName}` : 'Cửa hàng';
};

const buildSidebarFooter = (params: {
  roleLabel: string;
  userName: string;
  user: any;
  logout: () => void;
  contextRoleName: string | null;
}) => {
  const { roleLabel, userName, user, logout, contextRoleName } = params;
  const effectiveRole = contextRoleName ?? roleLabel;
  const isFranchiseStore = roleLabel === Role.FRANCHISE_STORE_STAFF;
  const mainLabel = isFranchiseStore ? getStoreDisplayName(userName, user) : userName || 'Người dùng';
  const roleText = translateRole(effectiveRole);

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-white/10 bg-white/[0.06] p-3">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-sm font-bold text-sidebar-primary-foreground shadow-sm">
            {userName?.charAt(0)?.toUpperCase() ?? 'C'}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-sidebar-foreground" title={mainLabel}>
              {mainLabel}
            </p>
            {roleText && (
              <p className="truncate text-xs text-sidebar-foreground/60" title={roleText}>
                {roleText}
              </p>
            )}
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={logout}
        className="flex h-10 w-full items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 text-sm font-semibold text-sidebar-foreground/80 transition hover:bg-white/[0.08] hover:text-white"
      >
        <LogOut className="size-4 shrink-0" />
        Đăng xuất
      </button>
    </div>
  );
};

export default function DashboardLayout({ children, navItems, roleLabel }: DashboardLayoutProps) {
  const location = useLocation();
  const { userName, user, roleName: contextRoleName, logout } = useAuth();
  const effectiveRole = contextRoleName ?? roleLabel;
  const roleVi = translateRole(effectiveRole);
  const welcomeHighlight = roleVi?.trim() ? roleVi : userName?.trim() || 'bạn';
  const sidebarFooter = buildSidebarFooter({ roleLabel, userName, user, logout, contextRoleName });

  return (
    <div className="app-surface flex min-h-svh text-foreground">
      <SideBarLayout items={navItems} activeItem={location.pathname} footerContent={sidebarFooter} />
      <div className="ml-72 flex min-w-0 flex-1 flex-col">
        <HeaderLayout welcomeHighlight={welcomeHighlight} />
        <main className="min-w-0 flex-1 overflow-auto px-5 py-5 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
