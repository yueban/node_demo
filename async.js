// function heavyCompute(n) {
//     var count = 0;

//     for (i = 0; i < n; i++) {
//         for (j = 0; j < n; j++) {
//             count += 1;
//         }
//     }
// }

// var t = new Date();

// setTimeout(function () {
//     console.log(new Date() - t);
// }, 1000);

// heavyCompute(30000);



// function async (fn, callback) {
//     setTimeout(() => {
//         try {
//             callback(null, fn());
//         } catch (error) {
//             callback(error);
//         }
//     }, 1000);
// }

// async (null, function (err, data) {
//     if (err) {
//         console.log('Error:' + err);
//     } else {
//         console.log('data:' + data);
//     }
// });



/* --------- domain start --------- */

// process.on('uncaughtException', function (err) {
//     console.log('Error: %s', err.message);
// });

// setTimeout(function (fn) {
//     fn();
// });



// function async (request, callback) {
//     // Do something.
//     asyncA(request, function (data) {
//         // Do something
//         asyncB(request, function (data) {
//             // Do something
//             asyncC(request, function (data) {
//                 // Do something
//                 request();
//                 callback(data);
//             });
//         });
//     });
// }

// var domain = require('domain');

// var d = domain.create();

// d.on('error', (err) => {
//     console.log('Error in domain: ' + err);
// });

// d.run(() => {
//     async (function () {}, function (data) {
//         response.writeHead(200);
//         response.end(data);
//     });
// });

/* --------- domain end --------- */