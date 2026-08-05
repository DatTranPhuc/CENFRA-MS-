import http from '@/lib/axios';
import { useEffect, useState } from 'react';

const cache = new Map<string, { url: string; expiresAt: number }>();

/**
 * Lấy presigned URL từ backend để hiển thị ảnh từ S3 private bucket.
 * Cache lại URL trong 13 phút (presigned URL thường expire sau 15 phút).
 */
async function fetchPresignedUrl(key: string): Promise<string> {
  const cached = cache.get(key);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.url;
  }

  const response = await http.get<{ url: string } | string>('/files/presigned', {
    params: { key },
  });

  // Backend có thể trả về string hoặc object { url: '...' }
  const url = typeof response.data === 'string' ? response.data : response.data.url;

  cache.set(key, {
    url,
    expiresAt: Date.now() + 13 * 60 * 1000, // cache 13 phút
  });

  return url;
}

/**
 * Detect xem một string là object key (relative) hay full URL.
 * Object key: "products/abc.jpg" hoặc "/products/abc.jpg"
 * Full S3 URL: "https://....s3.amazonaws.com/..."
 */
function extractS3Key(imageUrl: string): string | null {
  if (!imageUrl) return null;

  try {
    // Nếu là full S3 URL, lấy phần path sau bucket name
    if (imageUrl.includes('s3.amazonaws.com')) {
      const url = new URL(imageUrl);
      // pathname bắt đầu bằng '/', bỏ '/' đầu
      return url.pathname.startsWith('/') ? url.pathname.slice(1) : url.pathname;
    }

    // Nếu là object key (không phải URL đầy đủ), dùng thẳng
    if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
      return imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl;
    }
  } catch {
    // Không parse được URL → dùng thẳng làm key
    return imageUrl;
  }

  return null; // Là URL của service khác, không phải S3
}

interface S3ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  imageUrl?: string | null;
  fallback?: string;
}

/**
 * Component hiển thị ảnh từ S3 private bucket thông qua presigned URL.
 * Tự động lấy presigned URL từ backend, có cache 13 phút.
 *
 * Usage:
 *   <S3Image imageUrl={product.imageUrl} alt={product.name} className="..." />
 */
export function S3Image({ imageUrl, fallback = '', alt = '', ...props }: S3ImageProps) {
  const [src, setSrc] = useState<string>(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!imageUrl) {
      setSrc(fallback);
      setLoading(false);
      return;
    }

    const key = extractS3Key(imageUrl);

    if (!key) {
      // URL của service khác (không phải S3) → dùng thẳng
      setSrc(imageUrl);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(false);

    fetchPresignedUrl(key)
      .then((url) => {
        setSrc(url);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setSrc(fallback);
        setLoading(false);
      });
  }, [imageUrl, fallback]);

  if (loading) {
    return (
      <div
        style={{ width: props.width, height: props.height }}
        className={`animate-pulse bg-gray-700 ${props.className ?? ''}`}
      />
    );
  }

  if (error || !src) {
    return (
      <div
        style={{ width: props.width, height: props.height }}
        className={`flex items-center justify-center bg-gray-800 text-gray-500 text-xs ${props.className ?? ''}`}
      >
        No Image
      </div>
    );
  }

  return <img src={src} alt={alt} {...props} />;
}
