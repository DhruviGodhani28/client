import React from "react";
import "../css/graph.css";

export const Graph = ({
  savings,
  earnings,
}: {
  savings: number;
  earnings: number;
}) => {
  const total = savings + earnings;
  let savingsPercentage, earningPercentage;

  // const savingsPercentage = (savings / total) * 100;
  // const earningPercentage = (earnings / total) * 100;

  if (total > 0) {
    savingsPercentage = Math.min((savings / total) * 100, 100);
    earningPercentage = Math.min((earnings / total) * 100, 100);
  } else {
    savingsPercentage = 0;
    earningPercentage = 0;
  }

  const radius = 100;
  const strokeWidth = 20;
  const circumference = 2 * Math.PI * radius;
  const savingsStrokeDashoffset = (savingsPercentage / 100) * circumference;
  const expenditureStrokeDashoffset = (earningPercentage / 100) * circumference;

  return (
    <div className="center-container">
      <h2 style={{ color: "white" }}>Expense Graph</h2>
      <div className="graph-container">
        <svg height="300" width="300">
          <circle
            cx="150"
            cy="150"
            r={radius}
            fill="transparent"
            stroke="#f44336"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={expenditureStrokeDashoffset}
          />
          {/* Savings Circle */}
          <circle
            cx="150"
            cy="150"
            r={radius}
            fill="transparent"
            stroke="#2196f3"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={savingsStrokeDashoffset}
            transform={`rotate(-90 150 150)`}
          />
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize="30"
          >
            {Math.round(savingsPercentage)}%
          </text>
        </svg>
        <div className="graph-info">
          <div>
            <span
              style={{ color: "#f44336", fontSize: "18px", fontWeight: "bold" }}
            >
              Savings:{" "}
            </span>
            <span style={{ fontSize: "18px", fontWeight: "bold" }}>
              {Math.round(savingsPercentage)}%
            </span>
          </div>
          <div>
            <span
              style={{ color: "#2196f3", fontSize: "18px", fontWeight: "bold" }}
            >
              Expenditure:{" "}
            </span>
            <span style={{ fontSize: "18px", fontWeight: "bold" }}>
              {Math.round(earningPercentage)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
