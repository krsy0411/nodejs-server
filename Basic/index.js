const http = require("http");

let dataObject = {
	a: "a",
	b: "b",
};

const server = http.createServer((req, res) => {
	if (req.method === "POST" && req.url === "/home") {
		req.on("data", (data) => {
			console.log(data.toString());
			const stringifiedData = data.toString();
			Object.assign(dataObject, JSON.parse(stringifiedData));
		});
	} else {
		if (req.url === "/home") {
			res.statusCode = 200;
			res.setHeader("Content-Type", "application/json");
			res.end(JSON.stringify(dataObject));
		} else if (req.url === "/about") {
			res.statusCode = 200;
			res.setHeader("Content-Type", "text/html");
			res.write("<html>");
			res.write("<body>");
			res.write("<h1>About Page</h1>");
			res.write("</body>");
			res.write("</html>");
			res.end();
		} else {
			res.statusCode = 404;
			res.end();
		}
	}
});

server.listen(3000, () => {
	console.log("서버 실행!!!");
});
