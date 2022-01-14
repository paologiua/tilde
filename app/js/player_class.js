var playerManager = null;

class PlayerManager extends UI {
    constructor() {
        super();

        this.$player = $('#player').get(0);
        this.$source = $(this.$player).find('source');

        this.$playPauseButton = $('#play-pause');
        this.$forwardButton = $('#forward-30-sec');
        this.$replyButton = $('#replay-30-sec');

        this.$duration = $('#content-left-player-duration');
        this.$currentTime = $('#content-left-player-time');
        this.$artwork = $('#content-left-player-img>img');
        this.$title = $('#content-left-player-title>div');
        this.$volume = $('#content-left-player-volume-indicator').get(0);
        this.$rate = $('#content-left-player-speed-indicator').get(0);

        this.volumeValue = 1;
        
        this.slider = new Slider($('#slider'));

        this.episodePlaying = null;
        this.queue = null;

        this.initActions();
    }

    initActions() {
        this.$source.on("error", () => {
            let path = getAudioPathFromEpisodeUrl(this.episodePlaying.episodeUrl);
            if (fs.existsSync(path) && this.$source.attr('src') !== `file://${path}`) {
                this.$source.attr('src', `file://${path}`);
                this.$player.load();
                this.$player.play();
            }
        });

        $('#content-left-player-volume-down').click(() => {
            this.volumeDown();
        })
        
        $('#content-left-player-volume-up').click(() => {
            this.volumeUp();
        })

        $('#content-left-player-volume-btn').on('wheel', function(event){
            setVolumeWithWheelMouse(event);
        });

        $('#content-left-player-speed-down').click(() => {
            this.speedDown();
        })

        $('#content-left-player-speed-up').click(() => {
            this.speedUp();
        })

        $('#content-left-player-speed-btn').on('wheel', function(event){
            setSpeedWithWheelMouse(event);
        });
        
        this.$replyButton.click(() => this.reply())
        this.$playPauseButton.click(() => this.togglePlayPause())
        this.$forwardButton.click(() => this.forward())
    }

    startsPlaying(episode, dontChangeQueue) {
        this.removeInitialOpacityPlayerButtons();
        this.setEpisodePlaying(episode);

        this.selectEpisode(episode.episodeUrl);
        this.setSource();

        if(!dontChangeQueue)
            this.queue = this.getPageType();

        this.$player.load();
        this.$player.currentTime = this.getPlaybackPosition();
        this.$player.addEventListener('timeupdate', () => {
            if (parseInt(this.getCurrentTime()) % 10 == 0)
                this.savePlaybackPosition();

            if(this.$player.ended) {
                let feedUrl = this.episodePlaying.feedUrl;
                let episodeUrl = this.episodePlaying.episodeUrl;
                this.next();
                //allNewEpisodes.removeByEpisodeUrl(episodeUrl);
                allFeeds.setPlaybackDoneByEpisodeUrl(feedUrl, episodeUrl, true);
                return;
            }

            let value = null;
            if(this.getCurrentTime() > 0)
                value = Math.floor((100 / this.getDuration()) * this.getCurrentTime());
            else
                value = 0;
            
            allFeeds.playback.ui.updatePosition(this.episodePlaying.episodeUrl, value);
            this.slider.setValue(value);
            this.updateCurrentTimeHtml();
            this.updateDurationHtml();
        }, false);

        this.setArtworkHtml();
        this.setTitleHtml();

        setTitle(this.episodePlaying.episodeTitle);
        this.play();
        this.setNavigator();
    }

    play() {
        this.$playPauseButton
            .stop()
            .fadeTo(100, 0.3,
                    () => {
                        this.$playPauseButton
                            .html($(s_PauseIcon).html())
                            .fadeTo(80, 0.65, () => {
                                this.$playPauseButton
                                    .removeAttr('style');
                            })
            })
        this.$playPauseButton.attr('mode', 'pause');

        this.$player.play();
        navigator.mediaSession.playbackState = "playing";
    }

    pause() {
        this.$playPauseButton
            .stop()
            .fadeTo(100, 0.3,
                    () => {
                        this.$playPauseButton
                            .html($(s_PlayIcon).html())
                            .fadeTo(80, 0.65, () => {
                                this.$playPauseButton
                                    .removeAttr('style');
                            })
            })
        this.$playPauseButton.attr('mode', 'play');

        this.$player.pause();
        navigator.mediaSession.playbackState = "paused";
    }

    setNavigator() {
        if ('mediaSession' in navigator) {
            let title = this.episodePlaying.episodeTitle;
            let artist = this.episodePlaying.channelName;
            let album = this.episodePlaying.pubDate;
            let artwork = this.episodePlaying.artwork;

            navigator.mediaSession.metadata = new MediaMetadata({
                title: title,
                artist: artist,
                album: album,
                artwork: [
                    {
                        src: artwork,
                        sizes: '512x512',
                        type: 'image/jpg'
                    }
                ]
            });

            navigator.mediaSession.setActionHandler('play', async () => {
                console.log('> User clicked "Play" icon.');
                this.play();
            });

            navigator.mediaSession.setActionHandler('pause', () => {
                console.log('> User clicked "Pause" icon.');
                this.pause();
            });

            navigator.mediaSession.setActionHandler("previoustrack", (details) => {
                this.reply();
            });

            navigator.mediaSession.setActionHandler("nexttrack", (details) => {
                this.forward();
            });
        }
    }

    isSet() {
        return Boolean(this.$source.attr('src'));
    }

    isPlaying(episodeUrl) {
        if(!this.episodePlaying)
            return false;
        return (episodeUrl == this.episodePlaying.episodeUrl);
    }

    forward() {
        if(this.isSet()) {
            this.$player.currentTime += 30;
            this.$forwardButton.animateRotate(360, 900);
        }
    }

    reply() {
        if(this.isSet()) {
            this.$player.currentTime -= 30;
            this.$replyButton.animateRotate(-360, 900);
        }
    }

    speedUp() {
        if(this.$player.playbackRate < 3) {
            this.$player.playbackRate = parseFloat(this.$player.playbackRate + 0.1).toFixed(1);
            this.$player.defaultPlaybackRate = this.$player.playbackRate;
            this.$rate.innerHTML = `${this.$player.playbackRate}${(this.$player.playbackRate * 10) % 10 === 0 ? '.0' : ''}x`;
        }
    }

    speedDown() {
        if(this.$player.playbackRate > 0.5) {
            this.$player.playbackRate = parseFloat(this.$player.playbackRate - 0.1).toFixed(1);
            this.$player.defaultPlaybackRate = this.$player.playbackRate;
            this.$rate.innerHTML = `${this.$player.playbackRate}${(this.$player.playbackRate * 10) % 10 === 0 ? '.0' : ''}x`;
        }
    }

    volumeUp() {
        if(this.volumeValue < 1) {
            this.volumeValue = Number(parseFloat(this.volumeValue + 0.1).toFixed(1));
            this.$player.volume = getNormalizedVolume(this.volumeValue);
            switch (this.volumeValue) {
                case 0.1: this.$volume.innerHTML = s_VolumeMinIcon; break;
                case 0.4: this.$volume.innerHTML = s_Volume40Icon; break;
                case 0.7: this.$volume.innerHTML = s_Volume70Icon; break;
                case 1: this.$volume.innerHTML = s_VolumeMaxIcon; break;
                default: break;
            }
            $('#content-left-player-volume-btn').css('--volume', `${this.volumeValue * 100}%`);
        }
    } 

    volumeDown() {
        if(this.volumeValue > 0) {
            this.volumeValue = Number(parseFloat(this.volumeValue - 0.1).toFixed(1));
            this.$player.volume = getNormalizedVolume(this.volumeValue);
            switch (this.volumeValue) {
                case 0: this.$volume.innerHTML = s_VolumeMuteIcon; break;
                case 0.3: this.$volume.innerHTML = s_VolumeMinIcon; break;
                case 0.6: this.$volume.innerHTML = s_Volume40Icon; break;
                case 0.9: this.$volume.innerHTML = s_Volume70Icon; break;
                default: break;
            }
            $('#content-left-player-volume-btn').css('--volume', `${this.volumeValue * 100}%`);
        }
    }

    next() {
        let feed = null;
        let index = null;

        switch(this.queue) {
            case 'newEpisodes':
                feed = allNewEpisodes.getAll();
                break;
            case 'feed':
                feed = allFeeds.getFeedPodcast(this.episodePlaying.feedUrl);
                break;
            case 'archive':
                feed = allArchiveEpisodes.getAll();
                break;
        }

        if(feed)
            index = feed.map(e => e.episodeUrl).indexOf(this.episodePlaying.episodeUrl);

        if(index && index > 0) {
            index--;
            let episode = (this.queue == 'feed' ? feed[index] : getInfoEpisodeByObj(feed[index]));

            this.startsPlaying(episode, true);
            return;
        }

        this.pause();

    }

    getDuration() {
        return this.$player.duration;
    }

    getCurrentTime() {
        return this.$player.currentTime;
    }

    setCurrentTime(value) {
        this.$player.currentTime = (value / 100) * this.getDuration();
        this.savePlaybackPosition();
    }

    setSource() {
        this.$source
            .attr('src', this.episodePlaying.episodeUrl);
    }

    setArtworkHtml() {
        this.$artwork.attr('src', this.episodePlaying.artwork);
    }

    setTitleHtml() {
        this.$title.html(this.episodePlaying.episodeTitle);
    }

    getSelectedEpisode() {
        return this.getAllItemsList()
                    .filter('.select-episode');
    }

    selectEpisode(episodeUrl) {
        this.getSelectedEpisode()
            .removeClass('select-episode');
        
        this.getByEpisodeUrl(episodeUrl)
            .addClass('select-episode');
    }

    setEpisodePlaying(episode) {
        this.episodePlaying = { ...episode };
        return this.episodePlaying;
    }

    savePlaybackPosition() {
        if(this.episodePlaying)
            allFeeds.setPlaybackPositionByEpisodeUrl(this.episodePlaying.feedUrl, this.episodePlaying.episodeUrl, this.getCurrentTime(), this.getDuration());
    }

    getPlaybackPosition() {
        if(this.episodePlaying) {
            let playbackPosition = allFeeds.getPlaybackPositionByEpisodeUrl(this.episodePlaying.episodeUrl);
            if(playbackPosition)
                return playbackPosition;
        }
        return 0;
    }

    updateDurationHtml() {
        let time = getFullTime(Math.floor(this.getDuration()));
        
        let getPrettyTime = function (_Time) {
            return ((_Time < 10) ? "0" + _Time : _Time)
        }
        
        if (!isNaN(time.minutes))
            this.$duration.html(getPrettyTime(time.hours) + ":" + 
                                getPrettyTime(time.minutes) + ":" + 
                                getPrettyTime(time.seconds));
    }

    updateCurrentTimeHtml() {
        let time = getFullTime(Math.floor(this.getCurrentTime()));
        
        let getPrettyTime = function (_Time) {
            return ((_Time < 10) ? "0" + _Time : _Time)
        }
        
        if (!isNaN(time.minutes)) 
            this.$currentTime.html(getPrettyTime(time.hours) + ":" + 
                                   getPrettyTime(time.minutes) + ":" + 
                                   getPrettyTime(time.seconds));
    }

    togglePlayPause() {
        if(this.isSet()) {
            if (this.$playPauseButton.attr('mode') == "play")
                this.play();
            else
                this.pause();
        }
    }

    removeInitialOpacityPlayerButtons() {
        this.$replyButton.removeAttr('style');
        this.$playPauseButton.removeAttr('style');
        this.$forwardButton.removeAttr('style');
        this.$artwork.removeAttr('style');
    }
}

function loadPlayerManager() {
    playerManager = new PlayerManager();
}

function setSpeedWithWheelMouse(e) {
    if(e.originalEvent.deltaY < 0)
        playerManager.speedUp();
    else 
        playerManager.speedDown();
}

function setVolumeWithWheelMouse(e) {
    if(e.originalEvent.deltaY < 0)
        playerManager.volumeUp();
    else 
        playerManager.volumeDown();
}

function getNormalizedVolume(volume) {
    return (volume == 0 ? 0 : 1.8**(-10 + volume*10));
}