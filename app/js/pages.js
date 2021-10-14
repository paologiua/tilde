
/*
 *  Body
 */

function clearBody() {
    $('#content-right #content-right-body #list').html('');
}

function setBody(bodyHtml) {
    $('#content-right #content-right-body #list').html(bodyHtml);
}

function getBody() {
    return $('#content-right #content-right-body #list').html();
}

function setNothingToShowBody(icon, id) {
    if(!id || !$('#' + id).get(0)) {
        id = !id ? '' : id;

        setGridLayout(false);
        let $body = 
        `<span id="${id}" class="nothing-to-show">
            <br>
            ${icon}
            <br><br>
            ${i18n.__('Nothing to show')}
        </span>`;

        if(id === 'feed-nothing-to-show') 
            allFeeds.ui.getHeader().after($body);
        else
            setBody($body);
    }
}

/*
 *  Header
 */

function clearHeader() {
    $('#content-right #content-right-header h1').html('');
}

function setHeader(headerHtml, buttonHtml) {
    if(headerHtml != undefined)
        $('#content-right #content-right-header h1').html(headerHtml);

    if(buttonHtml != undefined)
        $('#content-right #content-right-header div').html(buttonHtml);
}

function getHeader() {
    return $('#content-right #content-right-header h1').html();
}

function generateHtmlTitle(title) {
    return '<span>' + i18n.__(title) + '</span>'
}

/*
 *  Page
 */

function showPage(headerHtml, bodyHtml) {
    setHeader(headerHtml)
    setBody(bodyHtml)
}

function setScrollPositionOnTop() {
    $('#content-right').scrollTop(0);
}

function removeContentRightHeader() {
    $('#content-right').addClass('header-null');
}

function setContentRightHeader() {
    $('#content-right').removeClass('header-null'); 
}