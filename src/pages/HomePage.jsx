import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import ProfileInfo from "../components/ProfileInfo";
import Repos from "../components/Repos";
import Search from "../components/Search";
import SortRepos from "../components/SortRepos";
import Spinner from "../components/Spinner";
import { useAuthContext } from "../context/AuthContext";

const HomePage = () => {
	const { authUser } = useAuthContext();
	const [userProfile, setUserProfile] = useState(null);
	const [repos, setRepos] = useState([]);
	const [loading, setLoading] = useState(false);
	const [sortType, setSortType] = useState("recent");
	const [query, setQuery] = useState("");
	const [searchType, setSearchType] = useState("user");
	const [suggestions, setSuggestions] = useState([]);
	const [suggestionsLoading, setSuggestionsLoading] = useState(false);

	const getUserProfileAndRepos = useCallback(async (username) => {
		setLoading(true);

		try {
			const res = await fetch(`/api/users/profile/${encodeURIComponent(username)}`);
			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || "Unable to fetch profile");
			}

			const profileRepos = [...(data.repos || [])].sort(
				(a, b) => new Date(b.created_at) - new Date(a.created_at)
			);

			setRepos(profileRepos);
			setUserProfile(data.userProfile);

			return { userProfile: data.userProfile, repos: profileRepos };
		} catch (error) {
			toast.error(error.message);
			return { userProfile: null, repos: [] };
		} finally {
			setLoading(false);
		}
	}, []);

	const searchReposByName = useCallback(async (searchQuery) => {
		setLoading(true);

		try {
			const res = await fetch(
				`/api/users/search/repositories?query=${encodeURIComponent(searchQuery)}`
			);
			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || "Unable to search repositories");
			}

			setUserProfile(null);
			setRepos(data.repos || []);
			return data.repos || [];
		} catch (error) {
			toast.error(error.message);
			return [];
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		const defaultUsername = authUser?.githubUsername || "Arjun-1431";

		if (defaultUsername) {
			getUserProfileAndRepos(defaultUsername);
		}
	}, [authUser?.githubUsername, getUserProfileAndRepos]);

	useEffect(() => {
		const trimmedQuery = query.trim();

		if (trimmedQuery.length < 2) {
			setSuggestions([]);
			setSuggestionsLoading(false);
			return;
		}

		const controller = new AbortController();
		const timeoutId = setTimeout(async () => {
			try {
				setSuggestionsLoading(true);

				const res = await fetch(
					`/api/users/search/suggestions?query=${encodeURIComponent(trimmedQuery)}&type=${searchType}`,
					{ signal: controller.signal }
				);
				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.error || "Unable to fetch suggestions");
				}

				setSuggestions(data.suggestions || []);
			} catch (error) {
				if (error.name !== "AbortError") {
					setSuggestions([]);
				}
			} finally {
				setSuggestionsLoading(false);
			}
		}, 300);

		return () => {
			controller.abort();
			clearTimeout(timeoutId);
		};
	}, [query, searchType]);

	const onSearch = async (e, nextQuery = query, nextSearchType = searchType) => {
		if (e) {
			e.preventDefault();
		}

		const trimmedQuery = nextQuery.trim();

		if (!trimmedQuery) {
			return;
		}

		setQuery(trimmedQuery);
		setSuggestions([]);

		if (nextSearchType === "repo") {
			await searchReposByName(trimmedQuery);
			setSortType("stars");
			return;
		}

		await getUserProfileAndRepos(trimmedQuery);
		setSortType("recent");
	};

	const onSuggestionSelect = async (suggestion) => {
		setQuery(suggestion.searchValue);
		await onSearch(null, suggestion.searchValue, suggestion.type);
	};

	const onSort = (nextSortType) => {
		if (nextSortType === "recent") {
			repos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
		} else if (nextSortType === "stars") {
			repos.sort((a, b) => b.stargazers_count - a.stargazers_count);
		} else if (nextSortType === "forks") {
			repos.sort((a, b) => b.forks_count - a.forks_count);
		}

		setSortType(nextSortType);
		setRepos([...repos]);
	};

	return (
		<div className='m-4'>
			<Search
				onSearch={onSearch}
				query={query}
				setQuery={setQuery}
				searchType={searchType}
				setSearchType={setSearchType}
				suggestions={suggestions}
				suggestionsLoading={suggestionsLoading}
				onSuggestionSelect={onSuggestionSelect}
			/>
			{repos.length > 0 && <SortRepos onSort={onSort} sortType={sortType} />}
			<div className='flex gap-4 flex-col lg:flex-row justify-center items-start'>
				{userProfile && !loading && <ProfileInfo userProfile={userProfile} />}
				{!loading && <Repos repos={repos} />}
				{loading && <Spinner />}
			</div>
		</div>
	);
};

export default HomePage;
