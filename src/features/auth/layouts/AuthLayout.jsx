import { useDispatch, useSelector } from "react-redux";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import apiHelper from "../../../helpers/apiHelper";
import { asyncSetProfile, setIsProfile } from "../../users/states/action";
import { useEffect } from "react";
import "../resources/auth.css";

function AuthLayout() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const profile = useSelector((state) => state.profile);
  const isProfile = useSelector((state) => state.isProfile);

  // 1. Jalankan sekali untuk mengecek apakah pengguna sudah login
  useEffect(() => {
    const authToken = apiHelper.getAccessToken();
    if (authToken) {
      dispatch(asyncSetProfile());
    }
  }, []);

  // 2. Jika pengguna sudah login, arahkan ke halaman utama
  useEffect(() => {
    if (isProfile) {
      dispatch(setIsProfile(false));
      if (profile) {
        navigate("/");
      }
    }
  }, [isProfile]);

  return (
    <div className="auth-container">
      <div className="login-card">
        <div className="login-header text-center pb-3">
          <img
            src="/logo.png"
            alt="Logo"
            style={{ width: "64px", height: "64px", marginBottom: "1rem" }}
          />
        </div>
        <div className="login-body p-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
