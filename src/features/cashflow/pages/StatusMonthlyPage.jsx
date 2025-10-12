import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { asyncSetCashflows } from "../states/action";
import { useNavigate } from "react-router-dom";
import CashflowChart from "../components/CashflowChart";
import {
  Home,
  ChevronsUp,
  ChevronsDown,
  Zap,
  TrendingUp,
  TrendingDown,
  DollarSign,
} from "lucide-react";

function StatusMonthlyPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cashflows = useSelector((state) => state.cashflow.cashflows);

  useEffect(() => {
    dispatch(asyncSetCashflows());
  }, [dispatch]);

  if (cashflows.length === 0) {
    return <div className="container mt-4">Memuat data status bulanan...</div>;
  }

  // Calculate monthly inflow, outflow, net for the current year (Jan-Dec)
  const currentYearValue = new Date().getFullYear();
  const monthKeys = [];
  for (let i = 0; i < 12; i++) {
    const date = new Date(currentYearValue, i, 1);
    const monthKey = date.toISOString().slice(0, 7); // YYYY-MM
    monthKeys.push(monthKey);
  }

  const stats = {};
  monthKeys.forEach((monthKey) => {
    const monthCashflows = cashflows.filter((c) =>
      c.created_at.startsWith(monthKey)
    );
    const inflow = monthCashflows
      .filter((c) => c.type === "inflow")
      .reduce((sum, c) => sum + c.nominal, 0);
    const outflow = monthCashflows
      .filter((c) => c.type === "outflow")
      .reduce((sum, c) => sum + c.nominal, 0);
    const net = inflow - outflow;
    stats[monthKey] = { inflow, outflow, net, cashflows: monthCashflows };
  });

  // This year's total stats
  const currentYear = currentYearValue.toString();
  const yearCashflows = cashflows.filter((c) =>
    c.created_at.startsWith(currentYear)
  );
  const totalInflowThisYear = yearCashflows
    .filter((c) => c.type === "inflow")
    .reduce((sum, c) => sum + c.nominal, 0);
  const totalOutflowThisYear = yearCashflows
    .filter((c) => c.type === "outflow")
    .reduce((sum, c) => sum + c.nominal, 0);
  const netCashflowThisYear = totalInflowThisYear - totalOutflowThisYear;

  const sortedMonthly = Object.entries(stats).sort(
    ([a], [b]) => new Date(a) - new Date(b)
  );

  // --- Helper functions and advanced stats for the new section ---

  // Helper to format number to Rupiah
  const formatRupiah = (number) =>
    `Rp ${Math.round(number).toLocaleString("id-ID")}`;

  // Helper to format month key (e.g., "2023-10") to "Okt '23"
  const formatMonthLabel = (monthKey) => {
    if (!monthKey) return "N/A";
    const date = new Date(monthKey + "-02"); // Use day 2 to avoid timezone issues
    return date.toLocaleDateString("id-ID", {
      month: "short",
      year: "2-digit",
    });
  };

  // Helper to format number to Rupiah with a sign
  const formatRupiahWithSign = (number) => {
    const sign = number > 0 ? "+ " : number < 0 ? "- " : "";
    return `${sign}Rp ${Math.abs(Math.round(number)).toLocaleString("id-ID")}`;
  };

  // Process all cashflows for advanced summary stats
  const processedData = (() => {
    const monthlyData = cashflows.reduce((acc, c) => {
      const monthKey = c.created_at.slice(0, 7);
      if (!acc[monthKey]) {
        acc[monthKey] = { inflow: 0, outflow: 0 };
      }
      if (c.type === "inflow") {
        acc[monthKey].inflow += c.nominal;
      } else {
        acc[monthKey].outflow += c.nominal;
      }
      return acc;
    }, {});

    const activeMonths = Object.keys(monthlyData).length;
    if (activeMonths === 0) {
      return {
        activeMonths: 0,
        avgCashflow: 0,
        highestInflowMonth: { monthKey: null },
        highestOutflowMonth: { monthKey: null },
      };
    }

    const totalNetCashflow = Object.values(monthlyData).reduce(
      (sum, data) => sum + (data.inflow - data.outflow),
      0
    );
    const avgCashflow = totalNetCashflow / activeMonths;

    const highestInflowMonth = Object.entries(monthlyData).reduce(
      (max, [key, data]) =>
        data.inflow > max.inflow ? { monthKey: key, inflow: data.inflow } : max,
      { monthKey: null, inflow: -1 }
    );
    const highestOutflowMonth = Object.entries(monthlyData).reduce(
      (max, [key, data]) =>
        data.outflow > max.outflow
          ? { monthKey: key, outflow: data.outflow }
          : max,
      { monthKey: null, outflow: -1 }
    );

    return {
      activeMonths,
      avgCashflow,
      highestInflowMonth,
      highestOutflowMonth,
    };
  })();

  // --- End of helper functions and advanced stats ---

  return (
    <div
      className="container mt-4"
      style={{
        backgroundColor: "#f8f9fa",
        padding: "20px",
        borderRadius: "8px",
      }}
    >
      {/* Header */}
      <div
        className="mb-4"
        style={{
          backgroundColor: "#e3f2fd",
          padding: "15px",
          borderRadius: "8px",
        }}
      >
        <h4 style={{ color: "#1976d2", margin: 0 }}>Monthly Stats</h4>
      </div>

      {/* Summary Cards */}
      <div className="row mb-5">
        {/* Total Inflow */}
        <div className="col-md-4 mb-4">
          <div
            className="card shadow-sm h-100"
            style={{
              borderTop: "8px solid #28a745",
              borderRadius: "1rem",
              transition: "transform 0.3s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.02)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <div className="card-body p-4">
              <div
                className="d-flex align-items-center mb-3"
                style={{ gap: "0.75rem" }}
              >
                <div
                  className="p-3 rounded-circle"
                  style={{ backgroundColor: "#eaf6ec" }}
                >
                  <TrendingUp
                    className="text-success"
                    style={{ width: "24px", height: "24px" }}
                  />
                </div>
                <span className="text-muted small font-weight-medium text-uppercase">
                  Total Inflow Tahun Ini
                </span>
              </div>
              <p className="h4 font-weight-bolder text-success">
                {formatRupiah(totalInflowThisYear)}
              </p>
            </div>
          </div>
        </div>

        {/* Total Outflow */}
        <div className="col-md-4 mb-4">
          <div
            className="card shadow-sm h-100"
            style={{
              borderTop: "8px solid #dc3545",
              borderRadius: "1rem",
              transition: "transform 0.3s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.02)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <div className="card-body p-4">
              <div
                className="d-flex align-items-center mb-3"
                style={{ gap: "0.75rem" }}
              >
                <div
                  className="p-3 rounded-circle"
                  style={{ backgroundColor: "#fdeeee" }}
                >
                  <TrendingDown
                    className="text-danger"
                    style={{ width: "24px", height: "24px" }}
                  />
                </div>
                <span className="text-muted small font-weight-medium text-uppercase">
                  Total Outflow Tahun Ini
                </span>
              </div>
              <p className="h4 font-weight-bolder text-danger">
                {formatRupiah(totalOutflowThisYear)}
              </p>
            </div>
          </div>
        </div>

        {/* Net Cashflow (Selisih) */}
        <div className="col-md-4 mb-4">
          <div
            className="card shadow-sm h-100"
            style={{
              borderTop: "8px solid #007bff",
              borderRadius: "1rem",
              transition: "transform 0.3s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.02)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <div className="card-body p-4">
              <div
                className="d-flex align-items-center mb-3"
                style={{ gap: "0.75rem" }}
              >
                <div
                  className="p-3 rounded-circle"
                  style={{ backgroundColor: "#e7f3ff" }}
                >
                  <DollarSign
                    className="text-primary"
                    style={{ width: "24px", height: "24px" }}
                  />
                </div>
                <span className="text-muted small font-weight-medium text-uppercase">
                  Net Cashflow (Selisih)
                </span>
              </div>
              <p
                className={`h4 font-weight-bolder ${
                  netCashflowThisYear >= 0 ? "text-success" : "text-danger"
                }`}
              >
                {formatRupiahWithSign(netCashflowThisYear)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="card mb-4">
        <div className="card-header">
          <h5>Cashflow Summary</h5>
        </div>
        <div className="card-body">
          <CashflowChart
            data={sortedMonthly.map(([monthKey, data]) => ({
              label: formatMonthLabel(monthKey),
              inflow: data.inflow,
              outflow: data.outflow,
            }))}
          />
        </div>
      </div>

      {/* Detail Table */}
      <div className="card shadow-sm border-light mb-4 overflow-hidden">
        <div className="card-body p-4">
          <h2 className="h5 font-weight-bold text-dark">📋 Detail per Bulan</h2>
        </div>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead style={{ backgroundColor: "#ffebee" }}>
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-sm font-weight-bold text-danger"
                >
                  Bulan
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right text-sm font-weight-bold text-danger"
                >
                  Inflow
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right text-sm font-weight-bold text-danger"
                >
                  Outflow
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right text-sm font-weight-bold text-danger"
                >
                  Cashflow Net
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedMonthly.map(([monthKey, row]) => {
                const cashflowNet = row.inflow - row.outflow;
                const monthLabel = new Date(
                  monthKey + "-02"
                ).toLocaleDateString("id-ID", {
                  month: "long",
                  year: "numeric",
                });
                return (
                  <tr
                    key={monthKey}
                    style={{ transition: "background-color 0.2s" }}
                  >
                    <td
                      className="px-4 py-3 text-sm text-dark font-weight-medium"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      {monthLabel}
                    </td>
                    <td
                      className="px-4 py-3 text-sm text-right text-success font-weight-bold"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      {formatRupiah(row.inflow)}
                    </td>
                    <td
                      className="px-4 py-3 text-sm text-right text-danger font-weight-bold"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      {formatRupiah(row.outflow)}
                    </td>
                    <td
                      className={`px-4 py-3 text-sm text-right font-weight-bold ${
                        cashflowNet > 0
                          ? "text-success"
                          : cashflowNet < 0
                          ? "text-danger"
                          : "text-muted"
                      }`}
                      style={{ whiteSpace: "nowrap" }}
                    >
                      {formatRupiahWithSign(cashflowNet)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Ringkasan Statistik - Styled Boxes */}
      <div className="card shadow-sm border-light mb-4">
        <div className="card-body p-4">
          <h3 className="h5 font-weight-bold text-dark mb-4 d-flex align-items-center">
            <Zap
              className="mr-2 text-danger"
              style={{ width: "20px", height: "20px" }}
            />
            Ringkasan Statistik Cepat
          </h3>
          <div className="row">
            {/* Bulan Aktif (Blue) */}
            <div className="col-sm-6 col-lg-3 mb-3">
              <div
                className="card h-100"
                style={{
                  border: "2px solid #90caf9",
                  backgroundColor: "#e3f2fd",
                }}
              >
                <div className="card-body p-3">
                  <p className="text-primary small font-weight-bold text-uppercase mb-1">
                    Bulan Aktif
                  </p>
                  <p className="h3 font-weight-bolder text-dark">
                    {processedData.activeMonths}
                  </p>
                </div>
              </div>
            </div>
            {/* Rata-rata Cashflow (Yellow) */}
            <div className="col-sm-6 col-lg-3 mb-3">
              <div
                className="card h-100"
                style={{
                  border: "2px solid #ffe082",
                  backgroundColor: "#fff8e1",
                }}
              >
                <div className="card-body p-3">
                  <p
                    className="small font-weight-bold text-uppercase mb-1"
                    style={{ color: "#ff8f00" }}
                  >
                    Rata-rata Cashflow/Bulan
                  </p>
                  <p
                    className={`h5 font-weight-bolder ${
                      processedData.avgCashflow >= 0
                        ? "text-success"
                        : "text-danger"
                    }`}
                  >
                    {formatRupiah(processedData.avgCashflow)}
                  </p>
                </div>
              </div>
            </div>
            {/* Bulan Inflow Tertinggi (Green) */}
            <div className="col-sm-6 col-lg-3 mb-3">
              <div
                className="card h-100"
                style={{
                  border: "2px solid #a5d6a7",
                  backgroundColor: "#e8f5e9",
                }}
              >
                <div className="card-body p-3">
                  <p className="text-success small font-weight-bold text-uppercase mb-1">
                    Bulan Inflow Tertinggi
                  </p>
                  <div className="d-flex align-items-end">
                    <p className="h5 font-weight-bolder text-dark mr-2 mb-0">
                      {formatMonthLabel(
                        processedData.highestInflowMonth.monthKey
                      )}
                    </p>
                    <ChevronsUp
                      className="text-success"
                      style={{ width: "20px", height: "20px" }}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Bulan Outflow Tertinggi (Red) */}
            <div className="col-sm-6 col-lg-3 mb-3">
              <div
                className="card h-100"
                style={{
                  border: "2px solid #ef9a9a",
                  backgroundColor: "#ffebee",
                }}
              >
                <div className="card-body p-3">
                  <p className="text-danger small font-weight-bold text-uppercase mb-1">
                    Bulan Outflow Tertinggi
                  </p>
                  <div className="d-flex align-items-end">
                    <p className="h5 font-weight-bolder text-dark mr-2 mb-0">
                      {formatMonthLabel(
                        processedData.highestOutflowMonth.monthKey
                      )}
                    </p>
                    <ChevronsDown
                      className="text-danger"
                      style={{ width: "20px", height: "20px" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Back to Dashboard Button */}
      <div className="d-flex justify-content-center mt-5 pb-3">
        <button
          onClick={() => navigate("/")}
          className="btn btn-danger btn-lg d-flex align-items-center shadow"
          style={{
            padding: "0.75rem 2rem",
            borderRadius: "0.75rem",
            fontWeight: "bold",
            gap: "0.75rem",
            transition: "all 0.3s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <Home style={{ width: "20px", height: "20px" }} />
          Kembali ke Dashboard
        </button>
      </div>
    </div>
  );
}

export default StatusMonthlyPage;
