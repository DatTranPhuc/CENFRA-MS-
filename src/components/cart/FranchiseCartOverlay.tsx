/**
 * File: FranchiseCartOverlay.tsx
 * Description: Hiển thị giỏ hàng dưới dạng Overlay/Drawer, hỗ trợ chọn ngày giao
 *              và cập nhật số lượng theo bội số sản phẩm.
 * Author: Tuan Tran
 * Created: 2026
 */

// ================= IMPORTS =================

import React, { useMemo, useRef, useState } from 'react';
import { CalendarDays, Minus, Plus, ShoppingCart, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import http from '@/lib/axios';
import CartDrawer from '@/components/cart/CartDrawer';
import FloatingCart from '@/components/cart/FloatingCart';
import { cn } from '@/lib/utils';
import { createImageFallback, resolveImageUrl } from '@/utils/image';

type Step = 'REVIEW' | 'DATE';

// ================= UTILS =================

const formatCurrencyVND = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

/**
 * FranchiseCartOverlay Component
 * - Hiển thị danh sách món trong giỏ hàng
 * - Cho phép tăng/giảm số lượng theo orderMultiplier
 * - Chọn ngày giao hàng dự kiến và gửi đơn hàng
 */
export default function FranchiseCartOverlay({ children }: { children: React.ReactNode }) {

  // ================= CONTEXT =================

  const { items, totalQuantity, updateQuantity, removeItem, clear } = useCart();
  const { user } = useAuth();

  // ================= STATE =================

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>('REVIEW');
  const [deliveryDate, setDeliveryDate] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  // ================= REF =================

  const deliveryDateRef = useRef<HTMLInputElement | null>(null);

  // ================= UTILS =================

  const canProceed = items.length > 0;
  const totalAmount = useMemo(
    () =>
      items.reduce((sum, i) => {
        const unitPrice = Number(i.unitPrice ?? 0);
        return sum + (Number.isFinite(unitPrice) ? unitPrice : 0) * i.quantity;
      }, 0),
    [items]
  );

  // ================= HANDLER =================

  const closeAndReset = () => {
    setOpen(false);
    setStep('REVIEW');
    setDeliveryDate('');
    setSubmitting(false);
  };

  const openDatePicker = () => {
    const el = deliveryDateRef.current as (HTMLInputElement & { showPicker?: () => void }) | null;
    if (!el) return;
    if (typeof el.showPicker === 'function') {
      el.showPicker();
      return;
    }
    el.focus();
    el.click();
  };

  // ================= API =================

  const submitOrder = async () => {
    let currentUser: any = user;
    if (!currentUser) {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) currentUser = JSON.parse(storedUser);
      } catch {
        // ignore invalid stored user
      }
    }

    const finalStoreId = Number(currentUser?.id);
    if (!Number.isFinite(finalStoreId) || finalStoreId <= 0) {
      toast.error('Không xác định được tài khoản. Vui lòng đăng nhập lại.');
      return;
    }
    if (!deliveryDate) {
      toast.error('Vui lòng chọn ngày giao dự kiến.');
      return;
    }
    const todayStr = new Date().toLocaleDateString('en-CA');
    if (deliveryDate < todayStr) {
      toast.error('Ngày giao phải từ hôm nay trở đi.');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        storeId: finalStoreId,
        deliveryDate,
        details: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      };

      await http.post('/orders', payload);

      toast.success('Tạo đơn hàng thành công! Yêu cầu của bạn đã được gửi lên Bếp trung tâm.');
      clear();
      closeAndReset();
    } catch (error) {
      console.error(error);
      toast.error('Gửi yêu cầu thất bại (xem Console/Network để biết lỗi backend).');
    } finally {
      setSubmitting(false);
    }
  };

  // ================= RENDER =================

  return (
    <>
      {children}

      <FloatingCart onClick={() => setOpen(true)} />

      <CartDrawer
        open={open}
        onOpenChange={(next) => (next ? setOpen(true) : closeAndReset())}
        title={
          <div className="flex items-center justify-between gap-3 pr-1">
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold tracking-tight text-amber-950">Giỏ hàng</h2>
              <p className="mt-0.5 text-xs font-medium text-amber-800/70">
                {items.length} món · {totalQuantity} đơn vị
              </p>
            </div>
            <button
              type="button"
              onClick={closeAndReset}
              className="flex size-8 shrink-0 items-center justify-center rounded-full text-amber-400 transition hover:bg-amber-50 hover:text-amber-700"
              aria-label="Đóng"
            >
              <X className="size-5" />
            </button>
          </div>
        }
      >
        {step === 'REVIEW' && (
          <div className="flex h-full min-h-0 flex-col bg-white">
            <div className="min-h-0 grow overflow-y-auto overflow-x-hidden overscroll-y-contain px-5 pb-3 pt-4 [scrollbar-gutter:stable]">
              {items.length === 0 ? (
                <div className="rounded-xl border border-dashed border-amber-100 px-4 py-12 text-center text-sm text-amber-700/50">
                  Giỏ hàng đang trống. Hãy thêm món từ menu.
                </div>
              ) : (
                <ul className="space-y-2">
                  {items.map((i) => {
                    const itemUnitPrice = Number(i.unitPrice ?? 0);
                    const safeUnit = Number.isFinite(itemUnitPrice) ? itemUnitPrice : 0;
                    return (
                      <li
                        key={i.productId}
                        className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-xs"
                      >
                        <div className="size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                          {i.imageUrl ? (
                            <img src={resolveImageUrl(i.imageUrl)} alt="" className="size-full object-cover" onError={createImageFallback(i.name)} />
                          ) : (
                            <div className="flex size-full items-center justify-center text-[10px] text-muted-foreground/50">
                              IMG
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-foreground">{i.name}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {formatCurrencyVND(safeUnit)}
                            {i.unitName ? <span className="text-muted-foreground/60"> · {i.unitName}</span> : null}
                            {i.orderMultiplier && i.orderMultiplier > 1 ? (
                              <span className="ml-2 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                                Bội số: {i.orderMultiplier}
                              </span>
                            ) : null}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              const multiplier = i.orderMultiplier || 1;
                              const nextQty = i.quantity - multiplier;
                              if (nextQty < multiplier) {
                                toast.error(`Số lượng tối thiểu là ${multiplier}`);
                                return;
                              }
                              updateQuantity({ productId: i.productId, quantity: nextQty });
                            }}
                            className="flex size-8 items-center justify-center rounded-lg border border-border bg-card text-foreground transition hover:bg-secondary cursor-pointer"
                            aria-label="Giảm số lượng"
                          >
                            <Minus className="size-3" strokeWidth={2.5} />
                          </button>
                          <span className="min-w-[1.75rem] text-center text-sm font-semibold text-foreground tabular-nums">
                            {i.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const multiplier = i.orderMultiplier || 1;
                              updateQuantity({ productId: i.productId, quantity: i.quantity + multiplier });
                            }}
                            className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm transition hover:bg-primary/90 cursor-pointer"
                            aria-label="Tăng số lượng"
                          >
                            <Plus className="size-3" strokeWidth={2.5} />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeItem({ productId: i.productId })}
                            className="ml-1 flex size-7 items-center justify-center rounded-lg text-muted-foreground/60 transition hover:bg-secondary hover:text-destructive cursor-pointer"
                            aria-label="Xóa"
                            title="Xóa"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="mt-auto flex shrink-0 flex-col border-t border-border bg-card px-5 pb-6 pt-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Tạm tính</span>
                  <span className="tabular-nums text-foreground font-semibold">{formatCurrencyVND(totalAmount)}</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Thuế</span>
                  <span className="tabular-nums text-foreground font-semibold">{formatCurrencyVND(0)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-border pt-2 text-base font-extrabold">
                  <span className="text-foreground">Tổng cộng</span>
                  <span className="tabular-nums text-primary font-extrabold">{formatCurrencyVND(totalAmount)}</span>
                </div>
              </div>

              <div className="mt-3">
                <button
                  type="button"
                  disabled={items.length === 0}
                  onClick={() => { clear(); toast.success('Đã xóa giỏ hàng'); }}
                  className={cn(
                    'text-xs text-muted-foreground underline-offset-2 hover:text-destructive hover:underline cursor-pointer',
                    'disabled:pointer-events-none disabled:opacity-40'
                  )}
                >
                  Xóa giỏ
                </button>
              </div>

              <Button
                type="button"
                disabled={!canProceed}
                onClick={() => setStep('DATE')}
                className={cn(
                  'mt-3 h-11 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground cursor-pointer',
                  'transition hover:bg-primary/90 disabled:opacity-40'
                )}
              >
                <span className="flex items-center justify-center gap-2">
                  <ShoppingCart className="size-4" />
                  Tiếp tục đặt hàng
                </span>
              </Button>
            </div>
          </div>
        )}

        {step === 'DATE' && (
          <div className="flex h-full min-h-0 flex-col bg-card">
            <div className="min-h-0 grow overflow-y-auto overflow-x-hidden overscroll-y-contain px-5 pb-3 pt-5 [scrollbar-gutter:stable]">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-foreground">Ngày giao dự kiến</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Bếp trung tâm sẽ xử lý theo ngày giao bạn chọn.
                  </p>
                  <div className="relative mt-3">
                    <input
                      ref={deliveryDateRef}
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      onFocus={openDatePicker}
                      className={cn(
                        'h-11 w-full cursor-pointer rounded-lg border border-border bg-card px-3 pr-11 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium',
                      )}
                    />
                    <button
                      type="button"
                      onClick={openDatePicker}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground/60 transition hover:bg-secondary hover:text-primary cursor-pointer"
                      aria-label="Mở lịch chọn ngày"
                    >
                      <CalendarDays className="size-5" />
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-secondary/30 px-4 py-3 text-xs text-muted-foreground">
                  <div className="flex justify-between items-center">
                    <span>Tổng cộng</span>
                    <span className="font-extrabold text-foreground text-sm">{formatCurrencyVND(totalAmount)}</span>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground/80">
                    {items.length} món · {totalQuantity} đơn vị
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-auto flex shrink-0 flex-col space-y-2.5 border-t border-border bg-card px-5 pb-6 pt-4">
              <Button
                type="button"
                variant="outline"
                className="h-10 w-full rounded-xl border-border bg-card text-sm font-medium text-muted-foreground hover:bg-secondary cursor-pointer"
                onClick={() => setStep('REVIEW')}
                disabled={submitting}
              >
                Quay lại
              </Button>
              <Button
                type="button"
                onClick={submitOrder}
                disabled={submitting || items.length === 0}
                className={cn(
                  'h-11 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground cursor-pointer',
                  'hover:bg-primary/90 disabled:opacity-40 shadow-md shadow-primary/10'
                )}
              >
                <span className="flex items-center justify-center gap-2">
                  {submitting ? null : <ShoppingCart className="size-4" />}
                  {submitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
                </span>
              </Button>
            </div>
          </div>
        )}
      </CartDrawer>
    </>
  );
}
