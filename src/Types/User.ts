import type { Location } from './Location';
import type { Role } from './Role';

export interface User {
  userId: string;
  userFullName: string;
  userRoleId: Role;
  userLocationID: Location;
  userEmail: string;
  createdAt: Date;
  isActive: boolean;
}
