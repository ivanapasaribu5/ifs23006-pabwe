import React from "react";

// Grouped bar chart (inflow vs outflow). data = [{ label: '2025-09', inflow: 1000, outflow: 800 }, ...]
function CashflowChart({ data = [], height = 180 }) {
  if (!data || data.length === 0) return null;

  // layout
  const margin = { top: 10, right: 12, bottom: 32, left: 40 };
  const groupWidth = 48; // width per group (two bars)
  const barGap = 6; // gap between two bars in a group
  const innerBarWidth = Math.max(8, Math.floor((groupWidth - barGap) / 2));
  const width = Math.max(
    300,
    data.length * groupWidth + margin.left + margin.right
  );
  const chartHeight = height - margin.top - margin.bottom;

  const maxVal = Math.max(
    ...data.map((d) => Math.max(d.inflow || 0, d.outflow || 0)),
    1
  );

  // y ticks (5 steps)
  const ticks = 5;
  const tickValues = Array.from({ length: ticks + 1 }, (_, i) =>
    Math.round((maxVal * i) / ticks)
  );

  return (
    <div className="mb-3">
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* y axis grid and labels */}
        {tickValues.map((val, i) => {
          const y = margin.top + chartHeight - (val / maxVal) * chartHeight;
          return (
            <g key={i}>
              <line
                x1={margin.left}
                x2={width - margin.right}
                y1={y}
                y2={y}
                stroke="#eee"
              />
              <text
                x={margin.left - 6}
                y={y + 4}
                fontSize={10}
                textAnchor="end"
                fill="#666"
              >
                {val.toLocaleString()}
              </text>
            </g>
          );
        })}

        {/* bars */}
        {data.map((d, i) => {
          const groupX = margin.left + i * groupWidth;
          const inflowH = (d.inflow / maxVal) * chartHeight;
          const outflowH = (d.outflow / maxVal) * chartHeight;
          const inflowX = groupX;
          const outflowX = groupX + innerBarWidth + barGap;

          return (
            <g key={i}>
              {/* inflow bar */}
              <rect
                x={inflowX}
                y={margin.top + chartHeight - inflowH}
                width={innerBarWidth}
                height={inflowH}
                fill="#198754"
                rx={2}
              />
              {/* outflow bar */}
              <rect
                x={outflowX}
                y={margin.top + chartHeight - outflowH}
                width={innerBarWidth}
                height={outflowH}
                fill="#dc3545"
                rx={2}
              />
              {/* label */}
              <text
                x={groupX + groupWidth / 2}
                y={height - 8}
                fontSize={11}
                textAnchor="middle"
                fill="#333"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="small mt-2">
        <span className="badge bg-success me-1">&nbsp;</span> Inflow
        <span className="badge bg-danger ms-3 me-1">&nbsp;</span> Outflow
      </div>
    </div>
  );
}

export default CashflowChart;
