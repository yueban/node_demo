var http = require('http');

/* --------- http start --------- */

// http.createServer(function (request, response) {
//     response.writeHead(200, {
//         'Content-Type': 'text-plain'
//     });
//     response.end('Hello World\n');
// }).listen(8124);



// http.createServer(function (request, response) {
//     var body = [];

//     console.log(request.method);
//     console.log(request.headers);

//     request.on('data', function (chunk) {
//         console.log('on event data');
//         body.push(chunk);
//     });

//     request.on('end', function () {
//         body = Buffer.concat(body);
//         console.log('on event end');
//         console.log(body.toString());
//     });

//     response.writeHead(200, {
//         'Content-Type': 'text-plain'
//     });
//     response.end('Hello World\n');
// }).listen(8124);



// http.createServer(function (request, response) {
//     response.writeHead(200, {
//         'Content-Type': 'text/plain'
//     });

//     request.on('data', function (chunk) {
//         response.write(chunk);
//     });

//     request.on('end', function () {
//         response.end();
//     });
// }).listen(8124);



// var options = {
//     hostname: 'www.baidu.com',
//     port: 80,
//     paht: '/',
//     method: 'GET',
//     headers: {
//         'Content-Type': 'application/x-www-form-urlencoded'
//     }
// }
// var request = http.request(options, function (response) {
//     console.log('response:\n' + response.toString());
// });
// request.write('Hello World');
// request.end();



// http.get('http://www.baidu.com/', function (response) {
//     console.log('response:\n' + response);
// });



// http.get('http://127.0.0.1:8124', function (response) {
//     var body = [];

//     console.log(response.statusCode);
//     console.log(response.headers);

//     response.on('data', function (chunk) {
//         console.log('-------data-------');
//         body.push(chunk);
//     });

//     response.on('end', function () {
//         console.log('-------end-------');
//         body = Buffer.concat(body);
//         console.log(body.toString());
//     });
// });

/* --------- http end --------- */



/* --------- https start --------- */

// var https = require('https');

// var options = {
//     key: fs.readFileSync('./ssl/default.key'),
//     cert: fs.readFileSync('./ssl/default.cer')
// };

// var server = https.createServer(options, function (request, response) {
//     // ...
// });

// server.addContext('foo.com', {
//     key: fs.readFileSync('./ssl/foo.com.key'),
//     cert: fs.readFileSync('./ssl/foo.com.cer')
// });

// server.addContext('bar.com', {
//     key: fs.readFileSync('./ssl/bar.com.key'),
//     cert: fs.readFileSync('./ssl/bar.com.cer')
// });

// server.listen('8124');

// //request
// var options = {
//     hostname: '127.0.0.1',
//     port: 8124,
//     path: '/',
//     method: 'GET',
//     // rejectUnauthorized: false
// };

// var request = https.request(options, function (response) {});

// request.end();

/* --------- https end --------- */



/* --------- url start --------- */

// var url = require('url');

// console.log(url.parse('http://user:pass@host.com:8080/p/a/t/h?query=string#hash'));



// http.createServer(function (request, response) {
//     var tmp = request.url;
//     var parsedUrl = url.parse(tmp);
//     console.log(parsedUrl);
// }).listen(8124);



// var urlObj = url.format({
//     protocol: 'http:',
//     host: 'www.example.com',
//     pathname: '/p/a/t/h',
//     search: 'query=string'
// });
// console.log(urlObj);



// var urlResovled = url.resolve('http://www.example.com/foo/bar', '../baz/123');
// console.log(urlResovled);

/* --------- url end --------- */



/* --------- queryString start --------- */

// var querystring = require('querystring');

// var queryObj = querystring.parse('foo=bar&baz=qux&baz=quux&corge');
// console.log(queryObj);

// var queryStr = querystring.stringify({
//     foo: 'bar',
//     baz: ['qux', 'quux'],
//     corge: ''
// });
// console.log(queryStr);

/* --------- queryString end --------- */



/* --------- zlib end --------- */

// var zlib = require('zlib');

// http.createServer(function (request, response) {
//     var i = 1024;
//     var data = '';

//     while (i--) {
//         data += '.';
//     }

//     if ((request.headers['accept-encoding'] || '').indexOf('gzip') !== -1) {
//         zlib.gzip(data, function (err, data) {
//             response.writeHead(200, {
//                 'Content-Type': 'text/plain',
//                 'Content-Encoding': 'gzip'
//             });
//             response.end(data);
//         });
//     } else {
//         response.writeHead(200, {
//             'Content-Type': 'text/plain'
//         });
//         response.end(data);
//     }
// }).listen(8124);



// var options = {
//     hostname: 'www.baidu.com',
//     path: '/',
//     port: 80,
//     method: 'GET',
//     headers: {
//         'Accept-Encoding': 'gzip, deflate'
//     }
// }
// http.request(options, function (response) {
//     var body = [];

//     response.on('data', function (chunk) {
//         body.push(chunk);
//     });

//     response.on('end', function () {
//         body = Buffer.concat(body);

//         if (response.headers['content-encoding'] === 'gzip') {
//             console.log('gzip decoded------>');
//             zlib.gunzip(body, function (err, data) {
//                 console.log(data.toString());
//             });
//         } else {
//             console.log('not support gzip------>');
//             console.log(body.toString());
//         }
//     });
// }).end();

/* --------- zlib end --------- */



/* --------- net start --------- */

// var net = require('net');
// net.createServer(function (conn) {
//     conn.on('data', function (data) {
//         conn.write([
//             'HTTP/1.1 200 OK',
//             'Content-Type: text/plain',
//             'Content-Length: 11',
//             '',
//             'Hello World'
//         ].join('\n'));
//     });
// }).listen(8124);

// var options = {
//     hostname: '127.0.0.1',
//     port: 8124,
// };
// var client = net.connect(options, function () {
//     client.write([
//         'GET / HTTP/1.1',
//         'User-Agent: curl/7.26.0',
//         'Host: www.baidu.com',
//         'Accept: */*',
//         '',
//         ''
//     ].join('\n'));
// });
// client.on('data', function (data) {
//     console.log(data.toString());
//     client.end();
// });

/* --------- net end --------- */