import { LoginForm } from '@/components/login-form';
import type React from 'react';
import { BadgeCheck, ClipboardList, Truck } from 'lucide-react';

function LoginPage() {
  return (
    <div className="grid min-h-dvh w-full bg-slate-950 text-white lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden overflow-hidden lg:block">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(30,41,59,0.86))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.20),transparent_34%)]" />
        <div className="relative flex h-full flex-col justify-between px-12 py-10">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-lg bg-white shadow-lg">
              <img src="/logo.png" alt="PIZZA FIVE GUYS logo" className="h-10 w-10 object-contain" />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-wide">PIZZA FIVE GUYS</p>
              <p className="text-xs text-white/55">Central kitchen management</p>
            </div>
          </div>

          <div className="max-w-xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
              Vận hành tập trung
            </p>
            <h1 className="text-5xl font-black leading-tight tracking-normal">
              Quản lý đơn hàng, kho và phân phối trong một màn hình.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-white/68">
              Giao diện mới ưu tiên thao tác nhanh, bảng dữ liệu dễ quét và trạng thái vận hành rõ ràng cho từng vai trò.
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-3 gap-3">
            <InfoTile icon={ClipboardList} label="Đơn hàng" value="Theo dõi" />
            <InfoTile icon={BadgeCheck} label="Kho hàng" value="Kiểm soát" />
            <InfoTile icon={Truck} label="Giao nhận" value="Điều phối" />
          </div>
        </div>
      </section>

      <section className="flex min-h-dvh items-center justify-center bg-background px-4 py-8 text-foreground sm:px-6">
        <LoginForm className="w-full max-w-md" />
      </section>
    </div>
  );
}

function InfoTile({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.07] p-4 backdrop-blur">
      <Icon className="mb-3 size-5 text-amber-300" />
      <p className="text-xs text-white/55">{label}</p>
      <p className="mt-1 text-sm font-bold text-white">{value}</p>
    </div>
  );
}

export default LoginPage;
