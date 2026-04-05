import React, { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Select,
  Option,
} from "@material-tailwind/react";
import Chart from "react-apexcharts";
import { StarIcon } from "@heroicons/react/24/solid";

const ShowTotalStars = () => {
  const { analysisData } = useAuthContext();
  const [monthlyStars, setMonthlyStars] = useState([]);
  const [months, setMonths] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([new Date().getFullYear()]);

  useEffect(() => {
    if (analysisData && analysisData.starsPerMonth) {
      const allMonths = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ];
      const years = [...new Set(analysisData.starsPerMonth.map((item) => Number(item.month.split("-")[0])))]
        .sort((leftYear, rightYear) => rightYear - leftYear);

      setAvailableYears(years.length ? years : [new Date().getFullYear()]);

      if (!years.includes(selectedYear)) {
        setSelectedYear(years[0] || new Date().getFullYear());
      }

      // Initialize an empty array for all months
      let starsData = new Array(12).fill(0);
      let monthsData = [...allMonths];

      // Filter data for the selected year
      const filteredData = analysisData.starsPerMonth.filter(item =>
        Number(item.month.split("-")[0]) === selectedYear
      );

      // Populate starsData and monthsData
      filteredData.forEach(item => {
        const monthIndex = Number(item.month.split("-")[1]) - 1;
        starsData[monthIndex] = item.stars;
      });

      setMonthlyStars(starsData);
      setMonths(monthsData);
    }
  }, [analysisData, selectedYear]);

  const chartConfig = {
    series: [{ name: "Stars", data: monthlyStars }],
    options: {
      chart: { type: "line", height: 300, toolbar: { show: false } },
      title: {
        text: `GitHub Stars Trend (${selectedYear})`,
        align: "center",
        style: { color: "#ffffff", fontSize: "16px" },
      },
      colors: ["#FFD700"],
      stroke: { curve: "smooth", width: 2 },
      markers: { size: 5, colors: ["#FFD700"], strokeColors: "#ffffff" },
      xaxis: {
        categories: months.length ? months : ["No Data Available"],
        labels: { style: { colors: "#cccccc", fontSize: "12px" } },
      },
      yaxis: {
        labels: { style: { colors: "#cccccc", fontSize: "12px" } },
        title: { text: "Stars Count", style: { color: "#ffffff" } },
      },
      grid: { borderColor: "#444444", strokeDashArray: 5 },
      tooltip: {
        theme: "dark",
        y: {
          formatter: (val) => `Stars: ${val}`,
        },
        x: {
          formatter: (val) => `Month: ${val}`,
        },
      },
    },
  };

  return (
    <Card className="rounded-3xl border border-white/10 bg-slate-950/85 text-white shadow-lg backdrop-blur-md">
      <CardHeader
  floated={false}
  shadow={false}
  color="transparent"
  className="flex flex-col gap-4 p-4 sm:p-6 md:flex-row md:items-center md:justify-between"
>
  <div className="flex items-start gap-4">
    <div className="w-max rounded-lg bg-gray-800 p-4 text-yellow-400 flex-shrink-0">
      <StarIcon className="h-7 w-7" />
    </div>
    <div>
      <Typography variant="h6" color="white" className="font-bold flex items-center gap-2">
        GitHub Stars Analysis
        {analysisData?.totalStars !== undefined && (
          <span className="bg-gray-800 px-3 py-1 rounded-lg text-yellow-400 text-sm">
            {analysisData.totalStars} Stars
          </span>
        )}
      </Typography>
      <Typography variant="small" color="gray" className="font-normal mt-2">
        Select a year to view GitHub stars trend.
      </Typography>
    </div>
  </div>
</CardHeader>


      <div className="mt-1 flex w-full justify-start px-4 sm:px-6 md:max-w-xs">
  <Select
    value={selectedYear}
    onChange={(e) => setSelectedYear(Number(e))}
    className="bg-gray-800 text-white p-2 rounded-lg w-full"
  >
    {availableYears.map((year) => (
      <Option key={year} value={year}>
        {year}
      </Option>
    ))}
  </Select>
</div>


      <CardBody className="px-3 pb-4 sm:px-6 sm:pb-6">
        <Chart
          options={chartConfig.options}
          series={chartConfig.series}
          type="line"
          height={300}
        />
      </CardBody>
    </Card>
  );
};

export default ShowTotalStars;
