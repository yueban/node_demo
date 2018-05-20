var path = require('path');
var fs = require('fs');

var cache = {};

function store(key, value) {
    cache[path.normalize(key)] = value;
}

store('foo/bar', 1);
store('foo//baz//../bar', 2);
store('foo//baz/../bar', 3);
console.log(cache); // => { "foo/bar": 3 }



var path1 = path.join('foo/', 'baz/', '../bar'); // => "foo/bar"
console.log(path1);



var extname = path.extname('foo/bar.js'); // => ".js"
console.log(extname);



function travel(dir, callback) {
    fs.readdirSync(dir).forEach((file) => {
        var pathname = path.join(dir, file);
        if (fs.statSync(pathname).isDirectory()) {
            travel(pathname, callback);
        } else {
            callback(pathname);
        }
    });
}

travel(process.argv[2], function (file) {
    console.log(file);
});