var fs = require('fs');
var http = require('http');
var path = require('path');
var url = require('url');
var querystring = require('querystring');
var utils = require('./util/utils');

// var MIME = {
//     '.css': 'text/css',
//     '.js': 'application/javascript'
// }

function start(route, handle) {
    var configPath = path.join(__dirname, 'config.json');
    var config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    var root = config.root || path.join(__dirname);
    var port = config.port || '80';

    var server = http.createServer(function (request, response) {
        var pathname = url.parse(request.url).pathname;

        utils.log("Request for " + pathname + " received");

        route(handle, pathname, response, request);
    });

    server.listen(port);
    utils.log("Server listened on " + port);
}

exports.start = start;