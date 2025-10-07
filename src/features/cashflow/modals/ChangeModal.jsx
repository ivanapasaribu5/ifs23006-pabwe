import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { asyncSetIsCashflowChange, asyncSetCashflows } from "../states/action";

function ChangeModal({ cashflow, onClose }) {
  const dispatch = useDispatch();

  // Normalisasi sumber dana untuk data yang sudah ada
  const normalizeSource = (src) => {
    const map = { transfer: "transfer", cash: "cash", savings: "savings" };
    return map[src] || "cash";
  };

  const [type, setType] = useState(cashflow.type);
  const [source, setSource] = useState(normalizeSource(cashflow.source));
  const [label, setLabel] = useState(cashflow.label);
  const [description, setDescription] = useState(cashflow.description);
  const [nominal, setNominal] = useState(cashflow.nominal);

  const handleSubmit = async (e) => {
  e.preventDefault();

  // 🧠 Normalisasi sumber dana agar sesuai dengan enum backend
  const sourceMap = {
    transfer: "transfer",
    savings: "savings",
    cash: "cash",
  };
  const normalizedSource = sourceMap[source] || "cash";

  // Pastikan urutan argumen sesuai fungsi asyncSetIsCashflowChange
  await dispatch(
    asyncSetIsCashflowChange(
      cashflow.id,
      type,
      normalizedSource,
      label,
      description,
      Number(nominal)
    )
  );

  // Refresh daftar
  await dispatch(asyncSetCashflows());
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
                  <option value="transfer">Transfer</option>
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
              <button type="submit" className="btn btn-warning">
                Simpan Perubahan
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

export default ChangeModal;
