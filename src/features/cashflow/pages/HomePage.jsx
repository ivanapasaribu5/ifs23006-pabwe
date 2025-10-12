import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { asyncSetCashflows, asyncGetLabels } from "../states/action";
import { formatDate } from "../../../helpers/toolsHelper";
import CashflowChart from "../components/CashflowChart";
import { useNavigate } from "react-router-dom";
import {
  PlusCircle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Sun,
  Calendar,
  Layers,
  Eye,
  Pencil,
  Tags,
  Trash2,
} from "lucide-react";
import ChangeModal from "../modals/ChangeModal";
import DeleteModal from "../modals/DeleteModal";

function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cashflows = useSelector((state) => state.cashflow.cashflows);
  const stats = useSelector((state) => state.cashflow.stats);
  const labels = useSelector((state) => state.cashflow.labels) || [];
  const [showLabelsModal, setShowLabelsModal] = useState(false);

  const [groupBy, setGroupBy] = useState("month"); // 'day' or 'month'
  const [selectedYear, setSelectedYear] = useState(() =>
    new Date().getFullYear()
  );
  const [selectedYearMonth, setSelectedYearMonth] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() }; // month: 0-11
  });

  useEffect(() => {
    dispatch(asyncSetCashflows());
  }, [dispatch]);

  // Use stats from Redux for totals
  const totalIn = stats.total_inflow || 0;
  const totalOut = stats.total_outflow || 0;
  const balance = totalIn - totalOut;

  // Helper to format number to Rupiah
  const formatRupiah = (number) =>
    `Rp ${Math.round(number).toLocaleString("id-ID")}`;

  // Aggregate for chart
  // Aggregate by year: return 12 months (Jan..Dec) for the selected year
  function aggregateByYearMonths(list, year) {
    const months = Array.from({ length: 12 }, (_, i) => ({
      inflow: 0,
      outflow: 0,
    }));

    list.forEach((c) => {
      const d = new Date(c.created_at);
      if (d.getFullYear() === year) {
        const mi = d.getMonth();
        months[mi][c.type === "inflow" ? "inflow" : "outflow"] += c.nominal;
      }
    });

    return months.map((m, i) => {
      const date = new Date(year, i, 1);
      const label = date.toLocaleString("id-ID", { month: "short" });
      return { label, inflow: m.inflow, outflow: m.outflow };
    });
  }

  // Aggregate for a full month (day 1..lastDay) - include zeros for empty days
  function aggregateByDayForMonth(list, year, monthIndex) {
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    // init map for every day
    const map = {};
    for (let d = 1; d <= daysInMonth; d++) {
      const key = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(
        d
      ).padStart(2, "0")}`;
      map[key] = { inflow: 0, outflow: 0 };
    }

    list.forEach((c) => {
      const dt = new Date(c.created_at);
      if (dt.getFullYear() === year && dt.getMonth() === monthIndex) {
        const key = dt.toISOString().slice(0, 10);
        if (!map[key]) map[key] = { inflow: 0, outflow: 0 };
        map[key][c.type === "inflow" ? "inflow" : "outflow"] += c.nominal;
      }
    });

    return Object.keys(map)
      .sort()
      .map((k) => ({
        label: String(Number(k.slice(8, 10))), // day number without leading zero
        inflow: map[k].inflow,
        outflow: map[k].outflow,
      }));
  }

  const chartData =
    groupBy === "day"
      ? aggregateByDayForMonth(
          cashflows,
          selectedYearMonth.year,
          selectedYearMonth.month
        )
      : aggregateByYearMonths(cashflows, selectedYear);

  const monthYearLabel = new Date(
    selectedYearMonth.year,
    selectedYearMonth.month,
    1
  ).toLocaleString("id-ID", { month: "long", year: "numeric" });

  const yearLabel = `${selectedYear}`;

  function prevMonth() {
    setSelectedYearMonth((s) => {
      const d = new Date(s.year, s.month - 1, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  }

  function nextMonth() {
    setSelectedYearMonth((s) => {
      const d = new Date(s.year, s.month + 1, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  }

  function prevYear() {
    setSelectedYear((y) => y - 1);
  }

  function nextYear() {
    setSelectedYear((y) => y + 1);
  }

  const handleGetLabels = () => {
    dispatch(asyncGetLabels());
    setShowLabelsModal(true);
  };

  // Filter cashflows for table based on current period to match image
  const filteredCashflows = [...cashflows].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  ); // desc by date

  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  return (
    <div className="container mt-4">
      <h4 className="mb-3">Cashflow Overview</h4>

      {/* Ringkasan menggunakan stats dari API */}
      <div className="row g-4 mb-5">
        {/* Card Total Inflow */}
        <div className="col-lg-3 col-md-6">
          <div
            className="card shadow-sm h-100"
            style={{ borderTop: "6px solid #198754", borderRadius: "1rem" }}
          >
            <div className="card-body p-4">
              <div className="d-flex align-items-center gap-3 mb-3">
                <TrendingUp className="text-success" size={24} />
                <span className="text-muted small fw-medium text-uppercase">
                  Total Pemasukan
                </span>
              </div>
              <p className="h3 fw-bolder text-success">
                {formatRupiah(totalIn)}
              </p>
            </div>
          </div>
        </div>

        {/* Card Total Outflow */}
        <div className="col-lg-3 col-md-6">
          <div
            className="card shadow-sm h-100"
            style={{ borderTop: "6px solid #dc3545", borderRadius: "1rem" }}
          >
            <div className="card-body p-4">
              <div className="d-flex align-items-center gap-3 mb-3">
                <TrendingDown className="text-danger" size={24} />
                <span className="text-muted small fw-medium text-uppercase">
                  Total Pengeluaran
                </span>
              </div>
              <p className="h3 fw-bolder text-danger">
                {formatRupiah(totalOut)}
              </p>
            </div>
          </div>
        </div>

        {/* Card Saldo Akhir */}
        <div className="col-lg-6">
          <div
            className="card shadow-sm h-100"
            style={{ borderTop: "6px solid #0d6efd", borderRadius: "1rem" }}
          >
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="d-flex align-items-center gap-3">
                  <DollarSign className="text-primary" size={24} />
                  <span className="text-muted small fw-medium text-uppercase">
                    Saldo Akhir
                  </span>
                </div>
              </div>
              <p
                className={`h2 fw-bolder ${
                  balance >= 0 ? "text-success" : "text-danger"
                }`}
              >
                {formatRupiah(balance)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div
        className="card shadow-sm border-light mb-5"
        style={{ borderRadius: "1rem" }}
      >
        <div className="card-header d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div>
            <button
              className={`btn btn-sm ${
                groupBy === "day" ? "btn-primary" : "btn-outline-primary"
              } me-2`}
              onClick={() => setGroupBy("day")}
            >
              Per Hari
            </button>
            <button
              className={`btn btn-sm ${
                groupBy === "month" ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => setGroupBy("month")}
            >
              Per Bulan
            </button>
          </div>
          <div className="d-flex align-items-center gap-2">
            {groupBy === "day" ? (
              <>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={prevMonth}
                >
                  &lt;
                </button>
                <strong className="text-nowrap">{monthYearLabel}</strong>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={nextMonth}
                >
                  &gt;
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={prevYear}
                >
                  &lt;
                </button>
                <strong>{yearLabel}</strong>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={nextYear}
                >
                  &gt;
                </button>
              </>
            )}
          </div>
        </div>
        <div className="card-body">
          <div style={{ height: "300px" }}>
            <CashflowChart data={chartData} />
          </div>
        </div>
      </div>

      {/* Navigation Buttons for Features */}
      <div className="mb-5 d-flex flex-wrap justify-content-center gap-4">
        <button
          onClick={() => navigate("/status-daily", { state: { month: selectedYearMonth } })}
          className="btn btn-danger btn-lg d-flex align-items-center gap-2 shadow-sm fw-medium"
          style={{ borderRadius: "0.75rem" }}
        >
          <Sun size={20} />
          Lihat Statistik Harian
        </button>
        <button
          onClick={() => navigate("/status-monthly")}
          className="btn btn-danger btn-lg d-flex align-items-center gap-2 shadow-sm fw-medium"
          style={{ borderRadius: "0.75rem" }}
        >
          <Calendar size={20} />
          Lihat Statistik Bulanan
        </button>
        <button
          onClick={handleGetLabels}
          className="btn btn-danger btn-lg d-flex align-items-center gap-2 shadow-sm fw-medium"
          style={{ borderRadius: "0.75rem" }}
        >
          <Tags size={20} />
          Lihat Label Anda
        </button>
      </div>

      {/* Daftar Cashflow */}
      <div
        className="card shadow-sm border-light"
        style={{ borderRadius: "1rem" }}
      >
        <div className="card-header d-flex justify-content-between align-items-center">
          <h2 className="h5 fw-bold text-dark d-flex align-items-center gap-2">
            <Layers className="text-danger" size={24} />
            Riwayat Transaksi
          </h2>
          <button
            className="btn btn-primary d-flex align-items-center gap-2 fw-bold shadow-sm"
            onClick={() => navigate("/cashflows/add")}
          >
            <PlusCircle size={20} />
            Tambah Transaksi
          </button>
        </div>

        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead style={{ backgroundColor: "#ffebee" }}>
              <tr>
                <th className="px-4 py-3 text-start small fw-bold text-danger d-none d-lg-table-cell">
                  Tanggal
                </th>
                <th className="px-4 py-3 text-start small fw-bold text-danger">
                  Label
                </th>
                <th className="px-4 py-3 text-start small fw-bold text-danger d-none d-md-table-cell">
                  Jenis
                </th>
                <th className="px-4 py-3 text-start small fw-bold text-danger d-none d-md-table-cell">
                  Sumber
                </th>
                <th className="px-4 py-3 text-start small fw-bold text-danger">
                  Nominal
                </th>
                <th className="px-4 py-3 text-start small fw-bold text-danger d-none d-md-table-cell">
                  Deskripsi
                </th>
                <th className="px-4 py-3 text-center small fw-bold text-danger">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCashflows.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-3">
                    Belum ada data cashflow untuk periode ini.
                  </td>
                </tr>
              ) : (
                filteredCashflows.map((c) => (
                  <tr key={c.id} className="align-middle">
                    <td className="d-none d-lg-table-cell text-muted small">
                      {formatDate(c.created_at)}
                    </td>
                    <td>{c.label}</td>
                    <td className="d-none d-md-table-cell">
                      <span
                        className={`badge rounded-pill text-bg-${
                          c.type === "inflow" ? "success" : "danger"
                        }`}
                      >
                        {c.type}
                      </span>
                    </td>
                    <td className="text-capitalize d-none d-md-table-cell">
                      {c.source}
                    </td>
                    <td
                      className={`fw-bold ${
                        c.type === "inflow" ? "text-success" : "text-danger"
                      }`}
                    >
                      {formatRupiah(c.nominal)}
                    </td>
                    <td
                      className="d-none d-md-table-cell text-muted small"
                      style={{
                        maxWidth: "200px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {c.description || "-"}
                    </td>
                    <td className="text-center">
                      <div
                        className="btn-group"
                        role="group"
                        aria-label="Transaction Actions"
                      >
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => navigate(`/cashflows/${c.id}`)}
                          title="Lihat Detail"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-warning"
                          onClick={() => setEditing(c)}
                          title="Ubah"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => setDeleting(c)}
                          title="Hapus"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {editing && (
        <ChangeModal cashflow={editing} onClose={() => setEditing(null)} />
      )}
      {deleting && (
        <DeleteModal cashflow={deleting} onClose={() => setDeleting(null)} />
      )}

      {showLabelsModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Label Transaksi Anda</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowLabelsModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {labels.length > 0 ? (
                  <ul className="list-group">
                    {labels.map((label) => (
                      <li key={label} className="list-group-item">
                        {label}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Memuat label...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
