
// ---------------------------------------------------------------------------------------------------------------------
// RIGHT COLUMN
// ---------------------------------------------------------------------------------------------------------------------


function unsubscribeListElement(self) {
    let feedUrl = $(self).parent().data().feedUrl;
    allFavoritePodcasts.removeByFeedUrl(feedUrl);
}

function unsubscribeContextMenu(feedUrl) {
    allFavoritePodcasts.removeByFeedUrl(feedUrl);
    showFavoritesPage();
}

function setHeartContent(self, emptyHeart) {
    $(self)
        .stop()
        .removeAttr('style')
    
    if(emptyHeart) {
        $(self).animate(
            {opacity: 0.4}, 
            150, 
            function() {
                $(self)
                    .html($(s_Heart).html())
                    .animate(
                        {opacity: 0.6}, 
                        150, 
                        function () {
                            $(self).removeAttr('style');
                        });
            }
        );
    } else 
        $(self).html($(s_FullHeart).html());
}

// ---------------------------------------------------------------------------------------------------------------------
// PODCAST ENTRY
// ---------------------------------------------------------------------------------------------------------------------

function getPodcastElement(artwork, title) {
    return $(`
        <li class="podcast-entry">
            <div class="podcast-entry-header">
                <img src="${artwork}">
                <div class="podcast-entry-title">${title}</div>
            </div>
            <div class="podcast-entry-actions">
                ${s_FullHeart}
            </div>
        </li>
    `).get(0);
}

function getStatisticsHeaderElement(title) {
    return $(`
        <li class="statistics-header">
            <div class="statistics-entry-title">${title}</div>
        </li>
    `).get(0);
}

function getStatisticsEntryElement(title, value) {
    return $(`
        <li class="statistics-entry">
            <div class="statistics-entry-title">${title}</div>
            <div class="statistics-entry-value">${value}</div>
        </li>
    `).get(0);
}
