import LoginPage from './pages/auth/LoginPage.tsx';
import { BrowserRouter, Route, Routes } from 'react-router';
import ProtectedRoute from './routes/ProtectedRoute.tsx';
import RoleRoute from './routes/RoleRoute.tsx';
import BranchManagementPage from './pages/admin/BranchManagementPage.tsx';
import DashboardFranchiseStore from './pages/franchise-store/DashboardFranchiseStore.tsx';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />}></Route>

          <Route element={<ProtectedRoute />}>
            <Route
              path="/"
              element={<RoleRoute admin={<BranchManagementPage />} store={<DashboardFranchiseStore />} />}
            ></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
