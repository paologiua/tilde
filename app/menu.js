const { app, Menu } = require('electron').remote

const template = [
    {
        label: i18n.__('Player'),
        submenu: [
            {
                label: i18n.__('Play/Pause'),
                accelerator: "CommandOrControl+Space",
                click() {
                    if (document.activeElement.type == undefined) 
                        playerManager.togglePlayPause("play-pause");
                }
            },
            {
                type: 'separator'
            },
            {
                label: i18n.__('30sec Reply'),
                accelerator: "CommandOrControl+Left",
                click() { playerManager.reply(); }
            },
            {
                label: i18n.__("30sec Forward"),
                accelerator: "CommandOrControl+Right",
                click() { playerManager.forward(); }
            }
        ]
    },
    {
        label: i18n.__('Go To'),
        submenu: [
            {
                label: i18n.__("Search"),
                accelerator: "CommandOrControl+F",
                click() { showPage('search'); }
            },
            {type: 'separator'},
            {
                label: i18n.__("New Episodes"),
                accelerator: "CommandOrControl+1",
                click() { showPage('newEpisodes'); }
            },
            {
                label: i18n.__("Favorites"),
                accelerator: "CommandOrControl+2",
                click() { showPage('favorites'); }
            },
            {
                label: i18n.__("Settings"),
                accelerator: "CommandOrControl+3",
                click() { showPage('settings'); }
            },
            {
                label: i18n.__("Archive"),
                accelerator: "CommandOrControl+4",
                click() { showPage('archive'); }
            },
            {
                label: i18n.__("Statistics"),
                accelerator: "CommandOrControl+5",
                click() { showPage('statistics'); }
            }
        ]
    },
    {
        label: i18n.__('Settings'),
        submenu: [
            {
                label: i18n.__('darkmode'),
                type: "checkbox",
                accelerator: "CommandOrControl+Shift+L",
                checked: getPreference('darkmode'),
                click() { preferences_functions.f('darkmode'); }
            },
            process.platform !== 'win32' ? undefined : {
                label: i18n.__('acrylic'),
                type: "checkbox",
                accelerator: "CommandOrControl+Shift+K",
                checked: getPreference('acrylic'),
                click() { preferences_functions.f('acrylic'); }
            },
            !isDevMode() ? undefined : {
                type: 'separator'
            },
            !isDevMode() ? undefined : {
                role: 'toggledevtools'
            },
        ].filter(x => x !== undefined)
    }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)
