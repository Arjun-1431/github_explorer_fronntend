import * as React from 'react';
import Box from '@mui/material/Box';
import { LineChart } from '@mui/x-charts/LineChart';
import { useAuthContext } from "../context/AuthContext";

export default function ShowTotalPRs() {
  const { analysisData } = useAuthContext();
  const repositoriesPRs = analysisData?.repositoriesPRs || [];

  if (!repositoriesPRs || repositoriesPRs.length === 0) {
    return <p className="text-center text-gray-300">No pull request data available.</p>;
  }

  // Find the repository with the highest PR count (best performing repository)
  const bestRepo = repositoriesPRs.reduce(
    (max, repo) => (repo.totalPullRequests > max.totalPullRequests ? repo : max),
    repositoriesPRs[0]
  );

  // Prepare data for the line chart
  const repoNames = repositoriesPRs.map((repo) => repo.repository);
  const pullRequestCounts = repositoriesPRs.map((repo) => repo.totalPullRequests);

  // Ensure the data for the chart is in a correct format
  const chartData = [
    {
      label: 'Pull Requests',
      data: pullRequestCounts,
      yAxisId: 'linearAxis',
    },
  ];

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/85 p-4 text-white shadow-lg backdrop-blur-md sm:p-6">
      <Box sx={{ width: '100%', maxWidth: 1000, color: 'white' }}>
      <p style={{ color: 'white' }}>
        Total PRs: {analysisData?.totalPRs ?? repositoriesPRs.reduce((total, repo) => total + repo.totalPullRequests, 0)}
      </p>
      <p style={{ color: 'rgb(209 213 219)', marginTop: 8, marginBottom: 16 }}>
        Best Performing Repository: {bestRepo.repository} with {bestRepo.totalPullRequests} PRs
      </p>
      <LineChart
        xAxis={[{ data: repoNames, scaleType: 'point' }]}  // Repository names on the X axis
        yAxis={[{ id: 'linearAxis', scaleType: 'linear' }]}
        series={chartData} // Use the chartData array
        leftAxis="linearAxis"
        height={400}
        sx={{
          '.MuiChartsAxis-line': { stroke: 'rgba(255,255,255,0.25)' },
          '.MuiChartsAxis-tickLabel': { fill: '#d1d5db' },
          '.MuiChartsLegend-label': { fill: '#ffffff' },
        }}
      />
    </Box>
    </div>
  );
}
