import React from "react";
import ReactApexChart from "react-apexcharts";

export const SummaryPie = ({ label, chartData }) => {
  const series = chartData.map((item) => item.value) ?? [];
  const options = {
    chart: {
      width: 500,
      type: "pie",
    },
    labels: chartData.map((item) => item.label) ?? [],
  };

  return (
    <div
      style={{
        width: "500px",
        textAlign: "center",
        padding: "10px",
        border: "1px solid #000000",
      }}
    >
      <h2 style={{ fontSize: "bold" }}>{label}</h2>
      <ReactApexChart
        options={options}
        series={series}
        type="pie"
        width={380}
      />
    </div>
  );
};
