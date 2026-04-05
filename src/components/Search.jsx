import { useEffect, useRef, useState } from "react";
import { FaCodeBranch, FaUser } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";

const SEARCH_TYPES = {
	user: {
		label: "Users",
		placeholder: "Search GitHub usernames",
		description: "Account suggestions",
	},
	repo: {
		label: "Repositories",
		placeholder: "Search repository names",
		description: "Repository suggestions",
	},
};

const Search = ({
	onSearch,
	query,
	setQuery,
	searchType,
	setSearchType,
	suggestions,
	suggestionsLoading,
	onSuggestionSelect,
}) => {
	const [showSuggestions, setShowSuggestions] = useState(false);
	const containerRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (containerRef.current && !containerRef.current.contains(event.target)) {
				setShowSuggestions(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<form className='mx-auto w-full max-w-3xl p-2' onSubmit={(e) => onSearch(e, query, searchType)}>
			<label htmlFor='default-search' className='mb-2 text-sm font-medium text-gray-900 sr-only'>
				Search
			</label>

			<div className='mb-3 flex flex-wrap justify-center gap-2'>
				{Object.entries(SEARCH_TYPES).map(([type, config]) => (
					<button
						key={type}
						type='button'
						onClick={() => {
							setSearchType(type);
							setShowSuggestions(false);
						}}
						className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
							searchType === type
								? "bg-blue-700 text-white"
								: "bg-glass text-slate-200 border border-slate-600"
						}`}
					>
						{config.label}
					</button>
				))}
			</div>

			<div className='relative' ref={containerRef}>
				<div className='absolute inset-y-0 start-0 flex items-center z-10 ps-3 pointer-events-none'>
					<IoSearch className='w-5 h-5' />
				</div>

				<input
					type='search'
					id='default-search'
					className='block w-full rounded-lg bg-glass p-4 pb-16 ps-10 text-sm focus:border-blue-500 focus:ring-blue-500 sm:pe-36 sm:pb-4'
					placeholder={SEARCH_TYPES[searchType].placeholder}
					required
					value={query}
					onFocus={() => setShowSuggestions(true)}
					onChange={(e) => {
						setQuery(e.target.value);
						setShowSuggestions(true);
					}}
				/>

				<button
					type='submit'
					className='absolute bottom-2.5 left-2.5 right-2.5 rounded-lg bg-gradient-to-r from-cyan-900 to-blue-900 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:scale-95 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:left-auto sm:right-2.5'
				>
					Search
				</button>
			</div>

			{showSuggestions && (suggestionsLoading || query.trim().length >= 2) && (
				<div className='mt-2 rounded-xl border border-slate-700 bg-slate-950/95 shadow-xl overflow-hidden'>
					<div className='border-b border-slate-800 px-4 py-2 text-xs uppercase tracking-wide text-slate-400'>
						{SEARCH_TYPES[searchType].description}
					</div>

					{suggestionsLoading && <p className='px-4 py-3 text-sm text-slate-300'>Loading suggestions...</p>}

					{!suggestionsLoading && suggestions.length === 0 && query.trim().length >= 2 && (
						<p className='px-4 py-3 text-sm text-slate-400'>No suggestions found.</p>
					)}

					{!suggestionsLoading &&
						suggestions.map((suggestion) => (
							<button
								key={`${suggestion.type}-${suggestion.id}`}
								type='button'
								onMouseDown={(e) => {
									e.preventDefault();
									setShowSuggestions(false);
									onSuggestionSelect(suggestion);
								}}
								className='flex w-full items-center gap-3 border-b border-slate-800/80 px-4 py-3 text-left transition-colors duration-150 hover:bg-slate-900 last:border-b-0'
							>
								{suggestion.avatarUrl ? (
									<img
										src={suggestion.avatarUrl}
										alt={suggestion.label}
										className='h-10 w-10 rounded-full object-cover'
									/>
								) : (
									<div className='flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-300'>
										{suggestion.type === "repo" ? <FaCodeBranch size={14} /> : <FaUser size={14} />}
									</div>
								)}

								<div className='min-w-0'>
									<p className='truncate text-sm font-semibold text-slate-100'>{suggestion.label}</p>
									<p className='truncate text-xs text-slate-400'>{suggestion.description}</p>
								</div>
							</button>
						))}
				</div>
			)}
		</form>
	);
};

export default Search;
