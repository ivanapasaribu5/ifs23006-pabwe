import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import CashflowChart from "../components/CashflowChart";
import { asyncSetCashflows } from "../states/action";
import {
  Home,
  ChevronsUp,
  ChevronsDown,
  Zap,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// --- Helper Functions ---

// Helper to format number to Rupiah
const formatRupiah = (number) =>
  `Rp ${Math.round(number).toLocaleString("id-ID")}`;

// Helper to format number to Rupiah with a sign
const formatRupiahWithSign = (number) => {
  const sign = number > 0 ? "+ " : number < 0 ? "- " : "";
  return `${sign}Rp ${Math.abs(Math.round(number)).toLocaleString("id-ID")}`;
};

// Helper to get all dates (YYYY-MM-DD) for a specific month key (YYYY-MM)
const getDaysInMonth = (monthKey) => {
  const [year, month] = monthKey.split("-").map(Number);
  const days = [];
  // Use day 1 to initialize
  const date = new Date(year, month - 1, 1);

  while (date.getMonth() === month - 1) {
    const isoString = date.toISOString().slice(0, 10);
    days.push(isoString);
    date.setDate(date.getDate() + 1);
  }
  return days;
};

// Helper to format YYYY-MM-DD to "DD Mmm" (e.g., 12 Okt)
const formatDayLabel = (dateKey) => {
  if (!dateKey) return "N/A";
  const parts = dateKey.split("-").map(Number);
  // Create Date object using local time (YYYY, MM-1, DD)
  const fixedDate = new Date(parts[0], parts[1] - 1, parts[2]);

  return fixedDate.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
  });
};

// Helper to format YYYY-MM-DD (or YYYY-MM) to "Oktober 2025"
const formatMonthYearLabel = (dateKey) => {
  if (!dateKey) return "N/A";
  // Safely parse date from YYYY-MM-DD or YYYY-MM
  const parts = dateKey.split("-");
  const year = Number(parts[0]);
  const month = Number(parts[1]);
  // Use day 1 to create the date object for month formatting
  const date = new Date(year, month - 1, 1);

  return date.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });
};

// --- StatusDailyPage Component ---

function StatusDailyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // 1. Get data from Redux store
  const cashflows = useSelector((state) => state.cashflow.cashflows);
  const isLoading = cashflows.length === 0;

  // 2. Initialize month from navigation state or default to current month
  const getInitialMonthKey = () => {
    const navState = location.state?.month;
    if (
      navState &&
      typeof navState.year === "number" &&
      typeof navState.month === "number"
    ) {
      // month is 0-11, so add 1 for the key
      return `${navState.year}-${String(navState.month + 1).padStart(2, "0")}`;
    }
    // Default to current month if no state is passed
    return new Date().toISOString().slice(0, 7);
  };

  const [currentMonthKey, setCurrentMonthKey] = useState(getInitialMonthKey);

  // 3. Ensure data is fetched if not already present
  useEffect(() => {
    // This will fetch data if the user navigates directly to this page
    dispatch(asyncSetCashflows());
  }, []);

  // Handler for month navigation
  const handleMonthChange = (direction) => {
    const [year, month] = currentMonthKey.split("-").map(Number);
    // Use Date.UTC to avoid timezone issues
    let newDate = new Date(Date.UTC(year, month - 1, 1));

    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setUTCMonth(newDate.getUTCMonth() + 1);
    }

    // Format back to YYYY-MM
    const newMonthKey = newDate.toISOString().slice(0, 7);
    setCurrentMonthKey(newMonthKey); // This triggers the re-calculation in useMemo
  };

  // Memoize the daily statistics calculation
  const {
    totalInflowThisMonth,
    totalOutflowThisMonth,
    netCashflowThisMonth,
    sortedDaily,
    processedData,
    monthLabel,
  } = useMemo(() => {
    if (cashflows.length === 0) {
      return {
        totalInflowThisMonth: 0,
        totalOutflowThisMonth: 0,
        netCashflowThisMonth: 0,
        sortedDaily: [],
        processedData: {
          activeDays: 0,
          avgCashflow: 0,
          highestInflowDay: { dayKey: null },
          highestOutflowDay: { dayKey: null },
        },
        monthLabel: formatMonthYearLabel(currentMonthKey + "-01"),
      };
    }

    const dailyKeys = getDaysInMonth(currentMonthKey);
    const dailyStats = {};
    let totalInflow = 0;
    let totalOutflow = 0;

    // Filter cashflows for the current month only
    const monthCashflows = cashflows.filter((c) =>
      c.created_at.startsWith(currentMonthKey)
    );

    // 1. Calculate stats for every day in the current month
    dailyKeys.forEach((dayKey) => {
      const dayCashflows = monthCashflows.filter((c) =>
        c.created_at.startsWith(dayKey)
      );
      const inflow = dayCashflows
        .filter((c) => c.type === "inflow")
        .reduce((sum, c) => sum + c.nominal, 0);
      const outflow = dayCashflows
        .filter((c) => c.type === "outflow")
        .reduce((sum, c) => sum + c.nominal, 0);

      totalInflow += inflow;
      totalOutflow += outflow;

      const net = inflow - outflow;
      dailyStats[dayKey] = { inflow, outflow, net, cashflows: dayCashflows };
    });

    const netCashflow = totalInflow - totalOutflow;

    const sortedDays = Object.entries(dailyStats).sort(
      ([a], [b]) => new Date(a) - new Date(b)
    );

    // 2. Advanced Summary Stats (for days with actual activity)
    const dailyActiveData = monthCashflows.reduce((acc, c) => {
      const dayKey = c.created_at.slice(0, 10);
      if (!acc[dayKey]) {
        acc[dayKey] = { inflow: 0, outflow: 0 };
      }
      if (c.type === "inflow") {
        acc[dayKey].inflow += c.nominal;
      } else {
        acc[dayKey].outflow += c.nominal;
      }
      return acc;
    }, {});

    const activeDays = Object.keys(dailyActiveData).length;
    let avgCashflow = 0;
    let highestInflowDay = { dayKey: null, inflow: -1 };
    let highestOutflowDay = { dayKey: null, outflow: -1 };

    if (activeDays > 0) {
      const totalNetCashflow = Object.values(dailyActiveData).reduce(
        (sum, data) => sum + (data.inflow - data.outflow),
        0
      );
      avgCashflow = totalNetCashflow / activeDays;

      highestInflowDay = Object.entries(dailyActiveData).reduce(
        (max, [key, data]) =>
          data.inflow > max.inflow ? { dayKey: key, inflow: data.inflow } : max,
        { dayKey: null, inflow: -1 }
      );
      highestOutflowDay = Object.entries(dailyActiveData).reduce(
        (max, [key, data]) =>
          data.outflow > max.outflow
            ? { dayKey: key, outflow: data.outflow }
            : max,
        { dayKey: null, outflow: -1 }
      );
    }

    return {
      totalInflowThisMonth: totalInflow,
      totalOutflowThisMonth: totalOutflow,
      netCashflowThisMonth: netCashflow,
      sortedDaily: sortedDays,
      processedData: {
        activeDays,
        avgCashflow,
        highestInflowDay,
        highestOutflowDay,
      },
      monthLabel: formatMonthYearLabel(currentMonthKey + "-01"),
    };
  }, [cashflows, currentMonthKey]);

  if (isLoading) {
    return (
      <div className="container mt-4 p-5 text-center text-primary">
        Memuat data status harian...
      </div>
    );
  }

  return (
    <div
      className="container mt-4"
      style={{
        backgroundColor: "#f8f9fa",
        padding: "20px",
        borderRadius: "1rem",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Header with Navigation */}
      <div
        className="mb-4 d-flex justify-content-between align-items-center p-3"
        style={{
          backgroundColor: "#e3f2fd",
          borderRadius: "1rem",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
          gap: "1rem", // Add gap for spacing
        }}
      >
        <button
          onClick={() => handleMonthChange("prev")}
          className="btn btn-sm btn-outline-primary rounded-pill d-flex align-items-center"
          style={{ gap: "0.5rem", fontWeight: 600 }}
        >
          <ChevronLeft style={{ width: "16px", height: "16px" }} />
          Bulan Sebelumnya
        </button>
        <h4
          style={{
            color: "#1976d2",
            margin: 0,
            textAlign: "center",
            flexGrow: 1,
          }}
        >
          Daily Stats for {monthLabel}
        </h4>
        <button
          onClick={() => handleMonthChange("next")}
          className="btn btn-sm btn-outline-primary rounded-pill d-flex align-items-center"
          style={{ gap: "0.5rem", fontWeight: 600 }}
        >
          Bulan Selanjutnya
          <ChevronRight style={{ width: "16px", height: "16px" }} />
        </button>
      </div>

      {/* Summary Cards (This Month) */}
      <div className="row mb-5">
        {/* Total Inflow This Month */}
        <div className="col-md-4 mb-4">
          <div
            className="card shadow-md h-100"
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
                  Inflow Hari Ini
                </span>
              </div>
              <p className="h4 font-weight-bolder text-success">
                {formatRupiah(totalInflowThisMonth)}
              </p>
            </div>
          </div>
        </div>

        {/* Total Outflow This Month */}
        <div className="col-md-4 mb-4">
          <div
            className="card shadow-md h-100"
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
                  Outflow Hari Ini
                </span>
              </div>
              <p className="h4 font-weight-bolder text-danger">
                {formatRupiah(totalOutflowThisMonth)}
              </p>
            </div>
          </div>
        </div>

        {/* Net Cashflow (Selisih) This Month */}
        <div className="col-md-4 mb-4">
          <div
            className="card shadow-md h-100"
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
                  netCashflowThisMonth >= 0 ? "text-success" : "text-danger"
                }`}
              >
                {formatRupiahWithSign(netCashflowThisMonth)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="card mb-4 shadow-sm rounded-xl">
        <div className="card-header border-bottom-0 bg-white p-4">
          <h5 className="font-weight-bold text-dark">Cashflow Harian</h5>
        </div>
        <div className="card-body p-4">
          <div style={{ height: "300px" }}>
            {/* Use the real CashflowChart component */}
            <CashflowChart
              data={sortedDaily.map(([dayKey, data]) => ({
                label: dayKey.slice(8, 10), // Pass day number as label (e.g., "01", "15")
                inflow: data.inflow,
                outflow: data.outflow,
              }))}
            />
          </div>
        </div>
      </div>

      {/* Detail Table */}
      <div className="card shadow-sm border-light mb-4 overflow-hidden rounded-xl">
        <div className="card-body p-4">
          <h2 className="h5 font-weight-bold text-dark d-flex align-items-center">
            📋 Detail per Hari ({monthLabel})
          </h2>
        </div>
        <div className="table-responsive">
          <table className="table table-striped table-hover mb-0">
            <thead style={{ backgroundColor: "#ffebee" }}>
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-sm font-weight-bold text-danger"
                >
                  Hari
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
              {sortedDaily.map(([dayKey, row]) => {
                const cashflowNet = row.inflow - row.outflow;
                const dayLabel = new Date(dayKey).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                });
                return (
                  <tr
                    key={dayKey}
                    style={{ transition: "background-color 0.2s" }}
                  >
                    <td
                      className="px-4 py-3 text-sm text-dark font-weight-medium"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      {dayLabel}
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

      {/* Ringkasan Statistik - Styled Boxes */}
      <div className="card shadow-sm border-light mb-4 rounded-xl">
        <div className="card-body p-4">
          <h3 className="h5 font-weight-bold text-dark mb-4 d-flex align-items-center">
            <Zap
              className="mr-2 text-danger"
              style={{ width: "20px", height: "20px" }}
            />
            Ringkasan Statistik Cepat Bulan Ini
          </h3>
          <div className="row">
            {/* Hari Aktif (Blue) */}
            <div className="col-sm-6 col-lg-3 mb-3">
              <div
                className="card h-100 shadow-sm"
                style={{
                  border: "2px solid #90caf9",
                  backgroundColor: "#e3f2fd",
                  borderRadius: "0.75rem",
                }}
              >
                <div className="card-body p-3">
                  <p className="text-primary small font-weight-bold text-uppercase mb-1">
                    Hari Aktif
                  </p>
                  <p className="h3 font-weight-bolder text-dark">
                    {processedData.activeDays}
                  </p>
                </div>
              </div>
            </div>
            {/* Rata-rata Cashflow (Yellow) */}
            <div className="col-sm-6 col-lg-3 mb-3">
              <div
                className="card h-100 shadow-sm"
                style={{
                  border: "2px solid #ffe082",
                  backgroundColor: "#fff8e1",
                  borderRadius: "0.75rem",
                }}
              >
                <div className="card-body p-3">
                  <p
                    className="small font-weight-bold text-uppercase mb-1"
                    style={{ color: "#ff8f00" }}
                  >
                    Rata-rata Net Cashflow/Hari
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
            {/* Hari Inflow Tertinggi (Green) */}
            <div className="col-sm-6 col-lg-3 mb-3">
              <div
                className="card h-100 shadow-sm"
                style={{
                  border: "2px solid #a5d6a7",
                  backgroundColor: "#e8f5e9",
                  borderRadius: "0.75rem",
                }}
              >
                <div className="card-body p-3">
                  <p className="text-success small font-weight-bold text-uppercase mb-1">
                    Hari Inflow Tertinggi
                  </p>
                  <div className="d-flex align-items-end justify-content-between">
                    <p className="h5 font-weight-bolder text-dark mr-2 mb-0">
                      {formatDayLabel(processedData.highestInflowDay.dayKey)}
                    </p>
                    <ChevronsUp
                      className="text-success"
                      style={{ width: "24px", height: "24px" }}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Hari Outflow Tertinggi (Red) */}
            <div className="col-sm-6 col-lg-3 mb-3">
              <div
                className="card h-100 shadow-sm"
                style={{
                  border: "2px solid #ef9a9a",
                  backgroundColor: "#ffebee",
                  borderRadius: "0.75rem",
                }}
              >
                <div className="card-body p-3">
                  <p className="text-danger small font-weight-bold text-uppercase mb-1">
                    Hari Outflow Tertinggi
                  </p>
                  <div className="d-flex align-items-end justify-content-between">
                    <p className="h5 font-weight-bolder text-dark mr-2 mb-0">
                      {formatDayLabel(processedData.highestOutflowDay.dayKey)}
                    </p>
                    <ChevronsDown
                      className="text-danger"
                      style={{ width: "24px", height: "24px" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Dashboard Button */}
      <div className="d-flex justify-content-center mt-5 pb-3">
        <button
          onClick={() => navigate("/")}
          className="btn btn-danger btn-lg d-flex align-items-center shadow-lg"
          style={{
            padding: "0.75rem 2rem",
            borderRadius: "0.75rem",
            fontWeight: "bold",
            gap: "0.75rem",
            transition: "all 0.3s",
            backgroundImage: "linear-gradient(45deg, #dc3545, #ff6b6b)",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <Home style={{ width: "20px", height: "20px" }} />
          Kembali ke Dashboard
        </button>
      </div>
    </div>
  );
}

export default StatusDailyPage;
