import { FaCodeBranch, FaCopy, FaRegStar, FaEye } from "react-icons/fa";
import { FaCodeFork } from "react-icons/fa6";
import { formatDate } from "../utils/functions";
import { PROGRAMMING_LANGUAGES } from "../utils/constants";
import toast from "react-hot-toast";

const Repo = ({ repo }) => {
  const formattedDate = formatDate(repo.created_at);

  // Handle copying the clone URL to clipboard
  const handleCloneClick = async (repo) => {
    try {
      await navigator.clipboard.writeText(repo.clone_url);
      toast.success("Repo URL cloned to clipboard");
    } catch (error) {
      toast.error("Clipboard write failed.");
    }
  };

  // Handle opening the repository in GitHub Codespaces (VS Code in Browser)
  const handleOpenInVSCode = (repo) => {
    const repoUrl = repo.html_url; // GitHub repository URL

    // GitHub Codespaces URL format: https://github.dev/{owner}/{repo}
    const codespacesUrl = `https://github.dev/${repo.owner.login}/${repo.name}`;

    try {
      window.open(codespacesUrl, "_blank");
    } catch (error) {
      toast.error("Unable to open repository in GitHub Codespaces. Please ensure you have access.");
    }
  };

  return (
    <li className="mb-10 ms-7">
      <span
        className="absolute flex items-center justify-center w-6 h-6 bg-blue-100
        rounded-full -start-3 ring-8 ring-white"
      >
        <FaCodeBranch className="w-5 h-5 text-blue-800" />
      </span>
      <div className="flex flex-wrap items-center gap-2">
        <a
          href={repo.html_url}
          target="_blank"
          rel="noreferrer"
          className="break-all text-base font-semibold sm:text-lg"
        >
          {repo.name}
        </a>
        <span
          className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5
          py-0.5 rounded-full flex items-center gap-1"
        >
          <FaRegStar /> {repo.stargazers_count}
        </span>
        <span
          className="bg-purple-100 text-purple-800 text-xs font-medium
          px-2.5 py-0.5 rounded-full flex items-center gap-1"
        >
          <FaCodeFork /> {repo.forks_count}
        </span>
        <span
          onClick={() => handleCloneClick(repo)}
          className="cursor-pointer bg-green-100 text-green-800 text-xs
          font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1"
        >
          <FaCopy /> Clone
        </span>
      </div>

      <time
        className="block my-1 text-xs font-normal leading-none
        text-gray-400"
      >
        Released on {formattedDate}
      </time>

      <p className="mb-4 text-sm font-normal text-gray-400 sm:text-base">
        {repo.description
          ? repo.description.slice(0, 500)
          : "No description provided"}
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => handleOpenInVSCode(repo)}
          className="bg-glass inline-flex cursor-pointer items-center gap-2 rounded-md border border-blue-400 p-2 text-xs font-medium"
        >
          <FaEye size={16} />
          Open in VS Code (Web)
        </button>
        {PROGRAMMING_LANGUAGES[repo.language] ? (
          <img
            src={PROGRAMMING_LANGUAGES[repo.language]}
            alt="Programming language icon"
            className="h-8"
          />
        ) : null}
      </div>
    </li>
  );
};

export default Repo;
