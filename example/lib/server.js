var fs = require('fs');
var http = require('http');
var path = require('path');

var MIME = {
    '.css': 'text/css',
    '.js': 'application/javascript'
}

function main(argv) {
    var config = JSON.parse(fs.readFileSync(argv[0], 'utf-8'));
    var root = config.root || '.';
    var port = config.port || '80';
    var server;

    server = http.createServer((request, response) => {
        var urlInfo = parseURL(root, request.url);

        // combineFiles(urlInfo.pathnames, (err, data) => {
        //     if (err) {
        //         response.writeHead(404);
        //         response.end(err.message);
        //     } else {
        //         response.writeHead(200, {
        //             'Content-Type': urlInfo.mime
        //         });
        //         response.end(data);
        //     }
        // })

        validateFiles(urlInfo.pathnames, (err, pathnames) => {
            if (err) {
                response.writeHead(404);
                response.end(err.message);
            } else {
                response.writeHead(200, {
                    'Content-Type': urlInfo.mime
                });
                outputFiles(pathnames, response);
            }
        });
    }).listen(port);

    process.on('SIGTERM', function () {
        server.close(function () {
            process.exit(0);
        });
    });
}

// function combineFiles(pathnames, callback) {
//     var output = [];

//     (function next(i, length) {
//         if (i < length) {
//             fs.readFile(pathnames[i], (err, data) => {
//                 if (err) {
//                     callback(err);
//                 } else {
//                     output.push(data);
//                     next(i + 1, length);
//                 }
//             });
//         } else {
//             callback(null, Buffer.concat(output));
//         }
//     }(0, pathnames.length));
// }

function validateFiles(pathnames, callback) {
    (function next(i, length) {
        if (i < length) {
            console.log(path.resolve(pathnames[i]));
            fs.stat(pathnames[i], (err, stats) => {
                if (err) {
                    callback(err);
                } else if (!stats.isFile()) {
                    callback(new Error(pathnames[i] + 'is not a file'));
                } else {
                    next(i + 1, length);
                }
            });
        } else {
            callback(null, pathnames);
        }
    }(0, pathnames.length));
}

function outputFiles(pathnames, response) {
    (function next(i, length) {
        if (i < length) {
            var reader = fs.createReadStream(pathnames[i]);
            reader.pipe(response, {
                end: false
            });
            reader.on('end', () => {
                next(i + 1, length);
            });
        } else {
            response.end();
        }
    }(0, pathnames.length));
}

function parseURL(root, url) {
    var base, pathnames, parts;

    if (url.indexOf('??') === -1) {
        url = url.replace('/', '/??');
    }

    parts = url.split('??');
    base = parts[0];
    pathnames = parts[1].split(',').map((value) => {
        return path.join(root, base, value);
    });

    return {
        mime: MIME[path.extname(pathnames[0])] || 'text/plain',
        pathnames: pathnames
    }
}


main(process.argv.slice(2));