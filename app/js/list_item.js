
function buildListItem(partsArray, layoutRatio) {
    let $container = document.createElement("li");

    for(let i = 0; i < partsArray.length; i++)
        $container.append(partsArray[i]);

    $container.classList.add('list-item-row-layout');
    $container.style.gridTemplateColumns = layoutRatio;

    return $container;
}

function getImagePart(artwork) {
    let $imageElement = document.createElement("img");

    $imageElement.src = artwork
    $imageElement.style.backgroundImage = "url(./img/podcast_07prct.svg)";
    $imageElement.style.backgroundRepeat = "no-repeat";
    $imageElement.style.backgroundSize = "cover";

    return $imageElement;
}

function getGenericPart(innerHTML, elementClass) {
    return $(
        `<div class="${elementClass}">
            ${innerHTML}
        </div>`
    ).get(0); 
}

function getBoldTextPart(text) {
    return getGenericPart(text, "list-item-bold-text");
}

function getTextPart(text) {
    return getGenericPart(text, "list-item-text");
}

function getSubTextPart(text) {
    return getGenericPart(text, "list-item-sub-text");
}

function getFlagPart(text) {
    return $(getGenericPart(text, "list-item-flag"));
}

function getProgressionFlagPart(episodeUrl) {
    return allFeeds.playback.ui.getProgressionFlag(episodeUrl);
}

function getIconButtonPart(icon) {
    return getGenericPart(icon, "list-item-icon");
}

function getDescriptionPart() {
    return getGenericPart(s_InfoIcon, "list-item-icon list-item-description");
}

function addToArchiveOnClickAction(event) {
    event.stopPropagation(); 

    let episodeUrl = $(this).parent().parent().attr('url');
    let stateEpisode = allArchiveEpisodes.getStateDownload(episodeUrl);
    if(stateEpisode === 'completed' || stateEpisode === 'error' || stateEpisode === 'in_progress') {
        removeFromArchive(this);
        allArchiveEpisodes.ui.setNotDownloadedYet(episodeUrl);
    } else 
        addToArchive(this);
}

function getAddToArchiveButtonPart(episodeUrl) {
    let stateEpisode = allArchiveEpisodes.getStateDownload(episodeUrl);

    let $button = null;
    switch(stateEpisode) {
        case 'completed':
            $button = getIconButtonPart(allArchiveEpisodes.ui.isArchivePage() ? s_DeleteIcon : s_RemoveEpisodeIcon);
            $button.title = i18n.__("Remove from archive");
            break;
        case 'error':
            $button = getIconButtonPart(s_DownloadErrorIcon);
            $button.title = i18n.__("Download error");
            break;
        case 'in_progress':
            $button = getIconButtonPart(s_DownloadInProgressIcon);
            $button.title = i18n.__("Download in progress");
            break;
        default:
            $button = getIconButtonPart(s_AddEpisodeIcon);
            $button.title = i18n.__("Add to archive");
            break;
    }

    $($button).find('svg').on('click', addToArchiveOnClickAction);
    return $button;
}

function changeIconButton(obj, icon, title) {
    $(obj)
        .off('click')
        .stop()
        .animate(
            {opacity: 0.6}, 
            120, 
            function() {
                $(obj)
                    .html($(icon).html())
                    .animate(
                        {opacity: 1.0}, 
                        120, 
                        function () {
                            $(obj)
                                .on('click', addToArchiveOnClickAction)
                                .removeAttr('style')
                                .parent()
                                .attr('title', title);
                        });
            }
        );
}