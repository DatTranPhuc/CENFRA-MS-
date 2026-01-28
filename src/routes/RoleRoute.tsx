import React from 'react';
type Props = {
  admin: React.ReactNode;
  franchise: React.ReactNode;
  manager: React.ReactNode;
};

const RoleRoute = ({ admin, franchise, manager }: Props) => {
  const role = localStorage.getItem('role');

  if (role === 'ADMIN') return admin;
  if (role === 'FRANCHISE') return franchise;
  if (role === 'MANAGER') return manager;
  return <div>Không có quyền truy cập</div>;
};

export default RoleRoute;
