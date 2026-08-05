/**
 * File: CreateOrderPage.tsx
 * Description: Giao diện chọn món phân loại theo danh mục và thẻ sản phẩm nằm ngang
 * Author: Tuan Tran , DatTranPhuc
 * Created: 2026
 */

// ================= IMPORTS =================

import { useEffect, useMemo, useState } from 'react';
import { Search, Plus, Loader2, UtensilsCrossed } from 'lucide-react';
import { managerServices, type ProductsResponse } from '@/services/managerServices';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';
import { createImageFallback, resolveImageUrl } from '@/utils/image';

/**
 * Helper: Định dạng tiền tệ VND
 */
const formatCurrencyVND = (value?: number) => {
  const amount = Number(value ?? 0);
  if (!Number.isFinite(amount) || amount <= 0) return 'Liên hệ';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

/**
 * CreateOrderPage Component
 * - Lấy danh sách sản phẩm từ API
 * - Tìm kiếm và lọc theo danh mục
 * - Hiển thị sản phẩm theo nhóm danh mục
 */
const CreateOrderPage = () => {

  // ================= STATE =================

  // Từ khóa tìm kiếm
  const [search, setSearch] = useState('');
  
  // Lọc theo danh mục đã chọn
  const [categoryFilter, setCategoryFilter] = useState<number | 'ALL'>('ALL');
  
  // Toàn bộ sản phẩm ACTIVE từ API
  const [products, setProducts] = useState<ProductsResponse[]>([]);
  
  // Trạng thái loading
  const [isLoading, setIsLoading] = useState(false);

  // Context giỏ hàng
  const { addItem } = useCart();

  // ================= EFFECT =================

  useEffect(() => {
    fetchProducts();
  }, []);

  // ================= API =================

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await managerServices.getAllProducts();
      if (response && response.success) {
        const data = response.data;
        let pList: ProductsResponse[] = [];
        if (Array.isArray(data)) {
          pList = data;
        } else if (data && typeof data === 'object' && 'content' in data) {
          pList = (data as any).content || [];
        } else if (data && typeof data === 'object' && 'items' in data) {
          pList = (data as any).items || [];
        }
        setProducts(pList.filter((p) => p.status === 'ACTIVE'));
      }
    } catch {
      toast.error('Lỗi khi lấy danh sách sản phẩm');
    } finally {
      setIsLoading(false);
    }
  };

  // ================= HANDLER =================

  /**
   * Xử lý thêm sản phẩm vào giỏ hàng
   */
  const handleAddToCart = (p: ProductsResponse) => {
    addItem({
      productId: p.productId,
      name: p.productName,
      unitName: p.unitName,
      unitPrice: p.price,
      imageUrl: resolveImageUrl(p.imageUrl),
      orderMultiplier: p.orderMultiplier,
    });
    toast.success(`Đã thêm "${p.productName}" vào giỏ hàng`);
  };

  // ================= UTILS =================

  // Danh sách các ID/Tên danh mục duy nhất để hiển thị bộ lọc
  const categoryOptions = useMemo(
    () =>
      Array.from(
        new Map(
          products
            .filter((p) => p.categoryId && p.categoryName)
            .map((p) => [p.categoryId, p.categoryName] as const)
        )
      ),
    [products]
  );

  // Sản phẩm sau khi search & filter
  const filteredProducts = useMemo(() => {
    let data = products;
    if (categoryFilter !== 'ALL') data = data.filter((p) => p.categoryId === categoryFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (p) =>
          p.productName.toLowerCase().includes(q) ||
          (p.categoryName || '').toLowerCase().includes(q)
      );
    }
    return data;
  }, [products, categoryFilter, search]);

  // Nhóm sản phẩm theo danh mục để render Section
  const groupedProducts = useMemo(() => {
    const groups: Record<string, { name: string; items: ProductsResponse[] }> = {};
    filteredProducts.forEach((p) => {
      const catName = p.categoryName || 'Khác';
      if (!groups[catName]) groups[catName] = { name: catName, items: [] };
      groups[catName].items.push(p);
    });
    return Object.values(groups);
  }, [filteredProducts]);

  // ================= RENDER =================

  return (
    <div className="flex min-h-full flex-col bg-background/30">

      {/* ── BỘ LỌC VÀ TÌM KIẾM ── */}
      <div className="sticky top-0 z-10 border-b border-border/60 bg-background/80 backdrop-blur-md px-6 py-4.5 shadow-sm shadow-black/[0.01]">
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60" />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm hoặc nguyên liệu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 w-full rounded-xl border border-border bg-card pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/80 focus:bg-card focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategoryFilter('ALL')}
            className={cn(
              'rounded-full border cursor-pointer px-4.5 py-1.5 text-xs font-bold transition-all duration-300',
              categoryFilter === 'ALL'
                ? 'border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/25'
                : 'border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground'
            )}
          >
            Tất cả
          </button>
          {categoryOptions.map(([id, name]) => (
            <button
              key={id}
              onClick={() => setCategoryFilter(id)}
              className={cn(
                'rounded-full border cursor-pointer px-4.5 py-1.5 text-xs font-bold transition-all duration-300',
                categoryFilter === id
                  ? 'border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/25'
                  : 'border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground'
              )}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* ── DANH SÁCH MÓN ĂN ── */}
      <div className="flex-1 p-6 sm:p-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-36">
            <Loader2 className="size-10 animate-spin text-primary/60" />
            <p className="text-sm font-semibold text-muted-foreground">Đang chuẩn bị thực đơn...</p>
          </div>
        ) : groupedProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-36 text-muted-foreground/60">
            <UtensilsCrossed className="size-12 opacity-30" />
            <p className="text-sm font-semibold">Rất tiếc, không tìm thấy món bạn cần.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {groupedProducts.map((group) => (
              <div key={group.name} className="space-y-6">
                <h2 className="text-xl font-extrabold text-foreground flex items-center gap-3">
                  <span className="relative pl-3.5 before:absolute before:left-0 before:top-1 before:h-5 before:w-1.5 before:rounded-full before:bg-primary">
                    {group.name}
                  </span>
                  <div className="h-px flex-1 bg-border/80" />
                </h2>
                
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                  {group.items.map((p) => (
                    <ProductCard
                      key={p.productId}
                      product={p}
                      onAdd={() => handleAddToCart(p)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * ProductCard Component
 * - Thiết kế nằm ngang (Horizontal)
 * - Thông tin bên trái, hình ảnh bên phải
 * - Nút thêm nhanh màu tối ở góc hình ảnh
 */
function ProductCard({
  product: p,
  onAdd,
}: {
  product: ProductsResponse;
  onAdd: () => void;
}) {
  return (
    <div className="group relative flex h-44 overflow-hidden rounded-2xl border border-border/80 bg-card p-4.5 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-black/[0.02] hover:-translate-y-0.5 hover:border-primary/20 active:scale-[0.99]">
      
      {/* ── Thông tin món (Bên trái) ── */}
      <div className="flex flex-1 flex-col justify-between py-0.5 pr-4">
        <div className="space-y-1.5">
          <h3 className="line-clamp-2 text-sm font-extrabold leading-snug text-foreground group-hover:text-primary transition-colors duration-300">
            {p.productName}
          </h3>
          <p className="line-clamp-2 text-[11px] leading-relaxed text-muted-foreground/80 font-medium">
            {p.description || `Đơn vị: ${p.unitName} - Sản phẩm chất lượng cao cho nhà hàng.`}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-base font-extrabold text-foreground">
            {formatCurrencyVND(p.price)}
          </span>
        </div>
      </div>

      {/* ── Hình ảnh (Bên phải) ── */}
      <div className="relative aspect-square w-28 shrink-0 overflow-hidden rounded-xl bg-muted">
        {p.imageUrl ? (
          <img
            src={resolveImageUrl(p.imageUrl)}
            alt={p.productName}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            loading="lazy"
            onError={createImageFallback(p.productName)}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center text-muted-foreground/45">
            <UtensilsCrossed className="size-7 opacity-40" />
          </div>
        )}

        {/* Cắt góc cho nút Add */}
        <div className="absolute -bottom-1 -right-1 flex items-end justify-end">
          <div className="relative flex h-14 w-14 items-end justify-end rounded-tl-[2rem] bg-card p-1 shadow-[-4px_-4px_10px_rgba(0,0,0,0.015)]">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAdd();
              }}
              className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/20 transition-all duration-300 hover:bg-primary/90 hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="Thêm vào giỏ"
            >
              <Plus className="size-4.5 stroke-[3.5]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateOrderPage;
