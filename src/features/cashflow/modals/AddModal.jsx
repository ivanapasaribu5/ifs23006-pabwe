import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { asyncSetIsCashflowAdd, asyncSetCashflows } from "../states/action";
import { showErrorDialog } from "../../../helpers/toolsHelper";

function AddModal({ onClose }) {
  const dispatch = useDispatch();
  const [type, setType] = useState("inflow");
  const [source, setSource] = useState("cash");
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const [nominal, setNominal] = useState("");
  const [created_at, setCreatedAt] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const isAdded = useSelector((state) => state.cashflow.isCashflowAdded);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!label || !label.trim()) {
      showErrorDialog("Label harus diisi.");
      return;
    }

    const numNominal = Number(nominal);
    if (!nominal || Number.isNaN(numNominal) || numNominal <= 0) {
      showErrorDialog("Nominal harus berupa angka lebih dari 0.");
      return;
    }

    const allowedSources = ["cash", "loans", "savings"];
    if (!allowedSources.includes(source)) {
      showErrorDialog("Sumber dana tidak valid.");
      return;
    }

    console.debug("Posting cashflow payload:", {
      type,
      source,
      label,
      description,
      nominal: numNominal,
      created_at,
    });

    await dispatch(
      asyncSetIsCashflowAdd(type, source, label, description, numNominal, created_at)
    );
    await dispatch(asyncSetCashflows());
    onClose();
  };

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Tambah Cashflow</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Label</label>
                <input
                  type="text"
                  className="form-control"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Deskripsi</label>
                <textarea
                  className="form-control"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>

              <div className="mb-3">
                <label className="form-label">Tanggal</label>
                <input
                  type="date"
                  className="form-control"
                  value={created_at}
                  onChange={(e) => setCreatedAt(e.target.value)}
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
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-primary">
                Simpan
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddModal;
