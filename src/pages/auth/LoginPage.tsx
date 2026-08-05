import { LoginForm } from '@/components/login-form';
import type React from 'react';
import { BadgeCheck, ClipboardList, Truck } from 'lucide-react';

function LoginPage() {
  return (
    <div className="grid min-h-dvh w-full bg-slate-950 text-white lg:grid-cols-[1.1fr_0.9fr]">
      {/* Visual Brand Section */}
      <section className="relative hidden overflow-hidden lg:block">
        {/* Warm Obsidian Mahogany Gradient */}
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(31,20,18,0.98),rgba(18,12,11,0.92))]" />
        
        {/* Soft Golden Amber Glows */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.18),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(220,38,38,0.12),transparent_45%)]" />
        
        {/* Grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

        <div className="relative flex h-full flex-col justify-between px-16 py-12">
          {/* Logo header */}
          <div className="flex items-center gap-3.5">
            <div className="flex size-12 items-center justify-center rounded-xl bg-white p-1.5 shadow-lg shadow-black/20 ring-2 ring-white/10">
              <img src="/logo.png" alt="PIZZA FIVE GUYS logo" className="h-full w-full object-contain" />
            </div>
            <div>
              <p className="text-sm font-extrabold uppercase tracking-widest text-white">PIZZA FIVE GUYS</p>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-white/50">Central kitchen management</p>
            </div>
          </div>

          {/* Copywriting */}
          <div className="max-w-xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-accent">
              Vận hành tập trung chuyên nghiệp
            </p>
            <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-white">
              Quản lý đơn hàng, kho và phân phối trong một màn hình.
            </h1>
            <p className="mt-6 max-w-md text-sm leading-7 text-white/70">
              Giao diện mới ưu tiên thao tác nhanh, bảng dữ liệu dễ quét và trạng thái vận hành rõ ràng cho từng vai trò trong hệ thống Pizza Five Guys.
            </p>
          </div>

          {/* Feature Badges */}
          <div className="grid max-w-2xl grid-cols-3 gap-4">
            <InfoTile icon={ClipboardList} label="Đơn đặt hàng" value="Kiểm soát tức thì" />
            <InfoTile icon={BadgeCheck} label="Kho trung tâm" value="Đồng bộ thời gian thực" />
            <InfoTile icon={Truck} label="Chuỗi cung ứng" value="Điều phối thông minh" />
          </div>
        </div>
      </section>

      {/* Login Form Section */}
      <section className="flex min-h-dvh items-center justify-center bg-background px-6 py-10 text-foreground sm:px-12">
        <LoginForm className="w-full max-w-md" />
      </section>
    </div>
  );
}

function InfoTile({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="group rounded-xl border border-white/5 bg-white/[0.03] p-4.5 backdrop-blur-md transition-all duration-300 hover:bg-white/[0.06] hover:border-white/10 hover:-translate-y-1">
      <Icon className="mb-3.5 size-5.5 text-accent transition-transform duration-300 group-hover:scale-110" />
      <p className="text-[11px] font-medium text-white/40 tracking-wide uppercase">{label}</p>
      <p className="mt-1 text-sm font-bold text-white tracking-wide">{value}</p>
    </div>
  );
}

export default LoginPage;
