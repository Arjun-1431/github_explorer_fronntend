const SortRepos = ({ onSort, sortType }) => {
	const BUTTONS = [
		{ type: "recent", text: "Most Recent" },
		{ type: "stars", text: "Most Stars" },
		{ type: "forks", text: "Most Forks" },
	];

	return (
		<div className='mb-2 flex flex-wrap justify-center lg:justify-end'>
			{BUTTONS.map((button) => (
				<button
					key={button.type}
					type='button'
					className={`mb-2 me-2 rounded-lg bg-glass px-4 py-2.5 text-xs font-medium focus:outline-none sm:px-5 sm:text-sm ${
						button.type == sortType ? "border-blue-500" : ""
					}`}
					onClick={() => onSort(button.type)}
				>
					{button.text}
				</button>
			))}
		</div>
	);
};
export default SortRepos;
