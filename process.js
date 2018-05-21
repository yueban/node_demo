var child_process = require('child_process');
// var util = require('util');

// function copy(source, target, callback) {
//     child_process.exec(
//         util.format('cp -r %s/* %s', source, target), callback);
// }

// var argvs = process.argv.slice(2);

// copy(argvs[0], argvs[1], function (err) {
//     console.log(err);
// });



// try {
//     throw new Error('boom!');
// } catch (err) {
//     // ...
//     process.exit(1);
// }



// var child = child_process.spawn('node', ['xxx.js']);

// child.stdout.on('data', function (data) {
//     console.log('stdout: ' + data);
// });

// child.stderr.on('data', function (data) {
//     console.log('stderr: ' + data);
// });

// child.on('close', function (code) {
//     console.log('child process exited with code ' + code);
// });



// var child = child_process.spawn('node', ['child_process.js']);

// child.stdout.on('data', function (data) {
//     console.log('stdout: ' + data);
// });

// child.stderr.on('data', function (data) {
//     console.log('stderr: ' + data);
// });

// child.on('close', function (code) {
//     console.log('child process exited with code ' + code);
// });

// child.on('SIGPIPE', () => {
//     console.log('Received SIGINT. Press Control-D to exit.');
// });

// child.kill('SIGTERM');



var child = child_process.spawn('node', ['child_process.js'], {
    sudio: [0, 1, 2, 'ipc']
});

child.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
});

child.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
});

child.on('close', function (code) {
    console.log('child process exited with code ' + code);
});

child.on('message', function (msg) {
    console.log(msg);
});

// child.send({
//     hello: 'hello'
// });