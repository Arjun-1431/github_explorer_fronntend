import React from "react";
import { Card, CardBody, CardHeader, Typography } from "@material-tailwind/react";
import { ChartBarIcon } from "@heroicons/react/24/solid";
import Chart from "react-apexcharts";
import { useAuthContext } from "../context/AuthContext";

function formatMonth(monthKey) {
  const [year, month] = monthKey.split("-");
  const date = new Date(Number(year), Number(month) - 1);

  return date.toLocaleString("en-US", { month: "short", year: "numeric" });
}

export default function ShowTotalContributions() {
  const { analysisData } = useAuthContext();
  const contributionSeries = analysisData?.contributionsPerMonth || [];

  if (contributionSeries.length === 0) {
    return <p className="text-center text-gray-600">No contribution data available for this profile.</p>;
  }

  const categories = contributionSeries.map((entry) => formatMonth(entry.month));
  const contributions = contributionSeries.map((entry) => entry.contributions);

  const chartConfig = {
    series: [{ name: "Contributions", data: contributions }],
    options: {
      chart: { toolbar: { show: false } },
      title: {
        text: "GitHub Contributions Trend",
        align: "center",
        style: { color: "#ffffff", fontSize: "16px", fontFamily: "inherit" },
      },
      dataLabels: { enabled: false },
      colors: ["#10B981"],
      stroke: { curve: "smooth", width: 3 },
      markers: { size: 4, colors: ["#10B981"] },
      xaxis: {
        categories,
        labels: { style: { colors: "#cccccc", fontSize: "12px" } },
      },
      yaxis: {
        labels: { style: { colors: "#cccccc", fontSize: "12px" } },
      },
      grid: { borderColor: "#444444", strokeDashArray: 5 },
      tooltip: { theme: "dark" },
    },
  };

  return (
    <Card className="bg-black text-white">
      <CardHeader
        floated={false}
        shadow={false}
        color="transparent"
        className="flex flex-col gap-4 md:flex-row md:items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-max rounded-lg bg-gray-800 p-5 text-emerald-400">
            <ChartBarIcon className="h-6 w-6" />
          </div>
          <div>
            <Typography variant="h6" color="white">
              GitHub Contributions Analysis
            </Typography>
            <Typography variant="small" color="gray" className="max-w-sm font-normal">
              Monthly contribution activity based on the latest GitHub events.
            </Typography>
          </div>
        </div>
        <div className="flex items-center bg-gray-800 px-3 py-2 rounded-lg">
          <Typography variant="h6" color="white">
            {analysisData?.totalContributions || 0} Contributions
          </Typography>
        </div>
      </CardHeader>
      <CardBody className="px-2 pb-0">
        <Chart type="line" height={260} {...chartConfig} />
      </CardBody>
    </Card>
  );
}
