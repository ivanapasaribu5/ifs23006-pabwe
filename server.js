// server.js
const server = Bun.serve({
port: 3000,
fetch(req) {
const url = new URL(req.url);
// Route: Homepage
if (url.pathname === "/") {
return new Response(
`<html>
<body>
<h1>Halo!</h1>
<p>Saat ini saya sedang membuat aplikasi web sederhana dengan JS dan Bun.</p>
</body>
</html>`,
{ headers: { "Content-Type": "text/html" } }
);
}
// 404 Not Found
return new Response("404 Not Found", { status: 404 });
},
});
console.log(`Server running at http://localhost:${server.port}`);