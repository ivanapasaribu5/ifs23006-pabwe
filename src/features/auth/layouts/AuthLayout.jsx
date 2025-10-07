import { useDispatch, useSelector } from "react-redux";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import apiHelper from "../../../helpers/apiHelper";
import { asyncSetProfile, setIsProfile } from "../../users/states/action";
import { useEffect } from "react";

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
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-lg-5 col-md-6 col-sm-8">
          <div className="card mt-5">
            <div className="card-header text-center pb-0">
              <img
                src="/logo.png"
                alt="Logo"
                style={{ width: "64px", height: "64px" }}
              />
              <ul className="nav nav-tabs mt-2">
                <li className="nav-item">
                  <NavLink
                    to="/auth/login"
                    className={`nav-link ${
                      location.pathname === "/auth/login" ? "active" : ""
                    }`}
                    aria-current="page"
                  >
                    Masuk
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/auth/register"
                    className={`nav-link ${
                      location.pathname === "/auth/register" ? "active" : ""
                    }`}
                  >
                    Daftar
                  </NavLink>
                </li>
              </ul>
            </div>
            <div className="card-body">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;