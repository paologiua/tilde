var searchTimeoutVar = null;

function search(self, event) {
    if (event.code == "Escape")
        clearTextField(self);
    else {
        if(!$('#search-nothing-to-show').get(0))
            clearBody();

        setContentRightHeader();
        clearMenuSelection();
        setHeader(generateHtmlTitle("Search"), '');

        $('#res').attr('return-value', '');
        
        getPodcasts(self.value);
    }
}

function getPodcasts(searchTerm) {
    if(searchTimeoutVar)
        clearTimeout(searchTimeoutVar);

    if(!searchTerm) {
        showSearchNothingToShow();
        return;
    }

    searchTimeoutVar = setTimeout(() => {
        searchTerm = encodeURIComponent(searchTerm);
        makeRequest(getITunesSearchUrl(searchTerm), getResults);
    }, 300);
}

function getResults(data, feedUrl) {
    let query = decodeURI(feedUrl).split('=')[1].split('&')[0];
    
    let obj = JSON.parse(data);

    if(obj.results.length == 0)
        showSearchNothingToShow();
    else if(query == $('#search-input').val()) {
        $('#content-right-header span').data(obj);
        showSearchList(obj.results);
    }
}

function showSearchList(results) {
    setContentRightHeader();
    clearBody();
    setGridLayout(false);

    let $list = $('#list');
    for (let i in results) {
        let Artwork = results[i].artworkUrl100;
        if(Artwork == undefined || Artwork == 'undefined') {
            Artwork = results[i].artworkUrl60;
            if(Artwork == undefined || Artwork == 'undefined') 
                Artwork = getGenericArtwork();
        }
        let podcast = new Podcast (
            results[i].artistName,
            results[i].collectionName,
            Artwork,
            results[i].feedUrl
        );

        var HeartButton = null;
        if (isAlreadyFavorite(podcast.feedUrl))
            HeartButton = getFullHeartButton(podcast);
        else
            HeartButton = getHeartButton(podcast);

        let item = buildListItem(
            [
                getImagePart(results[i].artworkUrl60),
                getBoldTextPart(podcast.data.collectionName),
                getSubTextPart(podcast.data.artistName),
                HeartButton
            ],
            "5em 1fr 1fr 5em"
        );

        $(item).data(podcast);
        item.onclick = function (e) {
            if($(e.target).is('svg') || $(e.target).is('path') || $(e.target).hasClass('list-item-icon') || $(e.target).hasClass('list-item-text')) {
                e.preventDefault();
                return;
            }
            showAllEpisodes(this);
        }
        $list.append(item);
        
    }
}

function isSearchPage() {
    return getHeader() == generateHtmlTitle("Search");
}

function showSearchNothingToShow() {
    if(isSearchPage())
        setNothingToShowBody(s_SearchNothingFoundIcon, 'search-nothing-to-show');
}

function getHeartButton(podcastInfos) { 
    let $heartButtonElement = $(getIconButtonPart(s_Heart));

    $heartButtonElement.find('svg').click(function () {
        setFavorite(this, podcastInfos.data.artistName, 
                          podcastInfos.data.collectionName, 
                          podcastInfos.data.artworkUrl, 
                          podcastInfos.feedUrl,
                          podcastInfos.data.description
        );
    });
    return $heartButtonElement.get(0);
}

function getFullHeartButton(podcastInfos) {
    let $heartButtonElement = $(getIconButtonPart(s_FullHeart));
    
    $heartButtonElement.find('svg').click(function() {
        unsetFavorite(this, podcastInfos.data.artistName, 
                            podcastInfos.data.collectionName, 
                            podcastInfos.data.artworkUrl, 
                            podcastInfos.feedUrl,
                            podcastInfos.data.description
        );
    });
    return $heartButtonElement.get(0);
}

function getITunesSearchUrl(searchTerm) {
    return 'http://itunes.apple.com/search?term=' + searchTerm + '&media=podcast';
}