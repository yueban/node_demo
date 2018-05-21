// process.on('SIGTERM', function () {
//     cleanUp();
//     process.exit(0);
// });


process.on('message', function (msg) {
    msg.hello = msg.hello.toUpperCase();
    process.send(msg);
});