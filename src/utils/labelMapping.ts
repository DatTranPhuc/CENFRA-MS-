export const STATUS_LABEL_MAP: Record<string, string> = {
  PENDING: 'Chờ duyệt',
  APPROVED: 'Đã duyệt',
  CONSOLIDATED: 'Đã gộp',
  CANCELLED: 'Đã hủy',
  AWAITING_DELIVERY: 'Chờ giao hàng',
  DELIVERY_ISSUE_PENDING: 'Chờ xử lý sự cố',
  DELIVERY_FAILED: 'Giao hàng thất bại',
  READY: 'Sẵn sàng',
  IN_TRANSIT: 'Đang giao',
  SHIPPING: 'Đang giao',
  SHIPPED: 'Đã giao',
  COMPLETED: 'Hoàn thành',
  PLANNED: 'Chờ thực hiện',
  COOKING: 'Đang nấu',
  CANCEL: 'Đã hủy',
  DONE: 'Đã nhận',
  DRAFT: 'Nháp',
  AVAILABLE: 'Khả dụng',
  OUT_OF_STOCK: 'Hết hàng',
  EXPIRED: 'Hết hạn',
  WAITING_FOR_STOCK: 'Chờ nhập kho',
  PENDING_REVIEW: 'Chờ xử lý',
  REJECTED: 'Đã từ chối',
  DAMAGED: 'Hàng hỏng',
  MISSING_ITEMS: 'Thiếu hàng',
  WRONG_ITEMS: 'Sai hàng',
  QUALITY_FAILED: 'Chất lượng kém',
  LATE_DELIVERY: 'Giao hàng trễ',
  REFUSED_DELIVERY: 'Từ chối nhận',
  CREATE_REPLACEMENT_ORDER: 'Tạo đơn mới',
  REFUND: 'Hoàn tiền',
  ACTIVE: 'Hoạt động',
  INACTIVE: 'Ngừng hoạt động',
};

export const ROLE_LABEL_MAP: Record<string, string> = {
  ADMIN: 'Quản trị viên',
  FRANCHISE_STORE_STAFF: 'Nhân viên cửa hàng',
  MANAGER: 'Quản lý',
  SUPPLY_COORDINATOR: 'Điều phối viên',
  CENTRAL_KITCHEN_STAFF: 'Bếp trung tâm',
};

export const normalizeStatusKey = (status?: string | null): string => {
  if (!status) return '';
  return status
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, '_');
};

export const translateStatus = (status?: string | null) => {
  if (!status) return '';
  const key = normalizeStatusKey(status);
  return STATUS_LABEL_MAP[key] ?? status;
};

export const translateRole = (role?: string | null) => {
  if (!role) return '';
  return ROLE_LABEL_MAP[role] ?? role;
};
