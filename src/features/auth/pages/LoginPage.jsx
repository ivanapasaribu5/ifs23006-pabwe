import { useDispatch, useSelector } from "react-redux";
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
    <form onSubmit={onSubmitHandler} method="POST">
      <div className="mb-3">
        <label className="form-label">Alamat Email</label>
        <input
          type="email"
          onChange={onEmailChange}
          className="form-control"
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Kata Sandi</label>
        <input
          type="password"
          onChange={onPasswordChange}
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
            Masuk
          </button>
        )}
      </div>
    </form>
  );
}

export default LoginPage;