// server.js

// Helper untuk mengirim response JSON
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status: status,
    headers: {
      "Content-Type": "application/json",
      // Tambahkan CORS header agar bisa diakses dari Vite (port berbeda)
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

const server = Bun.serve({
  port: 3000,
  fetch(req) {
    const url = new URL(req.url);

    // Handle preflight request untuk CORS
    if (req.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    // 404 Not Found untuk route lainnya
    return jsonResponse({ message: "Not Found" }, 404);
  },
});
console.log(`Server running at http://localhost:${server.port}`);
