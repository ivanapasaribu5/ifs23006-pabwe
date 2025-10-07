import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { asyncSetCashflows } from "../states/action";
import { formatDate } from "../../../helpers/toolsHelper";
import { useNavigate } from "react-router-dom";
import CashflowChart from "../components/CashflowChart";
import ChangeModal from "../modals/ChangeModal";
import DeleteModal from "../modals/DeleteModal";

function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cashflows = useSelector((state) => state.cashflows);

  const [filter, setFilter] = useState("");
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
  }, []);

  const inflows = cashflows.filter((c) => c.type === "inflow");
  const outflows = cashflows.filter((c) => c.type === "outflow");

  const totalIn = inflows.reduce((acc, c) => acc + c.nominal, 0);
  const totalOut = outflows.reduce((acc, c) => acc + c.nominal, 0);
  const balance = totalIn - totalOut;

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

  function aggregateByDay(list) {
    const map = {};
    list.forEach((c) => {
      const d = new Date(c.created_at);
      const key = d.toISOString().slice(0, 10); // YYYY-MM-DD
      if (!map[key]) map[key] = { inflow: 0, outflow: 0 };
      map[key][c.type === "inflow" ? "inflow" : "outflow"] += c.nominal;
    });
    return Object.keys(map)
      .sort()
      .map((k) => ({
        label: k,
        inflow: map[k].inflow,
        outflow: map[k].outflow,
      }));
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

  // weekly aggregation removed as requested

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

  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  return (
    <div className="container mt-4">
      <h4 className="mb-3">Cashflow Overview</h4>

      {/* Ringkasan */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h5>Total Inflow</h5>
              <h3>Rp {totalIn.toLocaleString()}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-danger text-white">
            <div className="card-body">
              <h5>Total Outflow</h5>
              <h3>Rp {totalOut.toLocaleString()}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h5>Saldo Akhir</h5>
              <h3>Rp {balance.toLocaleString()}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Daftar Cashflow */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
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
          <div>
            <small className="text-muted">Daftar Cashflow</small>
          </div>
        </div>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-2">
            {groupBy === "day" ? (
              <div className="d-flex align-items-center gap-2">
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={prevMonth}
                >
                  &lt;
                </button>
                <strong>{monthYearLabel}</strong>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={nextMonth}
                >
                  &gt;
                </button>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
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
              </div>
            )}
          </div>
          <CashflowChart data={chartData} />
        </div>
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">&nbsp;</h5>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/cashflows/add")}
          >
            <i className="bi bi-plus"></i> Tambah
          </button>
        </div>

        <div className="card-body p-0">
          <table className="table table-striped table-bordered mb-0">
            <thead className="table-light">
              <tr>
                <th>Tanggal</th>
                <th>Label</th>
                <th>Jenis</th>
                <th>Sumber</th>
                <th>Nominal</th>
                <th>Deskripsi</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {cashflows.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-3">
                    Belum ada data cashflow
                  </td>
                </tr>
              ) : (
                cashflows.map((c) => (
                  <tr key={c.id}>
                    <td>{formatDate(c.created_at)}</td>
                    <td>{c.label}</td>
                    <td>
                      <span
                        className={`badge bg-${
                          c.type === "inflow" ? "success" : "danger"
                        }`}
                      >
                        {c.type}
                      </span>
                    </td>
                    <td className="text-capitalize">{c.source}</td>
                    <td>Rp {c.nominal.toLocaleString()}</td>
                    <td>{c.description}</td>
                    <td>
                      <div className="btn-group" role="group">
                        <button
                          className="btn btn-sm btn-info"
                          onClick={() => navigate(`/cashflows/${c.id}`)}
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => setEditing(c)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => setDeleting(c)}
                        >
                          <i className="bi bi-trash"></i>
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
    </div>
  );
}

export default HomePage;
