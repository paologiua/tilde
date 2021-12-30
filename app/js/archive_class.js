var allArchiveEpisodes = null;

class ArchiveEpisodesUI extends ListUI {
    isArchivePage() {
        return (this.getPageType() == 'archive');
    }

    showNothingToShow() {
        if(this.isArchivePage()) 
            super.showNothingToShow(s_ArchiveNothingFoundIcon, 'archive-nothing-to-show');
    }

    add(episode, i) {
        if(this.isArchivePage()) {
            super.add(episode, i);
        }
        setItemCounts();
    }

    removeByEpisodeUrl(episodeUrl) {
        if(this.isArchivePage()) {
            super.removeByEpisodeUrl(episodeUrl, this.dataObject.episodes);
        }
        setItemCounts();
    }

    showAll() {
        this.showList(this.dataObject.episodes);
        this.dataObject.update();
    }

    convertItemIntoInfoItemList(obj) {
        let episode = _(obj);

        let $obj = $(obj);
        $obj.attr('info-mode', '');
        let $descriptionItem = $obj.find('.list-item-description');
        $obj.off('click');
        
        $obj.find('div').not(".list-item-description").css('display', 'none');
        $obj.css('grid-template-columns', '5em 1fr 5em 5em');
        $descriptionItem.before(
            `<span id="info-item-list" style="opacity: 0;">
                <br>
                <span class="info-title">
                    ${episode.episodeTitle}
                </span>
                <br>
                <span class="info-channel">
                    ${episode.channelName}
                </span>
                <br>
                <span class="info-duration">
                    ${getDurationFromDurationKey({durationKey: episode.durationKey})}
                </span>
                <br>
                <span class="info-description">
                    ${getInfoFromDescription(episode.episodeDescription)}
                </span>
                <br>
                <span class="info-pubdate">
                    ${new Date(episode.pubDate).toLocaleString()}
                </span>
                <span class="info-download">
                    ${this.getDownloadStateButton(episode.episodeUrl)}
                </span>
                <br>
                <br>
            </span>`
        )
        
        $obj.find('#info-item-list')
            .stop()
            .animate({opacity: 1.0}, 500)
        
        $descriptionItem.html(s_ArrowUpIcon);
        
        let initialHeight = $obj.css('height');
        $obj.css('height', 'auto');
        let autoHeight = $obj.css('height');
        $obj.css('height', initialHeight)
        
        $obj.find('img')
            .css('position', 'relative')
            .css('top', '0px')
            .stop()
            .animate({top: '22px'}, 300);

        $obj
            .stop()
            .animate(
                {height: autoHeight}, 
                300, 
                function () {
                    $obj.css('height', 'auto');
                });
    }

    convertInfoItemIntoItemList($obj) {
        if($obj.get(0)) {
            let height = $obj.get(0).offsetHeight;
            // let $obj = $(obj);
            $obj.removeAttr('info-mode');

            $obj.click(function(e) {
                if($(e.target).is('svg') || $(e.target).is('path') || $(e.target).hasClass('list-item-icon') || $(e.target).hasClass('list-item-text')) {
                    e.preventDefault();
                    return;
                }
                playerManager.startsPlaying(_(this));
            });
        
            $obj.find('div')
                .not('.list-item-flag')
                .removeAttr('style');

            $obj.css('grid-template-columns', "5em 1fr 1fr 6em 5em 5em");

            $obj.find('img')
                .stop()
                .animate({top: '0px'}, 300, function () {
                    $obj.find('img').removeAttr('style');
                });

            $obj
                .css('background-color', '')
                .css('height', height)
                .stop()
                .animate(
                    {height: '3.2em'}, 
                    300, 
                    function () {
                        $obj.css('height', '');
                    });
                

            $obj.find('#info-item-list').remove();
            
            $obj.find('.list-item-description')
                .html(s_InfoIcon);
            
            $obj.find('.list-item-flag')
                .css('display', '');
        }
    }

    getNewItemList(archiveEpisode) {
        let episode = getEpisodeFromArchiveEpisode(archiveEpisode);

        let artwork = episode.artwork;
        
        let $listElement = $(buildListItem(
            [
                getImagePart(artwork),
                getBoldTextPart(episode.episodeTitle),
                getTextPart(episode.channelName),
                getProgressionFlagPart(episode.episodeUrl),
                getDescriptionPart(),
                getAddToArchiveButtonPart(episode.episodeUrl)
            ],
            "5em 1fr 1fr 6em 5em 5em"
        ));

        $listElement.click(function(e) {
            if($(e.target).is('svg') || $(e.target).is('path') || $(e.target).hasClass('list-item-icon') || $(e.target).hasClass('list-item-text')) {
                e.preventDefault();
                return;
            }
            playerManager.startsPlaying(_(this));
        });

        $listElement.data(episode);
        $listElement.attr('url', episode.episodeUrl);

        if(this.dataObject.downloadManager.episodeInDownload(episode.episodeUrl))
            $listElement
                .css('--progress', `${this.dataObject.downloadManager.data[episode.episodeUrl].progress || 0}%`)
                .addClass("download-in-progress");
        
        switch(this.dataObject.getStateDownload(episode.episodeUrl)) {
            case 'in_progress':
                $listElement.addClass("download-in-progress");
                break;
            case 'error':
                $listElement.addClass("download-error");
                break;
            default:
                break;
        }

        if(playerManager.isPlaying(episode.episodeUrl))
            $listElement.addClass("select-episode");
        
        $listElement.find('.list-item-description').click(() => {
            if($listElement.is('[info-mode]'))
                this.convertInfoItemIntoItemList($listElement);
            else {
                this.convertInfoItemIntoItemList(this.getAllItemsList().filter('[info-mode]'));
                this.convertItemIntoInfoItemList($listElement);
            }
        })

        return $listElement;
    }

    getAndCleanStatusesByEpisodeUrl(episodeUrl) {
        return this.getByEpisodeUrl(episodeUrl)
            .removeClass("download-error")
            .removeClass("download-in-progress")
            .css('--progress', '');
    }

    setDownloadInProgress(episodeUrl) {
        let $el = this.getByEpisodeUrl(episodeUrl)
        .find('.list-item-icon:not(.list-item-description) svg')

        changeIconButton($el, s_DownloadInProgressIcon, i18n.__('Download in progress'));

        this.getByEpisodeUrl(episodeUrl)
            .removeClass("download-error")
            .addClass("download-in-progress")
            .find(".info-download").html(`<br>${i18n.__('Download in progress')}`);
    }

    setDownloadCompleted(episodeUrl) {
        let $el = this.getByEpisodeUrl(episodeUrl)
            .find('.list-item-icon:not(.list-item-description) svg')

        changeIconButton($el, 
                         allArchiveEpisodes.ui.isArchivePage() ? s_DeleteIcon : s_RemoveEpisodeIcon, 
                         i18n.__("Remove from archive"));

        this.setProgress(episodeUrl, '100%');
        setTimeout(() => {
            this.getAndCleanStatusesByEpisodeUrl(episodeUrl)
                .find(".info-download").html(`<br>${i18n.__('Download completed')}`);
        }, 1000);
    }

    setProgress(episodeUrl, percentage) {
        this.getByEpisodeUrl(episodeUrl)
            .css('--progress', percentage)
            .find(".info-download").html(`<br>${i18n.__('Download in progress')} (${percentage})`);
    }

    setDownloadError(episodeUrl) {
        let $el = this.getByEpisodeUrl(episodeUrl)
                .find('.list-item-icon:not(.list-item-description) svg')
        
        changeIconButton($el, s_DownloadErrorIcon, i18n.__('Download error'));
        
        this.getAndCleanStatusesByEpisodeUrl(episodeUrl)
            .addClass("download-error")
            .find(".info-download").html(`<br>${i18n.__('Download error')}`);
    }

    setNotDownloadedYet(episodeUrl) {
        let $el = this.getAndCleanStatusesByEpisodeUrl(episodeUrl)
                .find('.list-item-icon:not(.list-item-description) svg');
        
        changeIconButton($el, s_AddEpisodeIcon, i18n.__("Add to archive"));
    }

    getDownloadStateButton(episodeUrl) {
        let label = '';
        switch(this.dataObject.downloadManager.getStateDownload(episodeUrl)) {
            case 'completed': 
                label = i18n.__('Download completed');
                break;
            case 'error':
                label = i18n.__('Download error');
                break;
            case 'in_progress':
                label = i18n.__('Download in progress');
                break;
            default:
                break;
        }
        return label ? `<br>${label}` : '';
    }
}

class DownloadManager { 
    constructor(obj) {
        this.load();
        this.archive = obj;
        this.MAX_REDOWNLOADS = 5;
    }

    load() {
        if (!fs.existsSync(getDownloadsDirPath()))
            fs.mkdirSync(getDownloadsDirPath());

        if (!fs.existsSync(getDownloadManagerFilePath()))
            fs.openSync(getDownloadManagerFilePath(), 'w');
            
        let fileContent = ifExistsReadFile(getDownloadManagerFilePath());
        this.episodes = JSON.parse(fileContent == "" ? "{}": fileContent);
        this.data = {};
    }

    update() {
        fs.writeFileSync(getDownloadManagerFilePath(), JSON.stringify(this.episodes, null, "\t"));
    }
    
    length() {
        return this.episodes.length;
    }

    isEmpty() {
        return (this.length() == 0);
    }

    getAll() {
        return this.episodes;
    }

    getByEpisodeUrl(episodeUrl) {
        return this.episodes[episodeUrl];
    }
    
    add(episodeUrl) {
        if(!this.getByEpisodeUrl(episodeUrl)) {
            this.saveAudioInMemory(episodeUrl);
            this.update();
            return episodeUrl;
        } 
        return null;
    }
    
    removeByEpisodeUrl(episodeUrl, unlink) {
        if(unlink)
            this.deleteAudioInMemory(episodeUrl);

        if(this.getByEpisodeUrl(episodeUrl)) {
            delete this.episodes[episodeUrl];
            this.update();
            return true;
        }
        return false;
    }

    saveAudioInMemory(episodeUrl) {
        if(this.episodeInDownload(episodeUrl))
            return;
        else
            this.data[episodeUrl] = {};
        
        this.data[episodeUrl].download = downloadFile(
            episodeUrl, 
            getAudioPathFromEpisodeUrl(episodeUrl),
            (e) => {
                if(this.archive.checkEpisode(episodeUrl)) {
                    console.log(e);
                    if(window.navigator.onLine && this.data[episodeUrl] && this.data[episodeUrl].counter <= this.MAX_REDOWNLOADS) {
                        delete this.data[episodeUrl].download;
                        this.saveAudioInMemory(episodeUrl);
                        this.data[episodeUrl].counter++;
                    } else
                        delete this.data[episodeUrl];
                    this.setDownloadError(episodeUrl);
                }
            },
            () => {
                if(this.archive.checkEpisode(episodeUrl)) {
                    this.removeByEpisodeUrl(episodeUrl);
                    delete this.data[episodeUrl];
                    this.setDownloadCompleted(episodeUrl);
                    console.log(`${episodeUrl} - Download completed`);
                }
            },
            (state) => {
                if(!window.navigator.onLine)
                    this.setDownloadError(episodeUrl);
                else if(this.archive.checkEpisode(episodeUrl)) {
                    let progress = parseInt(state.percent * 100);
                    console.log(`${episodeUrl} - ${progress}%`);
                    this.data[episodeUrl].progress = progress
                    this.archive.ui.setProgress(episodeUrl, `${progress}%`);
                }
            }
        );

        if(!this.data[episodeUrl].counter)
            this.data[episodeUrl].counter = 1;

        this.archive.ui.setDownloadInProgress(episodeUrl);

        this.setDownloadInProgress(episodeUrl);
    }

    endDownload(episodeUrl) {
        if(this.data[episodeUrl]) {
            this.data[episodeUrl].download.stream.end();
            this.data[episodeUrl].download.request.abort();
            delete this.data[episodeUrl];
        }
    }

    deleteAudioInMemory(episodeUrl) {
        try { 
            this.endDownload(episodeUrl);
            fs.unlinkSync(getAudioPathFromEpisodeUrl(episodeUrl));
            console.log(`${episodeUrl} - Successfully deleted`);
        } catch(e) {
            console.log(e);
        }
    }

    episodeInDownload(episodeUrl) { 
        return (this.data[episodeUrl] && this.data[episodeUrl].download);
    }

    saveAll() {
        for(let episodeUrl in this.episodes) 
            if(this.episodes[episodeUrl] != 'completed')
                this.saveAudioInMemory(episodeUrl);
    }

    setDownloadError(episodeUrl) {
        this.episodes[episodeUrl] = 'error';
        this.update();
        this.archive.ui.setDownloadError(episodeUrl);
    }

    setDownloadInProgress(episodeUrl) {
        this.episodes[episodeUrl] = 'in_progress';
        this.update();
        this.archive.ui.setDownloadInProgress(episodeUrl);
    }

    setDownloadCompleted(episodeUrl) {
        this.episodes[episodeUrl] = 'completed';
        this.update();
        this.archive.ui.setDownloadCompleted(episodeUrl);
    }

    getStateDownload(episodeUrl) {
        return this.episodes[episodeUrl];
    }
}

class ArchiveEpisodes {
    constructor() {
        this.load();
        this.ui = new ArchiveEpisodesUI(this);
        this.downloadManager = new DownloadManager(this);
    }

    load() {
        if (!fs.existsSync(getArchivedFilePath()))
            fs.openSync(getArchivedFilePath(), 'w');
            
        let fileContent = ifExistsReadFile(getArchivedFilePath());
        this.episodes = JSON.parse(fileContent == "" ? "[]": fileContent);
    }

    update() {
        fs.writeFileSync(getArchivedFilePath(), JSON.stringify(this.episodes, null, "\t"));
    }
    
    length() {
        return this.episodes.length;
    }

    isEmpty() {
        return (this.length() == 0);
    }

    getAll() {
        return this.episodes;
    }

    get(i) {
        return this.episodes[i];
    }

    getInfoByIndex(i) {
        let archiveEpisode = this.get(i);
        return getInfoEpisodeByObj(archiveEpisode);
    }
    
    findByEpisodeUrl(episodeUrl) {
        return this.episodes.map(e => e.episodeUrl).indexOf(episodeUrl);
    }

    getByEpisodeUrl(episodeUrl) {
        let i = this.findByEpisodeUrl(episodeUrl);
        return (i != -1 ? this.episodes[i] : undefined);
    }

    setByEpisode(episode) {
        let i = this.findByEpisodeUrl(episode.episodeUrl);
        if(i != -1) 
            this.episodes[i] = episode;
        return i;
    }
    
    add(episode) {
        if(this.findByEpisodeUrl(episode.episodeUrl) == -1) {
            this.episodes.unshift(episode);
            this.downloadManager.add(episode.episodeUrl);
            this.update();
            this.ui.add(episode, 0);
            return episode;
        } 
        return null;
    }
    
    removeByEpisodeUrl(episodeUrl) {
        let i = this.findByEpisodeUrl(episodeUrl);
        if(i != -1) {
            this.downloadManager.removeByEpisodeUrl(episodeUrl, true);
            this.episodes.splice(i, 1);
            this.update();
            this.ui.removeByEpisodeUrl(episodeUrl);
            return true;
        } 

        return false;
    }

    removePodcastEpisodes(feedUrl) {
        for(let i = this.episodes.length - 1; i >= 0; i--) {
            if(this.episodes[i].feedUrl == feedUrl) {
                this.downloadManager.removeByEpisodeUrl(this.episodes[i].episodeUrl, true);
                this.episodes.splice(i, 1);
            }
        }
        this.update();
    }

    checkEpisode(episodeUrl) {
        return this.findByEpisodeUrl(episodeUrl) != -1;
    }

    isNotDownloaded(episodeUrl) {
        return this.downloadManager.getByEpisodeUrl(episodeUrl) != undefined;
    }

    getStateDownload(episodeUrl) {
        return this.downloadManager.getStateDownload(episodeUrl);
    }
}

function loadArchiveEpisodes() {
    allArchiveEpisodes = new ArchiveEpisodes();
}

function getAudioPathFromEpisodeUrl(episodeUrl) {
    return `${getDownloadsDirPath()}/${episodeUrl.replace(/\/|\%/g, '-')}`;
}

function getPodcastFromEpisode(episode) {
    let podcast = allFavoritePodcasts.getByFeedUrl(episode.feedUrl);
    if(podcast)
        return podcast;
    else 
        return new Podcast(
            '',
            episode.channelName,
            episode.artwork,
            episode.feedUrl,
            ''
        );
}

function getEpisodeFromArchiveEpisode(archiveEpisode) {
    let episode = getInfoEpisodeByObj(archiveEpisode);
    if(episode) {
        allArchiveEpisodes.setByEpisode(episode);
        return episode;
    } else 
        return archiveEpisode;
}