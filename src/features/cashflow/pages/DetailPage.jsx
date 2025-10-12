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
  const cashflow = useSelector((state) => state.cashflow.cashflow);

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
          <dl className="row">
            <dt className="col-sm-3">ID</dt>
            <dd className="col-sm-9">{cashflow.id}</dd>

            <dt className="col-sm-3">Jenis</dt>
            <dd className="col-sm-9">
              <span
                className={`badge bg-${
                  cashflow.type === "inflow" ? "success" : "danger"
                }`}
              >
                {cashflow.type === "inflow" ? "Pemasukan" : "Pengeluaran"}
              </span>
            </dd>

            <dt className="col-sm-3">Sumber</dt>
            <dd className="col-sm-9 text-capitalize">{cashflow.source}</dd>

            <dt className="col-sm-3">Deskripsi</dt>
            <dd className="col-sm-9">{cashflow.description}</dd>

            <dt className="col-sm-3">Nominal</dt>
            <dd className="col-sm-9">Rp {cashflow.nominal.toLocaleString()}</dd>

            <dt className="col-sm-3">Dibuat pada</dt>
            <dd className="col-sm-9">{formatDate(cashflow.created_at)}</dd>
          </dl>

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
