var fs = require('fs');

function copy(src, dst) {
    // try {
    //     console.log(fs.statSync(src));
    // } catch (err) {
    //     console.log("error on fs.statSync");
    // }

    fs.stat(src, (err, stat) => {
        if (err) {
            console.log("error on fs.stat");
        } else {
            console.log(stat);
        }
    });

    var rs = fs.createReadStream(src);
    var ws = fs.createWriteStream(dst);

    rs.on('data', function (chunk) {
        // rs.pause();
        // doSth(chunk, function () {
        //     rs.resume();
        // });

        if (ws.write(chunk) === false) {
            rs.pause();
        }
    });

    rs.on('end', function () {
        // cleanUp();

        ws.end();
    });

    ws.on('drain', function () {
        rs.resume();
    });
}

function main(argv) {
    copy(argv[0], argv[1]);
}

main(process.argv.slice(2));