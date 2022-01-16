const fs = require('fs')
const os = require('os')

var titlebar = null;
var allPreferences = null;

/*  // FUNCTIONS TO COMMUNICATE WITH THE MAIN
function sendToMain(channel, obj) {
    const { ipcRenderer } = require('electron');
    ipcRenderer.send(channel, obj);
}

function listenFromMain(channel, f) {
    var ipcRenderer = require('electron').ipcRenderer;
    ipcRenderer.on(channel, function (event, obj) {
        f(obj);
    });
}
 */

// ---------------------------------------------------------------------------------------------------------------------
// GLOBAL
// ---------------------------------------------------------------------------------------------------------------------

class PreferencesUI {
    constructor(obj) {
        this.dataObject = obj;

        this.$settingsUI = $('.settings-ui');
        this.$settingsUIbk = this.$settingsUI.find('.settings-ui-bk');
        this.$$settingsUIwindow = this.$settingsUI.find('.settings-ui-window');
        this.$exitButton = this.$settingsUI.find('svg');
        this.$checkBoxDarkMode = this.$settingsUI.find('input');

        this.menuSettings = $('#menu-settings');

        this.oldselectedMenuItem = undefined;
        this.isOpen = false;

        this.init();
    }

    init() {
        this.$exitButton.click(() => {
            this.exitSettingsUI();
        });

        this.$checkBoxDarkMode.change(function() {
            var DarkModeMenu = getDarkModeMenuItem();
            DarkModeMenu.checked = $(this).is(':checked');
            updateUITheme();
        });

        this.$settingsUIbk.click(() => {
            this.exitSettingsUI();
        });
    }

    setCheckBoxDarkModeState(state) {
        this.$checkBoxDarkMode.prop('checked', state);
    }

    openSettingsUI() {
        this.oldselectedMenuItem = $('.selected');
        selectMenuItem(this.menuSettings);
        this.$settingsUI.css('display', 'block');
        this.isOpen = true;
    }

    exitSettingsUI() {
        selectMenuItem(this.oldselectedMenuItem)
        this.$settingsUI.css('display', 'none');
        this.isOpen = false;
    }
}

class Preferences {
    constructor() {
        this.ui = new PreferencesUI(this);
        this.load();
    }

    load() {
        if (!fs.existsSync(getPreferencesFilePath()))
            fs.openSync(getPreferencesFilePath(), 'w');
        
        let fileContent = ifExistsReadFile(getPreferencesFilePath());
        this.preference = JSON.parse(fileContent == "" ? "{}": fileContent);
        this.check();
        if(this.getDarkmode())
            this.ui.setCheckBoxDarkModeState(true);
    }

    update() {
        fs.writeFileSync(getPreferencesFilePath(), JSON.stringify(this.preference, null, "\t"));
    }

    check() {
        if(!this.preference.darkmode)
            this.preference.darkmode = false;

        if(!this.preference.darkmode)
            this.update();
    }

    setDarkmode(darkmode) {
        this.preference.darkmode = darkmode;
        this.ui.setCheckBoxDarkModeState(darkmode);
        this.update();
    }

    getDarkmode() {
        return this.preference.darkmode;
    }
    
    set(preference, value) {
        this.preference[preference] = value;
        if(preference == 'darkmode')
            this.ui.setCheckBoxDarkModeState(value);
        this.update();
    }

    get(preference) {
        return this.preference[preference];
    }
}

function getArgument(index) {
    try {
        const remote = require('electron').remote;
        return remote.process.argv[index];
    } catch(error) {
        return process.argv[index];
    }
}

function isDevMode() {
    return getArgument(2) == 'dev';
}

function loadPreferences() {
    allPreferences = new Preferences();
}

function getSaveDirPath() {
    return os.homedir() + `/.tilde${isDevMode() ? '-beta' : ''}`;
}

function getFeedDirPath() {
    return getSaveDirPath() + '/podcast-feeds';
}

function getIndexFeedFilePath() {
    return getFeedDirPath() + '/index.json';
}

function getDownloadsDirPath() {
    return getSaveDirPath() + '/downloads';
}

function isWindows() {
    return process.platform == 'win32';
}

function isDarwin() {
    return process.platform == 'darwin';
}

function isLinux() {
    return process.platform == 'linux';
}

function getSaveFilePath() {
    return getSaveDirPath() + '/favorite-podcasts.json';
}

function getNewEpisodesSaveFilePath() {
    return getSaveDirPath() + '/new-episodes.json';
}

function getArchivedFilePath() {
    return getSaveDirPath() + '/archived-episodes.json';
}

function getPreferencesFilePath() {
    return getSaveDirPath() + '/preferences.json';
}

function getPlaybackSaveFilePath() {
    return getSaveDirPath() + '/playback-episodes.json';
}

function getDownloadManagerFilePath() {
    return getDownloadsDirPath()  + '/download-manager.json';
}

function setTitlebarOnWin() {
    if(isWindows()) {
        const customTitlebar = require('custom-electron-titlebar');
        titlebar = new customTitlebar.Titlebar({
            backgroundColor: customTitlebar.Color.fromHex('#bbb')
        });

        $('<img src="img/tilde32x32.png" class="logo"/>').insertAfter('.titlebar .titlebar-drag-region');

        function setMenuBarVisibility(visibility) {
            if(visibility)
                $('.menubar').removeClass('menu-hidden')
            else 
                $('.menubar').addClass('menu-hidden')
        }

        menuBarVisibility = false;
        setMenuBarVisibility(menuBarVisibility);
        $(document).keydown( (e) => { 
            if(e.altKey) {
                menuBarVisibility = !menuBarVisibility
                setMenuBarVisibility(menuBarVisibility);
            }
        });

        titlebar.updateStyles = function () {
            const color_1 = require("./node_modules/custom-electron-titlebar/lib/common/color");
            const dom_1 = require("./node_modules/custom-electron-titlebar/lib/common/dom");
            const INACTIVE_FOREGROUND_DARK = color_1.Color.fromHex('#222222');
            const ACTIVE_FOREGROUND_DARK = color_1.Color.fromHex('#333333');
            const INACTIVE_FOREGROUND = color_1.Color.fromHex('#EEEEEE');
            const ACTIVE_FOREGROUND = color_1.Color.fromHex('#FFFFFF');

            if (this.titlebar) {
                if (this.isInactive) {
                    dom_1.addClass(this.titlebar, 'inactive');
                }
                else {
                    dom_1.removeClass(this.titlebar, 'inactive');
                }
                const titleBackground = this.isInactive && this._options.unfocusEffect
                    ? this._options.backgroundColor.lighten(.16)
                    : this._options.backgroundColor;
                this.titlebar.style.backgroundColor = titleBackground.toString();
                let titleForeground;
                if (titleBackground.isLighter()) {
                    dom_1.addClass(this.titlebar, 'light');
                    titleForeground = this.isInactive && this._options.unfocusEffect
                        ? INACTIVE_FOREGROUND_DARK
                        : ACTIVE_FOREGROUND_DARK;
                }
                else {
                    dom_1.removeClass(this.titlebar, 'light');
                    titleForeground = this.isInactive && this._options.unfocusEffect
                        ? INACTIVE_FOREGROUND
                        : ACTIVE_FOREGROUND;
                }
                this.titlebar.style.color = titleForeground.toString();
                const backgroundColor = this._options.backgroundColor.darken(.16);
                const foregroundColor = backgroundColor.isLighter()
                    ? INACTIVE_FOREGROUND_DARK
                    : INACTIVE_FOREGROUND;
                const bgColor = !this._options.itemBackgroundColor || this._options.itemBackgroundColor.equals(backgroundColor)
                    ? new color_1.Color(new color_1.RGBA(0, 0, 0, .14))
                    : this._options.itemBackgroundColor;
                const fgColor = bgColor.isLighter() ? ACTIVE_FOREGROUND_DARK : ACTIVE_FOREGROUND;
                if (this.menubar) {
                    this.menubar.setStyles({
                        backgroundColor: backgroundColor,
                        foregroundColor: foregroundColor,
                        selectionBackgroundColor: bgColor,
                        selectionForegroundColor: fgColor,
                        separatorColor: foregroundColor
                    });
                }
            }
        }
    }
}

function hideUIonWin() {
    if(isWindows()) 
        $(document.body).addClass('hide-ui-windows');
}

function restoreUIonWin() {
    if(isWindows()) 
        $(document.body).removeClass('hide-ui-windows');
}

function setSearchWithoutFocus() {
    $(document).keypress(function (e) {
        if(!allPreferences.ui.isOpen) {
            let char = String.fromCharCode(e.which)
            if(!char.match(/^[^A-Za-z0-9+!?#\.\-\ ]+$/) && !$("input:focus").get(0)) {
                $('#search-input').focus();
            }
        }
    })
}

function setTitle(title) {
    if(title) {
        if(isWindows()) 
            $('.titlebar .window-title').html(`<span>${title}</span>`);
        else { 
            const { BrowserWindow } = require('electron').remote;
            BrowserWindow.getAllWindows()[0].setTitle(title);
        }
    }
}

function showWindow() {
    const { BrowserWindow } = require('electron').remote;
    let win = BrowserWindow.getAllWindows()[0];
    if(isWindows())
        win.show();
    else 
        win.webContents.on('did-finish-load', function() {
            win.show();
        }); 
}

function setWindowsThemeOnWin() {
    if(isWindows())
        $(document.body).addClass('windows');
}

function init() {
    if (!fs.existsSync(getSaveDirPath()))
        fs.mkdirSync(getSaveDirPath());

    loadPreferences();
    loadPlayerManager();

    loadFavoritePodcasts();
    loadFeeds();
    loadArchiveEpisodes();
    loadNewEpisodes();

    setSearchWithoutFocus();

    initController();
    
    readFeeds();
    setItemCounts();
    showNewEpisodesPage();
    
    restoreUIonWin();
}

function fileExistsAndIsNotEmpty(_File) {
    return (fs.existsSync(_File) && fs.readFileSync(_File, "utf-8") != "")
}

function isAlreadyFavorite(_FeedUrl) {
   return (allFavoritePodcasts.findByFeedUrl(_FeedUrl) != -1);
}

function episodeIsAlreadyInNewEpisodes(episodeUrl) {
    return (allNewEpisodes.findByEpisodeUrl(episodeUrl) != -1);
}

function getFileValue(filePath, _DestinationTag, _ReferenceTag, _Value) {
    var DestinationValue = null;

    let fileContent = ifExistsReadFile(filePath);
    if (fileContent == "")
        return DestinationValue;
    
    var json = JSON.parse(fileContent)

    for (let i in json)
        if (json[i][_ReferenceTag] == _Value) {
            DestinationValue = json[i][_DestinationTag];
            return DestinationValue;
        }

    return DestinationValue;
}

function getBestArtworkUrl(feedUrl) {
    let podcast = allFavoritePodcasts.getByFeedUrl(feedUrl); 

    if(podcast != undefined) {
        let Artwork = podcast.data.artworkUrl;
        if(Artwork != undefined && Artwork != 'undefined')
            return Artwork;
    }

    let $settingsImage = $('.settings-feed-image');
    if(allFeeds.ui.checkPageByFeedUrl(feedUrl) && 
        $settingsImage.get(0) && 
        (Artwork = $settingsImage.attr('src')))
        return Artwork;

    //Set "no Artwork" image
    Artwork = getGenericArtwork();
    return Artwork;
}

function getGenericArtwork() {
    return 'img/generic_podcast_image.png';
}

function isGenericArtwork(Artwork) {
    return (Artwork == getGenericArtwork());
}

function ifExistsReadFile(filePath) {
    let fileContent = "";
    if(fs.existsSync(filePath))
        fileContent = fs.readFileSync(filePath, "utf-8");
    return fileContent;
}

function clearTextField(_InputField) {
    _InputField.value = ""
}

function focusTextField(_InputField) {
    document.getElementById(_InputField).focus()
}

function loseFocusTextField(_InputField) {
    document.getElementById(_InputField).blur()
}

function getFullTime(_TimeInSeconds)
{
    var FullTime = {}

    var Hours = Math.floor(_TimeInSeconds / 3600)

    _TimeInSeconds = _TimeInSeconds - (Hours * 3600)

    var Minutes = Math.floor(_TimeInSeconds / 60)
    var Seconds = Math.floor(_TimeInSeconds - (Minutes * 60))

    FullTime.hours = Hours
    FullTime.minutes = Minutes
    FullTime.seconds = Seconds

    return FullTime
}

function parseFeedEpisodeDuration(_Duration) {
    if(_Duration == '') {
        return {
            minutes: "#",
            hours: "#"
        }
    }
    var Time = {}

    if (_Duration.length == 1) {
        var Time    = getFullTime(_Duration[0] * 60)
        var Hours   = "0"
        var Minutes = Time.hours.toString()
    } else if (_Duration.length == 2) {
        var Time    = getFullTime(_Duration[0] * 60)
        var Hours   = Time.hours.toString()
        var Minutes = Time.minutes.toString()
    } else {
        var Hours   = _Duration[0]
        var Minutes = _Duration[1]
    }

    Hours   = Hours.replace(/^0/, "")
    Minutes = Minutes.replace(/^0/, "")

    Time.hours = ((Hours == "") ? "0" : Hours)
    Time.minutes = Minutes

    Time.hours = "" + (parseInt(Time.hours) + Math.floor(parseInt(Time.minutes) / 60));
    Time.minutes = "" + (parseInt(Time.minutes) % 60);

    return Time
}

// ---------------------------------------------------------------------------------------------------------------------
// SETTINGS
// ---------------------------------------------------------------------------------------------------------------------

function getSettings(_FeedUrl) {
    return allFavoritePodcasts.getExcludeFromNewEpisodesByFeedUrl(_FeedUrl);
}

function changeSettings(_FeedUrl, excludeFromNewEpisodes) {
    allFavoritePodcasts.setExcludeFromNewEpisodesByFeedUrl(_FeedUrl, excludeFromNewEpisodes);
    
}

// ---------------------------------------------------------------------------------------------------------------------
// PREFERENCES
// ---------------------------------------------------------------------------------------------------------------------

function setPreference(key, value) {
    if(allPreferences.get(key) !== value)
        allPreferences.set(key, value);
}


function getPreference(key) {
    if(allPreferences)
        return allPreferences.get(key);
    
    if (fs.existsSync(getPreferencesFilePath()) && fs.readFileSync(getPreferencesFilePath(), "utf-8") != "") {
        let jsonContent = JSON.parse(fs.readFileSync(getPreferencesFilePath(), "utf-8"));
        return jsonContent[key];
    }
}

module.exports = getPreference
