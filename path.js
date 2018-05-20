var path = require('path');
var fs = require('fs');

// var cache = {};

// function store(key, value) {
//     cache[path.normalize(key)] = value;
// }

// store('bar/bar', 1);
// store('bar//baz//../bar', 2);
// store('bar//baz/../bar', 3);
// console.log(cache); // => { "bar/bar": 3 }



// var path1 = path.join('bar/', 'baz/', '../bar'); // => "bar/bar"
// console.log(path1);



// var extname = path.extname('bar/bar.js'); // => ".js"
// console.log(extname);



// function travel(dir, callback) {
//     fs.readdirSync(dir).forEach((file) => {
//         var pathname = path.join(dir, file);
//         if (fs.statSync(pathname).isDirectory()) {
//             travel(pathname, callback);
//         } else {
//             callback(pathname);
//         }
//     });
// }

// travel(process.argv[2], function (file) {
//     console.log(file);
// });



// function readText(pathname) {
//     var bin = fs.readFileSync(pathname);
//     if (bin[0] === 0xEF && bin[1] === 0xBB && bin[2] === oxBF) {
//         console.log('delete BOM!');
//         bin = bin.slice(3);
//     }
//     return bin.toString('utf-8');
// }
// var result = readText(process.argv[2]);
// console.log(result);



// //编码测试
// var iconv = require('iconv-lite');

// function readGBKText(pathname) {
//     var bin = fs.readFileSync(pathname);

//     return iconv.decode(bin, 'gbk');
// }
// var result = readGBKText(process.argv[2]);
// console.log(result);


// //foo
// function replace(pathname) {
//     var str = fs.readFileSync(pathname, 'binary');
//     // str = str.replace('foo', 'bar');
//     str = str.replace(new RegExp('foo', 'g'), 'bar');
//     fs.writeFileSync(pathname, str, 'binary');
// }
// replace(process.argv[2]);