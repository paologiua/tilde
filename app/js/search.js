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

        if(isUrl(self.value))
            getPodcastInfoFromFeedUrl(self.value);
        else
            getPodcasts(self.value);
    }
}

function isUrl(str) {
    let url = str.match(/\b(https?:\/\/\S*\b)/g);
    return (url && url[0] == str);
}

function getPodcastInfoFromFeedUrl(feedUrl) {
    makeRequest(feedUrl, (xml) => getPodcastInfoFromXml(xml, feedUrl), () => getPodcasts(feedUrl));
}

function getPodcastInfoFromXml(xml, feedUrl) {
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(xml, "text/xml");

    let channel = xmlDoc.getElementsByTagName("channel")[0];
    if(!channel) {
        showSearchNothingToShow();
        return;
    }

    let channelName = channel.getElementsByTagName("title")[0].childNodes[0].nodeValue;
    
    let artworkUrl = channel.getElementsByTagName("itunes:image")[0];
    if(artworkUrl)
    	artworkUrl = artworkUrl.getAttribute('href');
    else {
		artworkUrl = channel.getElementsByTagName("image")[0];
		if(artworkUrl) {
			artworkUrl = artworkUrl.getElementsByTagName("url")[0];
			if(artworkUrl)
				artworkUrl = artworkUrl.textContent;
		}
    }

    let artistName = channel.getElementsByTagName("itunes:author")[0];
    if(artistName)
        artistName = artistName.textContent;
    else {
        let artistName = channel.getElementsByTagName("author")[0];
        if(artistName)
            artistName = artistName.childNodes[0].nodeValue;
        else 
            artistName = '';
    }

    let podcastDescription = '';
    let podcastSubtitle = channel.getElementsByTagName('itunes:subtitle')[0];
    if(podcastSubtitle)
        podcastDescription = podcastSubtitle.textContent;
    podcastSubtitle = channel.getElementsByTagName('description')[0];
    if(podcastSubtitle && podcastSubtitle.textContent.length > podcastDescription.length)
        podcastDescription = podcastSubtitle.textContent;
    
    podcastSubtitle = channel.getElementsByTagName('itunes:summary')[0];
    if(podcastSubtitle && podcastSubtitle.textContent.length > podcastDescription.length)
        podcastDescription = podcastSubtitle.textContent;

    showSearchList([{
        artworkUrl60: artworkUrl,
        collectionName: channelName,
        artistName: artistName,
        feedUrl: feedUrl
    }])
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
    let query = decodeURIComponent(feedUrl).split('=')[1].split('&')[0];
    
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
        setNothingToShowBody(s_SearchNothingFoundIcon, 'search-nothing-to-show', 'Try typing the feed url into the search field!');
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