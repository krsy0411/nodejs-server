const http = require("http");
const PORT = 4000;
const server = http.createServer((req, res) => {
	if (req.url === "/") {
		res.writeHead(200, {
			"Content-Type": "text/plain",
		});
		res.end("Hello World\n");
	} else if (req.url === "/home") {
		res.writeHead(200, {
			"Content-Type": "application/json",
		});

		res.end(JSON.stringify({ message: "Welcome to the home page" }));
	} else if (req.url === "/about") {
		res.setHeader("Content-Type", "text/html");
		res.write("<html>");
		res.write("<head><title>About</title></head>");
		res.write("<body><h1>About Page</h1></body>");
		res.write("</html>");
	} else {
		res.statusCode = 404;
		res.end();
	}
});

server.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
