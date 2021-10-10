function makeRequest(url, callback, error) {
    $.get(url, (data) => {
        callback(data, url);
    }, "text").fail(function(e) {
        if(error)
            error(e);
    });;
}