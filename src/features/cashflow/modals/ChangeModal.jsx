import { useState } from "react";
import { useDispatch } from "react-redux";
import { asyncUpdateCashflow } from "../states/action";
import { showErrorDialog } from "../../../helpers/toolsHelper";

function ChangeModal({ cashflow, onClose }) {
  const dispatch = useDispatch();

  // Inisialisasi state langsung dari props
  const [label, setLabel] = useState(cashflow.label || "");
  const [description, setDescription] = useState(cashflow.description || "");
  const [nominal, setNominal] = useState(cashflow.nominal || "");
  const [type, setType] = useState(cashflow.type || "inflow");
  // Pastikan source selalu lowercase untuk konsistensi
  const [source, setSource] = useState(
    (cashflow.source || "cash").toLowerCase()
  );

  const labels = [
    "Gaji Pokok",
    "Penghasilan Sampingan",
    "Investasi",
    "Hadiah",
    "Makanan & Minuman",
    "Sewa Rumah",
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

    // Tidak perlu mapping di sini, karena sudah ditangani di cashflowApi.js
    // Cukup kirim nilai state (lowercase)
    await dispatch(
      asyncUpdateCashflow({
        cashflowId: cashflow.id,
        type,
        source,
        label,
        description,
        nominal: numNominal,
      })
    );

    onClose();
  };

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Ubah Cashflow</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Label</label>
                <select
                  name="label"
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
                <label className="form-label">Nominal (Rp)</label>
                <input
                  type="number"
                  className="form-control"
                  value={nominal}
                  onChange={(e) => setNominal(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Jenis Transaksi</label>
                <select
                  className="form-select"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="inflow">Pemasukan</option>
                  <option value="outflow">Pengeluaran</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Sumber Dana</label>
                <select
                  className="form-select"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                >
                  <option value="cash">Cash</option>
                  <option value="loans">Loans</option>
                  <option value="savings">Savings</option>
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Batal
              </button>
              <button type="submit" className="btn btn-warning">
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChangeModal;
