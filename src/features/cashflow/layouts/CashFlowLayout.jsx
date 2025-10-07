import { useDispatch, useSelector } from "react-redux";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import apiHelper from "../../../helpers/apiHelper";
import { asyncSetProfile, setIsProfile } from "../../users/states/action";
import { useEffect } from "react";
import NavbarComponent from "../components/NavbarComponent";

function CashFlowLayout() {
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
    } else {
      navigate("/auth/login");
    }
  }, []);

  // 2. Jika pengguna sudah login, arahkan ke halaman utama
  useEffect(() => {
    if (isProfile) {
      dispatch(setIsProfile(false));

      if (!profile) {
        apiHelper.putAccessToken("");
        navigate("/auth/login");
      }
    }
  }, [isProfile]);

  // Fungsi logout
  function handleLogout() {
    apiHelper.putAccessToken("");
    navigate("/auth/login");
  }

  if (!profile) return null;

  return (
    <div className="container-fluid">
      <NavbarComponent profile={profile} handleLogout={handleLogout} />

      <Outlet />
    </div>
  );
}

export default CashFlowLayout;
