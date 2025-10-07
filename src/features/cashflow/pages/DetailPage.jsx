import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { asyncSetCashflow } from "../states/action";
import { formatDate } from "../../../helpers/toolsHelper";
import DeleteModal from "../modals/DeleteModal";

function DetailPage() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { cashflowId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cashflow = useSelector((state) => state.cashflow);

  useEffect(() => {
    if (cashflowId) {
      dispatch(asyncSetCashflow(cashflowId));
    }
  }, [cashflowId]);

  if (!cashflow) return <p className="text-center mt-5">Memuat data...</p>;

  return (
    <div className="container mt-4">
      {/* Header Detail + Tombol Hapus */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h2 className="mb-0">{cashflow.label}</h2>
        <div>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => setShowDeleteModal(true)}
          >
            <i className="bi bi-trash"></i> Hapus
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <p className="text-muted mb-1">{cashflow.description}</p>
          <hr />
          <p>
            <strong>Jenis:</strong>{" "}
            <span
              className={`badge bg-${
                cashflow.type === "inflow" ? "success" : "danger"
              }`}
            >
              {cashflow.type === "inflow" ? "Pemasukan" : "Pengeluaran"}
            </span>
          </p>
          <p>
            <strong>Sumber:</strong>
            <span className="text-capitalize"> {cashflow.source}</span>
          </p>
          <p>
            <strong>Nominal:</strong> Rp {cashflow.nominal.toLocaleString()}
          </p>
          <p>
            <strong>Dibuat pada:</strong> {formatDate(cashflow.created_at)}
          </p>

          <div className="mt-4 d-flex gap-2">
            <button
              className="btn btn-warning"
              onClick={() => navigate(`/cashflows/edit/${cashflow.id}`)}
            >
              <i className="bi bi-pencil"></i> Edit
            </button>
            <button className="btn btn-secondary" onClick={() => navigate("/")}>
              <i className="bi bi-arrow-left"></i> Kembali
            </button>
          </div>
        </div>
      </div>

      {/* Modal Hapus */}
      {showDeleteModal && (
        <DeleteModal
          cashflow={cashflow}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
}

export default DetailPage;
