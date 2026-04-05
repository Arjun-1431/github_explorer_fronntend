import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
	const [authUser, setAuthUser] = useState(null);
	const [userProfile, setUserProfile] = useState(null);
	const [analysisData, setAnalysisData] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const checkUserLoggedIn = async () => {
			setLoading(true);

			try {
				const res = await fetch("/api/auth/check", {
					credentials: "include",
					cache: "no-store",
				});
				const data = await res.json();
				setAuthUser(data.user);
			} catch (error) {
				toast.error(error.message);
			} finally {
				setLoading(false);
			}
		};

		checkUserLoggedIn();
	}, []);

	return (
		<AuthContext.Provider
			value={{
				authUser,
				setAuthUser,
				loading,
				userProfile,
				setUserProfile,
				analysisData,
				setAnalysisData,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
