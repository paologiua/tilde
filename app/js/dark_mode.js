const {Menu} = require('electron').remote

// ---------------------------------------------------------------------------------------------------------------------

function setUIDark() {
    $('body').addClass('dark-mode');
        
    if(titlebar != null) {
        const customTitlebar = require('custom-electron-titlebar');
        titlebar.updateBackground(customTitlebar.Color.fromHex('#1c1c1c'));

        const { BrowserWindow } = require('electron').remote; // #222222c2
        BrowserWindow.getAllWindows()[0].setVibrancy({theme: 'dark'});
    }
}

function setUILight() {
    $('body').removeClass('dark-mode');
        
    if(titlebar != null) {
        const customTitlebar = require('custom-electron-titlebar');
        titlebar.updateBackground(customTitlebar.Color.fromHex('#bbb'));
        
        const { BrowserWindow } = require('electron').remote; // #eeeeee14
        BrowserWindow.getAllWindows()[0].setVibrancy({theme: 'light'});
    }
}

function updateUITheme() {
    var darkModeMenu = getDarkModeMenuItem();

    if(darkModeMenu.checked) {
        setPreference('darkmode', true);
        setUIDark();
    } else {
        setPreference('darkmode', false);
        setUILight();
    }
}

function changeThemeMode() {
    let darkModeMenu = getDarkModeMenuItem();
    darkModeMenu.checked = !getPreference('darkmode');
}

// ---------------------------------------------------------------------------------------------------------------------

function getDarkModeMenuItem() {
    // NOTE: Go through all menu items
    // NOTE: Find the "Dark Mode" menu item

    let menuItem = null;

    for (let i in Menu.getApplicationMenu().items) {
        appMenuItem = Menu.getApplicationMenu().items[i];

        for (let j in appMenuItem.submenu.items) {
            if (appMenuItem.submenu.items[j].label == i18n.__('Dark Mode') && appMenuItem.submenu.items[j].type == "checkbox") {
                menuItem = appMenuItem.submenu.items[j];
                break;
            }
        }

        if (menuItem != null)
            break;
    }

    return menuItem;
}
