import { Link } from "react-router-dom";
import { IoHomeSharp } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import { MdOutlineExplore } from "react-icons/md";
import { PiSignInBold } from "react-icons/pi";
import { MdEditDocument } from "react-icons/md";
import Logout from "./Logout";
import { useAuthContext } from "../context/AuthContext";

const Sidebar = () => {
	const { authUser } = useAuthContext();

	return (
		<aside
			className='sticky top-0 z-20 border-b border-white/10 bg-glass px-3 py-3 backdrop-blur md:left-0 md:h-screen md:min-w-16 md:border-b-0 md:border-r md:px-0 md:py-8'
		>
			<nav className='flex items-center justify-between gap-3 md:h-full md:flex-col'>
				<Link to='/' className='flex justify-center md:mb-2'>
					<img className='h-8' src='/github.svg' alt='Github Logo' />
				</Link>

				<div className='flex items-center gap-2 md:flex-col md:gap-3'>
					<Link
						to='/'
						className='flex justify-center rounded-lg p-1.5 transition-colors duration-200 hover:bg-gray-800'
					>
						<IoHomeSharp size={20} />
					</Link>

					{authUser && (
						<Link
							to='/likes'
							className='flex justify-center rounded-lg p-1.5 transition-colors duration-200 hover:bg-gray-800'
						>
							<FaHeart size={22} />
						</Link>
					)}

					{authUser && (
						<Link
							to='/explore'
							className='flex justify-center rounded-lg p-1.5 transition-colors duration-200 hover:bg-gray-800'
						>
							<MdOutlineExplore size={25} />
						</Link>
					)}

					{!authUser && (
						<Link
							to='/login'
							className='rounded-lg p-1.5 transition-colors duration-200 hover:bg-gray-800'
						>
							<PiSignInBold size={25} />
						</Link>
					)}

					{!authUser && (
						<Link
							to='/signup'
							className='rounded-lg p-1.5 transition-colors duration-200 hover:bg-gray-800'
						>
							<MdEditDocument size={25} />
						</Link>
					)}
				</div>

				{authUser && (
					<div className='flex items-center gap-2 md:mt-auto md:flex-col'>
						<Logout />
					</div>
				)}
			</nav>
		</aside>
	);
};
export default Sidebar;
