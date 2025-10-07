import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  asyncSetProfile,
  asyncPutProfile,
  asyncPostProfilePhoto,
} from "../states/action";
import {
  showSuccessDialog,
  showErrorDialog,
} from "../../../helpers/toolsHelper";

function ProfilePage() {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoFile, setPhotoFile] = useState(null);

  useEffect(() => {
    dispatch(asyncSetProfile());
  }, []);

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setEmail(profile.email || "");
    }
  }, [profile]);

  async function handleSave(e) {
    e.preventDefault();
    setProcessing(true);
    try {
      const okProfile = await dispatch(asyncPutProfile(name, email));
      let okPhoto = true;
      if (photoFile) {
        okPhoto = await dispatch(asyncPostProfilePhoto(photoFile));
      }

      // re-fetch
      await dispatch(asyncSetProfile());

      if (okProfile && okPhoto) {
        showSuccessDialog("Profil berhasil diperbarui");
      } else {
        showErrorDialog("Beberapa perubahan gagal disimpan");
      }
    } catch (err) {
      showErrorDialog(err.message || "Gagal menyimpan profil");
    } finally {
      setProcessing(false);
    }
  }

  const [processing, setProcessing] = useState(false);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h4>Profile</h4>
      </div>
      <form onSubmit={handleSave} className="mt-3">
        <div className="mb-3">
          <label className="form-label">Nama</label>
          <input
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Foto Profil</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => setPhotoFile(e.target.files[0])}
          />
          <div className="form-text">
            Foto akan terlihat di navbar setelah menyimpan dan memuat ulang
            profil.
          </div>
        </div>
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/")}
          >
            Kembali ke Dashboard
          </button>
          <button
            className="btn btn-primary ms-auto"
            type="submit"
            disabled={processing}
          >
            {processing ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProfilePage;
