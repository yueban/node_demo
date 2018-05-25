var enableLog = false;

function log(message, ...optionalParams) {
    if (enableLog) {
        if (optionalParams.length > 0) {
            console.log(message, optionalParams);
        } else {
            console.log(message);
        }
    }
}

exports.log = log;