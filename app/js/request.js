const request = require('request');
const progress = require('request-progress');

function makeRequest(url, callback, error) {
    $.ajax({
        url: url,
        method: "GET",
        dataType: "text",
        cache: false,
        success: (data) => {
            callback(data, url);
        },
        error: (e) => {
            if(error)
                error(e);
        }
    });
}

function downloadFile(url, path, error, end, _progress) {
    let stream = fs.createWriteStream(path);
    let _request = request({
        url: url,
        method: 'GET',
        agentOptions: {
            rejectUnauthorized: false,
            timeout: 5000
        }}/* , (e) => {
            if(!(e instanceof Error))
                success();
        } */)
        progress(_request).on('progress', (state) => {
            //console.log(state);
            if(_progress)
                _progress(state);
            /*
            {
                percentage: 0.5,        // Overall percentage (between 0 to 1)
                speed: 554732,          // The download speed in bytes/sec
                size: {
                    total: 90044871,      // The total payload size in bytes
                    transferred: 27610959 // The transferred payload size in bytes
                },
                time: {
                    elapsed: 36.235,      // The total elapsed seconds since the start (3 decimals)
                    remaining: 81.403     // The remaining seconds to finish (3 decimals)
                }
            }
            */
        
        }).on('error', function (e) {
            if(error)
                error(e);
        }).on('end', () => {
            if(end)
                end();
        }).pipe(stream);

        let download = {
            'stream': stream,
            'request': _request
        }

    return download;
}
