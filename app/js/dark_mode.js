const {Menu} = require('electron').remote

// ---------------------------------------------------------------------------------------------------------------------

function darkMode() {
    var darkModeMenu = getDarkModeMenuItem();

    if(darkModeMenu.checked) {
        setPreference('darkmode', true);
        $('head').append('<link rel="stylesheet" href="./css/dark_layout.css">');
        
        if(titlebar != null) {
            const customTitlebar = require('custom-electron-titlebar');
            titlebar.updateBackground(customTitlebar.Color.fromHex('#1c1c1c'));
        }
    } else {
        setPreference('darkmode', false)
        $("head > link[href$='dark_layout.css']").remove();
        
        if(titlebar != null) {
            const customTitlebar = require('custom-electron-titlebar');
            titlebar.updateBackground(customTitlebar.Color.fromHex('#bbb'));
        }
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

    var menuItem = null;

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
