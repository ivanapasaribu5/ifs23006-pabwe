import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Calendar } from "lucide-react";
import { asyncAddCashflow } from "../states/action";
import { showErrorDialog } from "../../../helpers/toolsHelper";

function AddPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const [nominal, setNominal] = useState("");
  const [type, setType] = useState("outflow"); // Default to outflow
  const [source, setSource] = useState("cash"); // Default to cash
  const [createdAt, setCreatedAt] = useState(() =>
    new Date().toISOString().slice(0, 10)
  ); // Default to today

  const labels = [
    "Gaji Pokok",
    "Penghasilan Sampingan",
    "Investasi",
    "Hadiah",
    "Makanan & Minuman",
    "Kebutuhan Pokok",
    "Cicilan Kendaraan",
    "Tagihan Bulanan",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!label.trim() || !nominal) {
      showErrorDialog("Label dan Nominal wajib diisi");
      return;
    }

    const numNominal = Number(nominal);
    if (Number.isNaN(numNominal) || numNominal <= 0) {
      showErrorDialog("Nominal harus berupa angka positif.");
      return;
    }

    await dispatch(
      asyncAddCashflow({
        type,
        source,
        label,
        description,
        nominal: numNominal,
        created_at: createdAt,
      })
    );

    // Kembali ke halaman utama setelah berhasil
    navigate("/");
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-header">
              <h4 className="mb-0">Tambah Transaksi Baru</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Label / Kategori</label>
                  <select
                    className="form-select"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Pilih Kategori...
                    </option>
                    {labels.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Deskripsi</label>
                  <textarea
                    className="form-control"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="createdAt" className="form-label">
                    Tanggal Transaksi
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <Calendar size={18} />
                    </span>
                    <input
                      id="createdAt"
                      type="date"
                      className="form-control"
                      value={createdAt}
                      onChange={(e) => setCreatedAt(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Nominal (Rp)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={nominal}
                    onChange={(e) => setNominal(e.target.value)}
                    required
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Jenis Transaksi</label>
                    <select
                      className="form-select"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                    >
                      <option value="outflow">Pengeluaran</option>
                      <option value="inflow">Pemasukan</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Sumber Dana</label>
                    <select
                      className="form-select"
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                    >
                      <option value="cash">Cash</option>
                      <option value="savings">Savings</option>
                      <option value="loans">Loans</option>
                    </select>
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/")}
                  >
                    Batal
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddPage;
