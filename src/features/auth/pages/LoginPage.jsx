import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import useInput from "../../../hooks/useInput";
import {
  asyncSetIsAuthLogin,
  setIsAuthLoginActionCreator,
} from "../states/action";
import { useEffect, useState } from "react";
import apiHelper from "../../../helpers/apiHelper";
import { asyncSetProfile, setIsProfile } from "../../users/states/action";

function LoginPage() {
  const dispatch = useDispatch();

  const isAuthLogin = useSelector((state) => state.isAuthLogin);
  const isProfile = useSelector((state) => state.isProfile);

  const [loading, setLoading] = useState(false);
  const [email, onEmailChange] = useInput("");
  const [password, onPasswordChange] = useInput("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // 1. Periksa apakah login berhasil
  useEffect(() => {
    if (isAuthLogin === true) {
      const authToken = apiHelper.getAccessToken();
      if (authToken) {
        dispatch(asyncSetProfile());
      } else {
        setLoading(false);
        dispatch(setIsAuthLoginActionCreator(false));
      }
    }
  }, [isAuthLogin]);

  // 2. Jika gagal login set loading dan status isAuthLogin ke false
  useEffect(() => {
    if (isProfile) {
      setLoading(false);
      dispatch(setIsAuthLoginActionCreator(false));
      dispatch(setIsProfile(false));
    }
  }, [isProfile]);

  // Fungsi untuk menangani pengiriman form. Akan memicu efek pada step-1
  async function onSubmitHandler(event) {
    event.preventDefault();
    setLoading(true);
    dispatch(asyncSetIsAuthLogin(email, password));
  }

  return (
    <div className="login-content">
      <div className="auth-header">
        <h2 className="title">Cash Flow Manager</h2>
        <p className="subtitle">Kelola Keuangan Pribadi Anda</p>
      </div>
      <hr className="divider" />
      <form onSubmit={onSubmitHandler} method="POST" className="custom-form">
        <label className="custom-label">Alamat Email</label>
        <input
          type="email"
          onChange={onEmailChange}
          className="custom-input"
          required
        />
        <label className="custom-label">Kata Sandi</label>
        <div className="password-input-container">
          <input
            type={showPassword ? "text" : "password"}
            onChange={onPasswordChange}
            className="custom-input"
            required
          />
          <button
            type="button"
            className="password-toggle"
            onClick={togglePasswordVisibility}
          >
            <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
          </button>
        </div>
        <div className="button-container">
          {loading ? (
            <button className="login-btn" disabled>
              <span className="spinner"></span>
              Memuat...
            </button>
          ) : (
            <button type="submit" className="login-btn">
              Masuk
            </button>
          )}
        </div>
        <p className="signup-link">
          Belum punya akun? <NavLink to="/auth/register" className="link-text">Daftar Sekarang</NavLink>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
