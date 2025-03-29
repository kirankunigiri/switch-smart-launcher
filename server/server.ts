import { networkInterfaces } from "os";
import { mkdir } from "node:fs/promises";
import { GameUS, getGamesAmerica } from 'nintendo-switch-eshop';

// Function to get local IP address
function getLocalIP() {
	const interfaces = networkInterfaces();
	for (const name of Object.keys(interfaces)) {
		for (const net of interfaces[name] ?? []) {
			if (net.family === 'IPv4' && !net.internal) {
				return net.address;
			}
		}
	}
	return 'localhost';
}

const corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "POST, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type",
};

// Ensure the json directory exists
const JSON_DIR = "./server/json";
try {
	await mkdir(JSON_DIR, { recursive: true });
	console.log("JSON directory ready at:", JSON_DIR);
} catch (error) {
	console.error("Error creating directory:", error);
}

const server = Bun.serve({
	port: 3000,
	// Using the routes object for cleaner routing (available in Bun v1.2.3+)
	routes: {
		"/": new Response("Send a POST request to /api with JSON data", {
			headers: corsHeaders
		}),

		"/api": {
			// Handle preflight OPTIONS request
			OPTIONS: () => {
				return new Response(null, {
					headers: corsHeaders
				});
			},
			// Handle POST request
			POST: async (req) => {
				const body = await req.json();
				console.log("Received JSON data:", body);

				// Create a formatted JSON string
				const jsonString = JSON.stringify(body, null, 2);

				// Get current timestamp for filename
				const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
				const filename = `applications-${timestamp}.json`;
				const filepath = `${JSON_DIR}/${filename}`;

				// Save the file locally
				await Bun.write(filepath, jsonString);
				console.log(`File saved as: ${filepath}`);

				return Response.json({
					success: true,
					message: `Data received and saved as ${filename}`,
					path: filepath
				}, {
					headers: corsHeaders
				});
			}
		},
		"/games": {
			// Handle GET request
			GET: async () => {
				try {
					const games = await getGamesAmerica();
					return Response.json(games, {
						headers: corsHeaders
					});
				} catch (error) {
					return Response.json({
						success: false,
						error: "Failed to fetch games"
					}, {
						status: 500,
						headers: corsHeaders
					});
				}
			}
		}
	},
});

const localIP = getLocalIP();
console.log(`Server running at:`);
console.log(`  • Local:   http://localhost:${server.port}`);
console.log(`  • Network: http://${localIP}:${server.port}`);