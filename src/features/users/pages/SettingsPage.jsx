import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { asyncPutProfilePassword } from "../states/action";

function SettingsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  async function handleChangePassword(e) {
    e.preventDefault();
    await dispatch(asyncPutProfilePassword(oldPassword, newPassword));
    setOldPassword("");
    setNewPassword("");
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h4>Settings</h4>
      </div>
      <form onSubmit={handleChangePassword} className="mt-3">
        <div className="mb-3">
          <label className="form-label">Password Lama</label>
          <input
            type="password"
            className="form-control"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password Baru</label>
          <input
            type="password"
            className="form-control"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/")}
          >
            Kembali ke Dashboard
          </button>
          <button className="btn btn-primary ms-auto" type="submit">
            Ubah Password
          </button>
        </div>
      </form>
    </div>
  );
}

export default SettingsPage;
