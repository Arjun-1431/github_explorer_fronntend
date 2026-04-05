import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { IoLocationOutline } from "react-icons/io5";
import { RiGitRepositoryFill, RiUserFollowFill, RiUserFollowLine } from "react-icons/ri";
import { FaEye } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import { TfiThought } from "react-icons/tfi";

import { formatMemberSince } from "../utils/functions";
import { useAuthContext } from "../context/AuthContext";
import LikeProfile from "./LikeProfile";

const ProfileInfo = ({ userProfile }) => {
	const { setUserProfile, setAnalysisData } = useAuthContext();
	const navigate = useNavigate();

	const memberSince = formatMemberSince(userProfile?.created_at);

	useEffect(() => {
		if (userProfile) {
			setUserProfile(userProfile);
		}
	}, [userProfile, setUserProfile]);

	const handleViewAnalysis = () => {
		if (!userProfile?.login) {
			toast.error("GitHub username not available.");
			return;
		}

		setAnalysisData(null);
		navigate(`/analysis/${encodeURIComponent(userProfile.login)}`);
	};

	return (
		<div className='flex w-full flex-col gap-2 lg:sticky lg:top-10 lg:w-1/3'>
			<div className='bg-glass rounded-lg p-4'>
				<div className='flex flex-col items-start gap-3 sm:flex-row sm:items-center'>
					<a href={userProfile?.html_url} target='_blank' rel='noreferrer'>
						<img
							src={userProfile?.avatar_url}
							className='rounded-md w-24 h-24 mb-2'
							alt='User Avatar'
						/>
					</a>
					<div className='min-w-0'>
						<h1 className='text-lg font-bold'>{userProfile?.name || "No Name"}</h1>
						<p className='break-all text-sm text-gray-400'>@{userProfile?.login}</p>
					</div>
				</div>

				<p className='mt-2 text-sm text-gray-300'>{userProfile?.bio || "No bio available"}</p>

				<div className='mt-4 flex flex-wrap gap-4'>
					{userProfile?.location && (
						<span className='flex items-center gap-1 text-xs'>
							<IoLocationOutline size={14} /> {userProfile.location}
						</span>
					)}
					{userProfile?.twitter_username && (
						<a
							href={`https://twitter.com/${userProfile.twitter_username}`}
							target='_blank'
							rel='noreferrer'
							className='flex items-center gap-1 text-xs text-blue-500 hover:underline'
						>
							<FaXTwitter size={14} /> @{userProfile.twitter_username}
						</a>
					)}
				</div>

				<div className='mt-4 grid grid-cols-2 gap-4'>
					<div className='flex items-center gap-2 text-xs'>
						<RiGitRepositoryFill size={16} /> Repositories: {userProfile?.public_repos || 0}
					</div>
					<div className='flex items-center gap-2 text-xs'>
						<RiUserFollowLine size={16} /> Followers: {userProfile?.followers || 0}
					</div>
					<div className='flex items-center gap-2 text-xs'>
						<RiUserFollowFill size={16} /> Following: {userProfile?.following || 0}
					</div>
					<div className='flex items-center gap-2 text-xs'>
						<TfiThought size={16} /> Member Since: {memberSince || "N/A"}
					</div>
				</div>
			</div>

			<button
				onClick={() => window.open(userProfile?.html_url, "_blank")}
				className='bg-blue-500 text-white font-medium text-xs p-2 rounded-md mt-2 flex items-center gap-2'
			>
				<FaEye size={16} /> View Account
			</button>

			<LikeProfile userProfile={userProfile} />

			<button
				onClick={handleViewAnalysis}
				className='bg-glass font-medium text-xs p-2 rounded-md cursor-pointer border border-blue-400 flex items-center gap-2'
			>
				<FaEye size={16} /> View Analysis
			</button>
		</div>
	);
};

export default ProfileInfo;
