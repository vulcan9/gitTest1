// Including libraries
// http://manijshrestha.wordpress.com/tag/socket-io/


var app = require('http').createServer(handler),
	io = require('socket.io').listen(app),
	static = require('node-static'); // for serving files




// This will make all the files in the current folder
// accessible from the web
var fileServer = new static.Server('./');
	
// This is the port for our web server.
// you will need to go to http://localhost:8080 to see it
app.listen(8080);
console.log("서버가 실행 되었습니다.");

// If the URL of the socket server is opened in a browser
function handler (request, response) {
	//response.writeHead(200, {'Content-Type': 'text/plain'}); + '\n';
	//response.end('Hello World\n');
	
	request.addListener('end', function () {
        fileServer.serve(request, response);
    });
	request.resume();
	
	// or
	//fileServer.serve(request, response);
}

// Delete this row if you want to see debug messages
io.set('log level', 1);

// Listen for incoming connections from clients
io.sockets.on('connection', function (socket) {

	// Start listening for mouse move events
	socket.on('mousemove', function (data) {
		
		// This line sends the event (broadcasts it)
		// to everyone except the originating client.
		socket.broadcast.emit('moving', data);
	});
});