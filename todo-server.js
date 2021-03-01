let tdList = [{name: "Submit Tutorial #2", checked: false, highlighted: "white", order: 0, time: 1000}];

const http = require('http');
const fs = require("fs");

function send404(response){
	response.statusCode = 404;
	response.write("Unknown resource.");
	response.end();
}

//Create a server, giving it the handler function
//Request represents the incoming request object
//Response represents the outgoing response object
//Remember, you can break this apart to make it look cleaner
const server = http.createServer(function (request, response) {
	console.log(request.url);
	if(request.method === "GET"){
		if(request.url === "/" || request.url === "/todo.html"){
			//read the todo.html file and send it back
			fs.readFile("todo.html", function(err, data){
				if(err){
					response.statusCode = 500;
					response.write("Server error.");
					response.end();
					return;
				}
				response.statusCode = 200;
				response.setHeader("Content-Type", "text/html");
				response.write(data);
				response.end();
			});
		}else if(request.url === "/content.js"){
			//read todo.js file and send it back
			fs.readFile("content.js", function(err, data){
				if(err){
					response.statusCode = 500;
					response.write("Server error.");
					response.end();
					return;
				}
				response.statusCode = 200;
				response.setHeader("Content-Type", "application/javascript");
				response.write(data);
				response.end();
			});
		//Add any more 'routes' and their handling code here
		//e.g., GET requests for "/list", POST request to "/list"
		}else if(request.url === "/style.css"){
			fs.readFile("style.css", function(err, data){
				if(err){
					response.statusCode = 500;
					response.write("Server error.");
					response.end();
					return;
				}
				response.statusCode = 200;
				response.setHeader("Content-Type", "text/css");
				response.write(data);
				response.end();
			});
		}else if (request.url === "/tasks"){
			response.statusCode = 200;
			response.write(JSON.stringify(tdList));
			response.end();
		}else {
			response.statusCode = 404;
			response.write("Unknwn resource.");
			response.end();
		}
	}else if(request.method === "POST"){
		if (request.url === "/tasks"){
			let body = "";
			request.on('data', (chunk) => {
				body += chunk;
			})
			request.on('end', () => {
				let newTask = JSON.parse(body);
				tdList.push(newTask);
			})
			response.statusCode = 201;
			response.end();
		}else{
			send404(response);
		}
	}else if (request.method === "PUT"){
		if (request.url === "/remove"){
			let body = "";
			request.on('data', (chunk) => {
				body += chunk;
			})
			request.on('end', () => {
				let nums = JSON.parse(body);
				for (let i = nums.length - 1; i >= 0; i--){
					tdList.splice(nums[i], 1);
				}
				for (let i = 0; i < tdList.length; i++){
					tdList[i].order = i;
				}
			})
			response.statusCode = 200;
			response.end();
		}else if (request.url === "/highlight"){
			let body = "";
			request.on('data', (chunk) => {
				body += chunk;
			})
			request.on('end', () => {
				let hl = JSON.parse(body);
				tdList[hl.num].highlighted = hl.color;
			})
			response.statusCode = 200;
			response.end();
		}else if (request.url === "/check"){
			let body = "";
			request.on('data', (chunk) => {
				body += chunk;
			})
			request.on('end', () => {
				let check = JSON.parse(body);
				tdList[check.num].checked = check.check;
			})
			response.statusCode = 200;
			response.end();
		}else {
			send404(response);
		}
	}else {
		send404(response);
	}
});

//Server listens on port 3000
server.listen(3000);
console.log('Server running at http://127.0.0.1:3000/');