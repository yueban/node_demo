var exec = require('child_process').exec;
var querystring = require('querystring');
var utils = require('./util/utils');
var fs = require('fs');
var path = require('path');
var formidable = require('formidable');

function start(response) {
    utils.log("Rquest handler 'start' was called");

    var body = '<html>' +
        '<head>' +
        '<meta http-equiv="Content-Type" content="text/html; ' +
        'charset=UTF-8" />' +
        '</head>' +
        '<body>' +
        '<form action="/upload" enctype="multipart/form-data" method="post">' +
        '<input type="file" name="upload" multiple="multiple" />' +
        '<input type="submit" value="Upload file" />' +
        '</form>' +
        '</body>' +
        '</html>';

    response.writeHead(200, {
        "Content-Type": "text/html"
    });
    response.write(body);
    response.end();
}

function upload(response, request) {
    utils.log("Rquest handler 'upload' was called");

    var form = new formidable.IncomingForm();
    form.parse(request, function (err, fields, files) {
        var newFilePath = path.join(__dirname, 'tmp', 'test.png');
        fs.renameSync(files.upload.path, newFilePath);
        response.writeHead(200, {
            "Content-Type": "text/html"
        });
        response.write("received image:<br/>");
        response.write("<img src='/show' />");
        response.end();
    });
}

function show(response) {
    utils.log("Rquest handler 'show' was called");

    var filePath = path.join(__dirname, 'tmp', 'test.png');
    fs.readFile(filePath, 'binary', function (err, file) {
        if (err) {
            response.writeHead(500, {
                "Content-Type": "text/plain"
            });
            response.write(err + "\n");
            response.end();
        } else {
            response.writeHead(200, {
                "Content-Type": "image/png"
            });
            response.write(file, 'binary');
            response.end();
        }
    });
}

exports.start = start;
exports.upload = upload;
exports.show = show;