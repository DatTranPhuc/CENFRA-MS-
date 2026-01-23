import React from 'react';
type Props = {
  admin: React.ReactNode;
  store: React.ReactNode;
};

const RoleRoute = ({ admin, store }: Props) => {
  const role = localStorage.getItem('role');

  if (role === 'ADMIN') return admin;
  if (role === 'STORE') return store;

  return <div>Không có quyền truy cập</div>;
};

export default RoleRoute;
