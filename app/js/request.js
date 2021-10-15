function makeRequest(url, callback, error) {
    /* $.get(url, (data) => {
        callback(data, url);
    }, "text").fail(function(e) {
        if(error)
            error(e);
    }); */
    
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