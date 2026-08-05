/**
 * Utility to resolve product/ingredient image URLs.
 * If the image path is relative (e.g., /uploads/image.png),
 * it prefixes it with VITE_API_BASE_URL to load from the remote backend.
 * If the image is a full backend URL, rewrite it to go through the Vite proxy (/api/...)
 * to avoid CORS issues in development.
 */

// The actual backend origin (used to detect and rewrite backend URLs)
const BACKEND_ORIGIN = 'https://cenframs.tuandat.space';

export const resolveImageUrl = (url?: string | null): string => {
  if (!url || !url.trim()) return '';

  // If URL belongs to the backend, rewrite it through the Vite proxy
  if (url.startsWith(BACKEND_ORIGIN)) {
    const path = url.slice(BACKEND_ORIGIN.length); // e.g. /uploads/image.png
    return `/api${path}`;
  }

  // If it's another absolute URL or data/blob URI, return as-is
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('data:') ||
    url.startsWith('blob:')
  ) {
    return url;
  }

  // Relative path — prefix with VITE_API_BASE_URL (e.g. /api)
  const baseUrl = (import.meta.env.VITE_API_BASE_URL || '').trim();
  const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;

  return `${cleanBase}${cleanUrl}`;
};

// ─── Keyword mapping cho món ăn phổ biến ───────────────────────────────────
// Ánh xạ từ khóa trong tên sản phẩm → keyword tìm ảnh thực phẩm phù hợp
const FOOD_KEYWORD_MAP: Array<{ pattern: RegExp; keywords: string }> = [
  // Việt Nam
  { pattern: /phở|pho/i,                keywords: 'pho,vietnamese,noodle,soup' },
  { pattern: /bún bò|bun bo/i,           keywords: 'bun-bo,beef,noodle,vietnamese' },
  { pattern: /bún|bun/i,                 keywords: 'noodle,vietnamese,soup' },
  { pattern: /cơm gà|chicken rice/i,     keywords: 'chicken,rice,asian' },
  { pattern: /cơm tấm|com tam/i,         keywords: 'broken-rice,vietnamese,pork' },
  { pattern: /cơm|rice/i,               keywords: 'rice,asian,food' },
  { pattern: /bánh mì|banh mi/i,         keywords: 'banh-mi,sandwich,vietnamese' },
  { pattern: /gỏi cuốn|spring roll/i,    keywords: 'spring-roll,vietnamese,fresh' },
  { pattern: /chả giò|cha gio/i,         keywords: 'fried,spring-roll,vietnamese' },
  { pattern: /hủ tiếu|hu tieu/i,         keywords: 'noodle,soup,vietnamese' },
  { pattern: /lẩu|hot pot/i,             keywords: 'hotpot,soup,asian' },
  // Thịt
  { pattern: /bò|beef/i,                keywords: 'beef,grilled,food' },
  { pattern: /gà|chicken/i,             keywords: 'chicken,grilled,food' },
  { pattern: /heo|pork|lợn/i,           keywords: 'pork,grilled,food' },
  { pattern: /tôm|shrimp|prawn/i,       keywords: 'shrimp,seafood,food' },
  { pattern: /cá|fish/i,                keywords: 'fish,seafood,food' },
  { pattern: /mực|squid/i,              keywords: 'squid,seafood,food' },
  // Đồ uống
  { pattern: /trà sữa|milk tea/i,       keywords: 'bubble-tea,milk-tea,drink' },
  { pattern: /cà phê|coffee/i,          keywords: 'coffee,vietnamese,drink' },
  { pattern: /nước ép|juice/i,          keywords: 'juice,fresh,drink' },
  { pattern: /sinh tố|smoothie/i,       keywords: 'smoothie,fruit,drink' },
  { pattern: /sprite|pepsi|coca|soda/i, keywords: 'soda,drink,can' },
  { pattern: /nước|water|drink/i,       keywords: 'drink,beverage,glass' },
  // Tráng miệng & bánh
  { pattern: /kem|ice cream/i,          keywords: 'ice-cream,dessert,food' },
  { pattern: /bánh|cake/i,              keywords: 'cake,pastry,food' },
  { pattern: /chè/i,                    keywords: 'dessert,sweet,vietnamese' },
];

/**
 * Trích xuất keyword thực phẩm phù hợp từ tên sản phẩm.
 * Fallback về 'food,dish,meal' nếu không khớp keyword nào.
 */
const extractFoodKeyword = (name: string): string => {
  for (const { pattern, keywords } of FOOD_KEYWORD_MAP) {
    if (pattern.test(name)) return keywords;
  }
  return 'food,dish,meal';
};

/**
 * Tạo số lock nhất quán từ seed string (để cùng tên → cùng ảnh).
 */
const stableHash = (s: string): number =>
  Math.abs(s.split('').reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) | 0, 0)) % 9999 + 1;

/**
 * Tạo ảnh placeholder minh họa món ăn từ loremflickr.com.
 * - Tìm ảnh theo keyword liên quan đến tên món (gà, bò, phở, nước...)
 * - Cùng tên sản phẩm → cùng ảnh (lock seed nhất quán)
 *
 * @param productName - Tên món ăn (dùng để chọn keyword và tạo seed)
 * @param width       - Chiều rộng ảnh (mặc định 400)
 * @param height      - Chiều cao ảnh (mặc định 400)
 */
export const getPlaceholderImage = (
  productName?: string | number,
  width = 400,
  height = 400,
): string => {
  const name = String(productName ?? 'food');
  const keywords = typeof productName === 'number' ? 'food,dish,meal' : extractFoodKeyword(name);
  const lock = typeof productName === 'number' ? productName % 9999 : stableHash(name);
  // loremflickr: cùng keyword + lock → cùng ảnh, luôn liên quan đến từ khóa
  return `https://loremflickr.com/${width}/${height}/${keywords}?lock=${lock}`;
};

/**
 * onError handler cho thẻ <img> — tự động thay bằng ảnh minh họa món ăn phù hợp
 * khi ảnh gốc lỗi (S3 chưa public, ảnh không tải được...).
 *
 * Usage:
 *   <img src={resolveImageUrl(p.imageUrl)} onError={createImageFallback(p.productName)} />
 */
export const createImageFallback = (productName?: string | number) =>
  (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget;
    target.onerror = null; // tránh loop vô hạn
    target.src = getPlaceholderImage(productName);
  };
