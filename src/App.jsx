import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import CashFlowLayout from "./features/cashflow/layouts/CashFlowLayout";

const LoginPage = lazy(() => import("./features/auth/pages/LoginPage"));
const AuthLayout = lazy(() => import("./features/auth/layouts/AuthLayout"));
const RegisterPage = lazy(() => import("./features/auth/pages/RegisterPage"));
const HomePage = lazy(() => import("./features/cashflow/pages/HomePage"));
const DetailPage = lazy(() => import("./features/cashflow/pages/DetailPage"));
const AddPage = lazy(() => import("./features/cashflow/pages/AddPage"));
const ProfilePage = lazy(() => import("./features/users/pages/ProfilePage"));
const SettingsPage = lazy(() => import("./features/users/pages/SettingsPage"));
const CashFlowLayoutLazy = lazy(() =>
  import("./features/cashflow/layouts/CashFlowLayout")
);

function App() {
  return (
    <Suspense
      fallback={
        <div className="mt-5 text-center">
          <div className="mb-3">
            <img
              src="/logo.png"
              alt="logo"
              style={{ width: "126px", height: "126px" }}
            />
          </div>
          <div
            className="spinner-border text-primary"
            style={{ width: "48px", height: "48px" }}
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      }
    >
      <Routes>
        {/* Auth */}
        <Route path="auth" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        {/* Cashflow */}
        <Route path="/" element={<CashFlowLayoutLazy />}>
          <Route index element={<HomePage />} />
          <Route path="cashflows/add" element={<AddPage />} />
          <Route path="cashflows/:cashflowId" element={<DetailPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
