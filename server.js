const http = require("http");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const mysql = require("mysql");



var mimeLookup = {
	".js": "application/javascript",
	".html": "text/html",
	".css": "text/css"
};

function send404(response, request) {
	response.writeHead(404, {
		"Content-Type": "text/plain"
	});
	response.write("Error 404: Resource not found.");
	console.info(
		`${new Date().getHours()}:${new Date().getMinutes()}  just sent err404 on ${
      request.url
    }`
	);
}

function queryGenerator(mode, arr = new Object()) {
	if (arr.id == undefined) {
		arr.id = "NULL";
	}
	if (arr.mother == undefined) {
		arr.mother == "NULL";
	}
	switch (mode) {
		case "read":
			return `SELECT * FROM company`;

		case "add":
			return `INSERT INTO company (name, own_earnings, mother) VALUES \
							('${arr.name}',${arr.own_earnings},'${arr.mother}')`;

		case "edit":
			if (arr.new_name != undefined && arr.new_earnings != undefined) {
				return `UPDATE company SET own_earnings = ${arr.new_earnings}\
								WHERE id = ${arr.id} OR name = '${arr.name}';\
								UPDATE company SET name = '${arr.new_name}' WHERE id = ${ arr.id} \
								OR name = '${arr.name}'`;
			} else if (arr.new_name != undefined) {
				console.log(`UPDATE company SET name = '${arr.ew_name}'\
				WHERE id = ${arr.id} OR name = '${arr.name}'`);

				return `UPDATE company SET name = '${arr.new_name}'\
								WHERE id = ${arr.id} OR name = '${arr.name}'`;
			} else if (arr.new_earnings != undefined) {
				return `UPDATE company SET own_earnings = ${ arr.new_earnings} \
								WHERE id = ${arr.id} OR name = '${arr.name}'`;
			}
			return queryGenerator("read");

		case "delete":
			return `DELETE FROM company WHERE name = \ 
			'${arr.name}' OR id = ${arr.id} OR mother = '${arr.mother}'`;

		default:
			return queryGenerator("read");
	}
}

var connectionToDB = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USERNAME,
	password: process.env.DB_PWD,
	database: process.env.DB_NAME,
	port: process.env.DB_PORT
})
connectionToDB.connect((err) => {
	if (err) throw err;
	console.log(`${new Date().getHours()}:${new Date().getMinutes()}  just connected to DB`);
})

var server = http
	.createServer(function (req, res) {
		new Promise(resolve => {
			if (req.url == "/favicon.ico") {
				send404(res, req);
				return;
			}

			if (req.method == "GET") {
				let fileurl;
				if (req.url == "/") {
					fileurl = "./index.html";
				} else {
					fileurl = req.url;
				}

				var filepath = path.resolve("./" + fileurl);
				var fileExt = path.extname(filepath);
				var mimeType = mimeLookup[fileExt];

				fs.exists(filepath, function (exists) {
					if (!exists) {
						send404(res, req);
						return;
					}
					res.writeHead(200, {
						"content-type": mimeType
					});
					fs.createReadStream(filepath).pipe(res);
					console.log(
						`${new Date().getHours()}:${new Date().getMinutes()}  just sent a ${fileurl}`
					);
				});
			}

			if (req.method == "POST") {
				let body = "";
				req.on("data", data => {
					body += data;
				});
				req.on("end", () => {
					body = JSON.parse(body);
					connectionToDB.query(queryGenerator(body.mode, body.arr), (err, result) => {
						if (err) {
							res.writeHead(200, {
								"content-type": "text/plain"
							});
							res.write(JSON.stringify('some error happen'));
							console.error(
								`${new Date().getHours()}:${new Date().getMinutes()}  just sent error message on DB request: ${err}`
							);
						} else {
							res.writeHead(200, {
								"content-type": "application/json"
							});
							res.write(JSON.stringify(result));
							console.info(
								`${new Date().getHours()}:${new Date().getMinutes()}  just sent res of db query`
							);
						}
					})

				});
			}
		}).then(() => {
			res.end();
		});
	})
	.listen(process.env.PORT);

console.info(
	`${new Date().getHours()}:${new Date().getMinutes()}  server running ${
    process.env.PORT
  }`
);