import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import ShowTotalStars from "./ShowTotalStars";
import ShowTotalCommits from "./ShowTotalCommits";
import ShowTotalPRs from "./ShowTotalPRs";
import ShowTotalIssues from "./ShowTotalIssues";
import ShowTotalContributions from "./ShowTotalContributions";

const ANALYSIS_TABS = [
	{ id: "stars", label: "Profile Stars" },
	{ id: "commits", label: "Profile Commits" },
	{ id: "prs", label: "Profile PRs" },
	{ id: "issues", label: "Profile Issues" },
	{ id: "contributions", label: "Profile Contributions" },
];

const Analysis = () => {
	const { username } = useParams();
	const navigate = useNavigate();
	const { analysisData, setAnalysisData } = useAuthContext();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [visibleComponent, setVisibleComponent] = useState("stars");
	const [retryKey, setRetryKey] = useState(0);

	useEffect(() => {
		const activeUsername = analysisData?.profile?.login;

		if (!username) {
			if (activeUsername) {
				navigate(`/analysis/${encodeURIComponent(activeUsername)}`, { replace: true });
				return;
			}

			setError("Search a GitHub profile first to view analysis.");
			setLoading(false);
			return;
		}

		if (activeUsername?.toLowerCase() === username.toLowerCase()) {
			setError("");
			setLoading(false);
			return;
		}

		const controller = new AbortController();

		const fetchAnalysis = async () => {
			try {
				setLoading(true);
				setError("");

				const response = await fetch(`/api/users/analysis/${encodeURIComponent(username)}`, {
					signal: controller.signal,
				});
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Failed to load GitHub analysis");
				}

				setAnalysisData(data);
			} catch (fetchError) {
				if (fetchError.name === "AbortError") {
					return;
				}

				setError(fetchError.message);
				toast.error(fetchError.message);
			} finally {
				if (!controller.signal.aborted) {
					setLoading(false);
				}
			}
		};

		fetchAnalysis();

		return () => controller.abort();
	}, [analysisData?.profile?.login, navigate, retryKey, setAnalysisData, username]);

	if (loading) {
		return (
			<div className='rounded-lg bg-gray-200 p-6 shadow-xl'>
				<p className='text-center text-lg font-medium text-black'>
					Loading analysis for @{username || "profile"}...
				</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className='rounded-lg bg-gray-200 p-6 shadow-xl text-center'>
				<h2 className='text-2xl font-semibold text-black'>GitHub Profile Analysis</h2>
				<p className='mt-4 text-sm text-gray-700'>{error}</p>
				<button
					type='button'
					onClick={() => setRetryKey((currentValue) => currentValue + 1)}
					className='mt-4 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white'
				>
					Try Again
				</button>
			</div>
		);
	}

	if (!analysisData) {
		return (
			<div className='rounded-lg bg-gray-200 p-6 shadow-xl'>
				<p className='text-center text-black'>Analysis data is not available yet.</p>
			</div>
		);
	}

	const stats = [
		{ label: "Stars", value: analysisData.totalStars || 0 },
		{ label: "Commits", value: analysisData.totalCommits || 0 },
		{ label: "PRs", value: analysisData.totalPRs || 0 },
		{ label: "Issues", value: analysisData.totalIssues || 0 },
		{ label: "Contributions", value: analysisData.totalContributions || 0 },
	];

	const renderVisibleAnalysis = () => {
		switch (visibleComponent) {
			case "commits":
				return <ShowTotalCommits />;
			case "prs":
				return <ShowTotalPRs />;
			case "issues":
				return <ShowTotalIssues />;
			case "contributions":
				return <ShowTotalContributions />;
			case "stars":
			default:
				return <ShowTotalStars />;
		}
	};

	return (
		<div className='rounded-lg bg-gray-200 p-6 shadow-xl'>
			<div className='mb-6 flex flex-col gap-4'>
				<div className='text-center'>
					<h2 className='text-2xl font-semibold text-black'>GitHub Profile Analysis</h2>
					<p className='mt-1 text-sm text-gray-700'>
						@{analysisData.profile?.login || username}
					</p>
				</div>

				<div className='grid grid-cols-2 gap-3 md:grid-cols-5'>
					{stats.map((stat) => (
						<div key={stat.label} className='rounded-lg bg-white p-3 text-center shadow-sm'>
							<p className='text-xs uppercase tracking-wide text-gray-500'>{stat.label}</p>
							<p className='mt-1 text-lg font-semibold text-black'>{stat.value}</p>
						</div>
					))}
				</div>
			</div>

			<div className='grid grid-cols-2 gap-3 text-sm sm:grid-cols-3 lg:grid-cols-5'>
				{ANALYSIS_TABS.map((tab) => (
					<button
						key={tab.id}
						type='button'
						className={`rounded-lg px-4 py-2 transition duration-300 focus:outline-none ${
							visibleComponent === tab.id
								? "bg-blue-700 text-white"
								: "bg-white text-black hover:bg-gray-100"
						}`}
						onClick={() => setVisibleComponent(tab.id)}
					>
						{tab.label}
					</button>
				))}
			</div>

			<div className='mt-6'>{renderVisibleAnalysis()}</div>
		</div>
	);
};

export default Analysis;
