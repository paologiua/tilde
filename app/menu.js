const { app, Menu } = require('electron').remote
/* const { webFrame } = require('electron') */

const template =
[/* 
	{
        label: i18n.__('View'),
        submenu:
        [
            {role: 'reload', label: i18n.__('Reload')},
            {type: 'separator'},
            {role: 'resetzoom', label: i18n.__('Reset Zoom')},
            {role: 'zoomin', label: i18n.__('Zoom In'), accelerator: "CommandOrControl+="},
            {role: 'zoomout', label: i18n.__('Zoom Out')},
            {type: 'separator'},
            {
                label: i18n.__('Dark Mode'),
                type: "checkbox",
                accelerator: "CommandOrControl+Shift+L",
                checked: getPreference('darkmode'),
                click() { 
                    changeThemeMode()
                    darkMode()
                }
            },
            {role: 'togglefullscreen', label: i18n.__('Toggle Full Screen')}
        ]
    }, */
    {
        label: i18n.__('Player'),
        submenu:
        [
            {
                label: i18n.__('Play/Pause'),
                accelerator: "CommandOrControl+Space",
                click()
                {
                    // NOTE: if focus is not in any input field (search, playlist)
                    if (document.activeElement.type == undefined)
                    {
                        playerManager.togglePlayPause("play-pause")
                    }
                }
            },
            {type: 'separator'},
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
        submenu:
        [
            {
                label: i18n.__("Search"),
                accelerator: "CommandOrControl+F",
                click() { focusTextField("search-input") }
            },
            {type: 'separator'},
            {
                label: i18n.__("New Episodes"),
                accelerator: "CommandOrControl+1",
                click() { showNewEpisodesPage(); }
            },
            {
                label: i18n.__("Favorites"),
                accelerator: "CommandOrControl+2",
                click() { showFavoritesPage(); }
            },
            {
                label: i18n.__("Archive"),
                accelerator: "CommandOrControl+3",
                click() { showArchivePage(); }
            },
            {
                label: i18n.__("Statistics"),
                accelerator: "CommandOrControl+4",
                click() { showStatisticsPage(); }
            }/* ,
            {type: 'separator'},
            {
                label: i18n.__("New List"),
                accelerator: "CommandOrControl+N",
                click() { focusTextField("new_list-input") }
            } */
        ]
    },
    {
        label: i18n.__('Settings'),
        submenu:
        [/* {
                label: i18n.__("Minimize"),
                type: "checkbox",
                checked: getPreference('minimize'),
                accelerator: "CommandOrControl+Shift+M",
                click() { 
                    changeMinimizeMenuItem()
                    setMinimize() 
                }
            }, */
            {
                label: i18n.__('Dark Mode'),
                type: "checkbox",
                accelerator: "CommandOrControl+Shift+L",
                checked: getPreference('darkmode'),
                click() { 
                    changeThemeMode()
                    darkMode()
                }
            },
            {type: 'separator'},
            {role: 'toggledevtools'}
        ]
    }
]
/* 
if(process.platform === 'win32') {
    template[0].submenu.splice(2, 3, 
            {
                label: 'Reset Zoom',
                accelerator: "CommandOrControl+O",
                click() { 
                    webFrame.setZoomFactor(1);
                }
            },
            {
                label: 'Zoom In',
                accelerator: "CommandOrControl+=",
                click() { 
                    let zoomFactor = webFrame.getZoomFactor() + 0.1;
                    if(zoomFactor < 2)
                        webFrame.setZoomFactor(zoomFactor);
                }
            },
            {
                label: 'Zoom Out',
                accelerator: "CommandOrControl+-",
                click() { 
                    let zoomFactor = webFrame.getZoomFactor() - 0.1;
                    if(zoomFactor > 0)
                        webFrame.setZoomFactor(zoomFactor);
                }
            }
    );
}
 */

if (process.platform === 'darwin')
{
    template.unshift
    ({
        label: app.getName(),
        submenu:
        [
            {role: 'about'},
            {type: 'separator'},
            {role: 'services', submenu: []},
            {type: 'separator'},
            {role: 'hide'},
            {role: 'hideothers'},
            {role: 'unhide'},
            {type: 'separator'},
            {role: 'quit'}
        ]
    })
}

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)
