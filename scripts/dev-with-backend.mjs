import { spawn } from "child_process";
import { existsSync } from "fs";
import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDir = path.resolve(__dirname, "..");
const rootDir = path.resolve(frontendDir, "..");

const processes = [];
let shuttingDown = false;

function prefixStream(stream, label) {
	const rl = readline.createInterface({ input: stream });
	rl.on("line", (line) => {
		console.log(`[${label}] ${line}`);
	});
}

function spawnProcess({ label, cwd, scriptPath, args = [] }) {
	if (!existsSync(scriptPath)) {
		throw new Error(`${label} script not found: ${scriptPath}`);
	}

	const child = spawn(process.execPath, [scriptPath, ...args], {
		cwd,
		env: process.env,
		stdio: ["inherit", "pipe", "pipe"],
	});

	processes.push(child);
	prefixStream(child.stdout, label);
	prefixStream(child.stderr, `${label}:err`);

	child.on("exit", (code, signal) => {
		if (shuttingDown) {
			return;
		}

		if (code && code !== 0) {
			console.error(`[${label}] exited with code ${code}`);
			shutdown(code);
			return;
		}

		if (signal) {
			console.error(`[${label}] exited with signal ${signal}`);
			shutdown(0);
		}
	});

	child.on("error", (error) => {
		if (shuttingDown) {
			return;
		}

		console.error(`[${label}] failed to start: ${error.message}`);
		shutdown(1);
	});
}

function shutdown(exitCode = 0) {
	if (shuttingDown) {
		return;
	}

	shuttingDown = true;

	for (const child of processes) {
		if (!child.killed) {
			child.kill("SIGTERM");
		}
	}

	setTimeout(() => process.exit(exitCode), 250);
}

async function isBackendRunning() {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), 1500);

	try {
		const response = await fetch("http://127.0.0.1:5000/api/auth/check", {
			signal: controller.signal,
		});
		return response.ok;
	} catch {
		return false;
	} finally {
		clearTimeout(timeoutId);
	}
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

if (!(await isBackendRunning())) {
	spawnProcess({
		label: "backend",
		cwd: rootDir,
		scriptPath: path.join(rootDir, "node_modules", "nodemon", "bin", "nodemon.js"),
		args: ["backend/server.js"],
	});
} else {
	console.log("[backend] Reusing existing server on http://127.0.0.1:5000");
}

spawnProcess({
	label: "frontend",
	cwd: frontendDir,
	scriptPath: path.join(frontendDir, "node_modules", "vite", "bin", "vite.js"),
});
