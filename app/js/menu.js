
function selectMenuItem(_MenuId) {
    let $menuItem = _MenuId;

    clearTextField($('#search-input').get(0));
    loseFocusTextField("search-input");

    clearMenuSelection();

    $menuItem.addClass("selected");
}

function showNewEpisodesPage() {
    setContentRightHeader();
    let $newEpisodesEntry = $('#menu-episodes');
    let title = $newEpisodesEntry.find('span').html();
    
    setHeader(generateHtmlTitle(title), '');
    selectMenuItem($newEpisodesEntry);

    clearBody();
    setScrollPositionOnTop();

    setGridLayout(false);

    allNewEpisodes.ui.showAll();
}

function showFavoritesPage() {
    setContentRightHeader();
    let $favoritesEntry = $('#menu-favorites');
    let title = $favoritesEntry.find('span').html();

    setHeader(generateHtmlTitle(title));
    selectMenuItem($favoritesEntry);
    setHeaderViewAction("list");

    clearBody();
    setScrollPositionOnTop();

    let JsonContent = allFavoritePodcasts.getAll();

    setGridLayout(true);
    
    if (allFavoritePodcasts.isEmpty())
        allFavoritePodcasts.ui.showNothingToShowPage();

    let List = document.getElementById("list");
    for (let i in JsonContent) {
        let Artwork = getBestArtworkUrl(JsonContent[i].feedUrl);

        let ListElement = getPodcastElement(Artwork, JsonContent[i].data.collectionName);
        
        let HeaderElement = ListElement.getElementsByClassName('podcast-entry-header')[0]

        HeaderElement.getElementsByTagName("img")[0].setAttribute("draggable", false)
        
        $(ListElement).data(JsonContent[i]);
        $(HeaderElement).attr("feedUrl", JsonContent[i].feedUrl);

        ListElement.onclick = function (e) {
            if($(e.target).is('svg') || $(e.target).is('path') || $(e.target).hasClass('podcast-entry-actions') || $(e.target).hasClass('list-item-text')) {
                e.preventDefault();
                return;
            }
            showAllEpisodes(this);
        }

        let $heartButton = $(ListElement).find('.podcast-entry-actions');
        $heartButton.click(function () {
            $(this).stop();
            unsubscribeListElement(this);
        });
        
        $heartButton.hoverIntent(function () {
            setHeartContent($(this).find('svg'), true);
        }, function () {
            setHeartContent($(this).find('svg'), false);
        });

        $(ListElement).mouseleave(function () {
            setHeartContent($(this).find('svg'), false);
        })

        List.append(ListElement)
    }
}

function showArchivePage() {
    setContentRightHeader();
    let $archiveEntry = $('#menu-archive');
    let title = $archiveEntry.find('span').html();
    
    setHeader(generateHtmlTitle(title), '');
    selectMenuItem($archiveEntry);

    clearBody();
    setScrollPositionOnTop();

    setGridLayout(false);

    allArchiveEpisodes.ui.showAll()
}

function showStatisticsPage() {
    setContentRightHeader();
    let $statisticsEntry = $('#menu-statistics');
    let title = $statisticsEntry.find('span').html();

    setHeader(generateHtmlTitle(title), '');
    selectMenuItem($statisticsEntry);

    clearBody();
    setScrollPositionOnTop();

    setGridLayout(false);

    let list = document.getElementById("list");

    list.append(getStatisticsHeaderElement("Podcasts"));

    list.append(getStatisticsEntryElement(i18n.__("Favorite Podcasts"), allFavoritePodcasts.length()));

    if(!allNewEpisodes.isEmpty()) {
        let channelName = allFavoritePodcasts.getByFeedUrl(allNewEpisodes.get(0).feedUrl).data.collectionName;
        list.append(getStatisticsEntryElement(i18n.__("Last Podcast"),  channelName));
    } else
        list.append(getStatisticsEntryElement(i18n.__("Last Podcast"),  "None"));

    list.append(getStatisticsHeaderElement(i18n.__("Episodes")));

    list.append(getStatisticsEntryElement(i18n.__("Archive Items"),  allArchiveEpisodes.length()));
    
    list.append(getStatisticsEntryElement(i18n.__("New Episodes"),  allNewEpisodes.length()));
}

function showPage(page) {
    if(allPreferences.ui.isOpen) {
        if(page == 'settings')
            return;
        
        allPreferences.ui.exitSettingsUI();
    }

    switch(page) {
        case 'newEpisodes': 
            showNewEpisodesPage();
            break;
        case 'favorites':
            showFavoritesPage();
            break;
        case 'archive': 
            showArchivePage();
            break;
        case 'statistics':
            showStatisticsPage();
            break;
        case 'settings': 
            allPreferences.ui.openSettingsUI();
            break;
        case 'search': 
            focusTextField("search-input");
            break;
        default:
            
            break;
    }
}