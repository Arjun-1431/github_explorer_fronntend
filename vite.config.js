import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");
	const apiProxyTarget =
		env.VITE_API_PROXY_TARGET?.trim() || "http://127.0.0.1:5000";

	return {
		plugins: [react()],
		server: {
			port: 3000,
			proxy: {
				"/api": {
					target: apiProxyTarget,
					changeOrigin: true,
					secure: apiProxyTarget.startsWith("https://"),
				},
			},
		},
	};
});
