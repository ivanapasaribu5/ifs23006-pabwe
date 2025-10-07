import { useDispatch, useSelector } from "react-redux";
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
    <form onSubmit={onSubmitHandler} method="POST">
      <div className="mb-3">
        <label className="form-label">Nama Lengkap</label>
        <input
          type="text"
          onChange={onChangeName}
          className="form-control"
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Alamat Email</label>
        <input
          type="email"
          onChange={onChangeEmail}
          className="form-control"
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Kata Sandi</label>
        <input
          type="password"
          onChange={onChangePassword}
          className="form-control"
          required
        />
      </div>
      <div className="mb-3 pt-3 text-end">
        {loading ? (
          <button className="btn btn-primary" disabled>
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
            &nbsp;Memuat...
          </button>
        ) : (
          <button type="submit" className="btn btn-primary">
            Daftar
          </button>
        )}
      </div>
    </form>
  );
}

export default RegisterPage;