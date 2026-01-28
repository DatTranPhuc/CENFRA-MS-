import LoginPage from './pages/auth/LoginPage.tsx';
import { BrowserRouter, Route, Routes } from 'react-router';
import ProtectedRoute from './routes/ProtectedRoute.tsx';
import RoleRoute from './routes/RoleRoute.tsx';
import BranchManagementPage from './pages/admin/BranchManagementPage.tsx';
import ManagerDashboard from './pages/manager/ManagerDashboard.tsx';
import FranchiseStoreDashboard from './pages/franchise-store/FranchiseStoreDashboard.tsx';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />}></Route>

          <Route element={<ProtectedRoute />}>
            {/* Kiểm tra role và trả về trang tương ứng với role */}
            <Route
              path="/"
              element={
                <RoleRoute
                  admin={<BranchManagementPage />}
                  franchise={<FranchiseStoreDashboard />}
                  manager={<ManagerDashboard />}
                />
              }
            ></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
