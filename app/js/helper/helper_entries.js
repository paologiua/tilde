
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

function getPodcastElement(_Class, _Artwork, _Subtitle, _Title, _IconElement, _TailElement, _HeaderLayout) {
    let ListElement = document.createElement("li")
    let HeaderElement = document.createElement("div")
    let ActionsElement = document.createElement("div")
    let BodyElement = document.createElement("div")

    let TitleElement = document.createElement("div")
    let SubtitleElement = document.createElement("div")
    let ImageElement = document.createElement("img")
    let TailElement = document.createElement("div")

    if (_HeaderLayout == null)
        HeaderElement.classList.add("podcast-entry-header")
    else
        HeaderElement.classList.add(_HeaderLayout)

    ActionsElement.classList.add("podcast-entry-actions")
    BodyElement.classList.add("podcast-entry-body")

    ImageElement.src = _Artwork

    TitleElement.innerHTML = _Title
    TitleElement.classList.add("podcast-entry-title")

    SubtitleElement.innerHTML = _Subtitle
    SubtitleElement.classList.add("podcast-entry-subtitle")

    TailElement.innerHTML = (_TailElement == undefined ? "" : _TailElement)
    TailElement.classList.add("podcast-entry-tail")

    ListElement.classList.add("podcast-entry")

    if (_Class != null) { 
        ListElement.classList.remove("podcast-entry"); 
        ListElement.classList.add(_Class) 
    }

    if (_IconElement != undefined) 
        ActionsElement.innerHTML = _IconElement 
    
    if (_Artwork != null) 
        HeaderElement.append(ImageElement) 
    
    if (_Subtitle != null) 
        HeaderElement.append(SubtitleElement)

    HeaderElement.append(TitleElement)
    HeaderElement.append(TailElement)

    ListElement.append(HeaderElement)
    ListElement.append(ActionsElement)
    ListElement.append(BodyElement)

    return ListElement
}

function getStatisticsElement(_Class, _Title, _Value) {
    var ListElement = document.createElement("li")
    var Title = document.createElement("div")
    var Value = document.createElement("div")

    Title.innerHTML = _Title
    Title.classList.add("statistics-entry-title")

    if (_Value != null)
    {
        Value.innerHTML = _Value
        Value.classList.add("statistics-entry-value")
    }

    // ListElement.classList.add("statistics-entry")

    ListElement.classList.add(_Class)
    ListElement.append(Title)

    if (_Value != null)
    {
        ListElement.append(Value)
    }

    return ListElement
}
