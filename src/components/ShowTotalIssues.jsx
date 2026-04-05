import * as React from "react";
import Box from "@mui/material/Box";
import { LineChart } from "@mui/x-charts/LineChart";
import { useAuthContext } from "../context/AuthContext";

export default function ShowTotalIssues() {
	const { analysisData } = useAuthContext();
	const repositoriesIssues = analysisData?.repositoriesIssues || [];

	if (repositoriesIssues.length === 0) {
		return <p className='text-center text-gray-300'>No issue activity available for this profile.</p>;
	}

	const repoNames = repositoriesIssues.map((repo) => repo.repository);
	const issueCounts = repositoriesIssues.map((repo) => repo.totalIssues);

	return (
		<div className='space-y-4 rounded-3xl border border-white/10 bg-slate-950/85 p-4 text-white shadow-lg backdrop-blur-md sm:p-6'>
			<p className='text-sm text-white'>
				Total issues recorded: <span className='font-semibold'>{analysisData?.totalIssues || 0}</span>
			</p>
			<Box sx={{ width: "100%", maxWidth: 1000 }}>
				<LineChart
					xAxis={[
						{
							data: repoNames,
							scaleType: "point",
							label: "Repositories",
						},
					]}
					yAxis={[{ id: "linearAxis", scaleType: "linear", label: "Total Issues" }]}
					series={[{ data: issueCounts, label: "Issues Count", yAxisId: "linearAxis" }]}
					height={400}
					sx={{
						".MuiChartsAxis-line": { stroke: "rgba(255,255,255,0.25)" },
						".MuiChartsAxis-tickLabel": { fill: "#d1d5db" },
						".MuiChartsLegend-label": { fill: "#ffffff" },
					}}
				/>
			</Box>
		</div>
	);
}
