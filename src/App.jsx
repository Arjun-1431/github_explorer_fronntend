import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Analysis from "./components/Analysis";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/HomePage";
import ExplorePage from "./pages/ExplorePage";
import LikesPage from "./pages/LikesPage";

import Sidebar from "./components/Sidebar";
import { useAuthContext } from "./context/AuthContext";

function App() {
	const { authUser, loading } = useAuthContext();

	if (loading) return null;

	return (
		<div className='min-h-screen md:flex'>
			<Sidebar />
			<div className='mx-auto w-full max-w-7xl flex-1 px-3 pb-6 pt-3 text-white transition-all duration-300 sm:px-4 md:my-5 md:px-6'>
				<Routes>
					<Route path='/' element={<HomePage />} />
					<Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to={"/"} />} />
					<Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />} />
					<Route path='/explore' element={authUser ? <ExplorePage /> : <Navigate to={"/login"} />} />
					<Route path='/likes' element={authUser ? <LikesPage /> : <Navigate to={"/login"} />} />
					<Route path='/analysis' element={<Analysis />} />
					<Route path='/analysis/:username' element={<Analysis />} />
				</Routes>
				<Toaster />
			</div>
		</div>
	);
}

export default App;
