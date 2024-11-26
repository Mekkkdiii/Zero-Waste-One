//import http package provided by Node
const http = require ('http'); //require = import. import http package and store in a variable

//imporrt the constant app
const app = require('./backend/app');

const port = 3000;

//to set the configuration for express
app.set('port', port)

//pass the app to create server
const server = http.createServer(app);

server.listen(port);