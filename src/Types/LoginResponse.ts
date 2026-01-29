import type { Location } from './Location';
import type { Role } from './Role';
import type { User } from './User';

export type LoginResponse = {
  user: User;
  role: Role;
  token: string;
};

// danh sách các response trả về khi login
// Record<key, value> : key: email, value: { user: User, password: string }
const mockLoginResponse: Record<string, { user: User; password: string }> = {
  'admin@example.com': {
    user: {
      userId: '1',
      userFullName: 'Admin User',
      userRoleId: { roleID: '1', roleName: 'ADMIN' } as Role,
      userLocationID: { locationID: '1', locationName: 'Head Office' } as Location,
      userEmail: 'admin@example.com',
      createdAt: new Date(),
      isActive: true,
    },
    password: 'admin123',
  },
  'user@example.com': {
    user: {
      userId: '2',
      userFullName: 'Regular User',
      userRoleId: { roleID: '2', roleName: 'USER' } as Role,
      userLocationID: { locationID: '2', locationName: 'Branch Office' } as Location,
      userEmail: 'user@example.com',
      createdAt: new Date(),
      isActive: true,
    },
    password: 'user123',
  },
  'manager@example.com': {
    user: {
      userId: '3',
      userFullName: 'Manager User',
      userRoleId: { roleID: '3', roleName: 'MANAGER' } as Role,
      userLocationID: { locationID: '3', locationName: 'Regional Office' } as Location,
      userEmail: 'manager@example.com',
      createdAt: new Date(),
      isActive: true,
    },
    password: 'manager123',
  },
  'supplier@example.com': {
    user: {
      userId: '4',
      userFullName: 'Supplier User',
      userRoleId: { roleID: '4', roleName: 'SUPPLIER' } as Role,
      userLocationID: { locationID: '4', locationName: 'Supplier Office' } as Location,
      userEmail: 'supplier@example.com',
      createdAt: new Date(),
      isActive: true,
    },
    password: 'supplier123',
  },
};
export default mockLoginResponse;
