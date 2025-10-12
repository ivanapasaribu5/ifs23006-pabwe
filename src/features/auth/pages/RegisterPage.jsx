import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import useInput from "../../../hooks/useInput";
import {
  asyncSetIsAuthRegister,
  setIsAuthRegisterActionCreator,
} from "../states/action";
import { useEffect, useState } from "react";

function RegisterPage() {
  const dispatch = useDispatch();

  const isAuthRegister = useSelector((state) => state.isAuthRegister);

  const [loading, setLoading] = useState(false);

  const [name, onChangeName] = useInput("");
  const [email, onChangeEmail] = useInput("");
  const [password, onChangePassword] = useInput("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // 1. Periksa apakah register telah selesai diproses
  useEffect(() => {
    if (isAuthRegister === true) {
      setLoading(false);
      dispatch(setIsAuthRegisterActionCreator(false));
    }
  }, [isAuthRegister]);

  // Fungsi untuk menangani pengiriman form. Akan memicu efek pada step-1
  async function onSubmitHandler(event) {
    event.preventDefault();
    setLoading(true);
    dispatch(asyncSetIsAuthRegister(name, email, password));
  }

  return (
    <div className="register-content">
      <div className="auth-header">
        <h2 className="title">Cash Flow Manager</h2>
        <p className="subtitle">Kelola Keuangan Pribadi Anda</p>
      </div>
      <hr className="divider" />
      <form onSubmit={onSubmitHandler} method="POST" className="custom-form">
        <div className="mb-3">
          <label className="custom-label">Nama Lengkap</label>
          <input
            type="text"
            onChange={onChangeName}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="custom-label">Alamat Email</label>
          <input
            type="email"
            onChange={onChangeEmail}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="custom-label">Kata Sandi</label>
          <div className="password-input-container">
            <input
              type={showPassword ? "text" : "password"}
              onChange={onChangePassword}
              className="form-control"
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
        </div>
        <div className="mb-3 pt-3">
          {loading ? (
            <button className="btn btn-primary w-100" disabled>
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
              &nbsp;Memuat...
            </button>
          ) : (
            <button type="submit" className="btn btn-primary w-100">
              Daftar
            </button>
          )}
        </div>
        <p className="signup-link">
          Sudah punya akun? <NavLink to="/auth/login" className="link-text">Silahkan Masuk</NavLink>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;