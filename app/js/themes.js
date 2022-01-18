const {Menu} = require('electron').remote

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

function setUIAcrylic() {
    $('body').addClass('acrylic');
}

function removeUIAcrylic() {
    $('body').removeClass('acrylic');
}

function loadTheme() {
    if(getPreference('darkmode'))
        setUIDark();
    
    if(getPreference('acrylic'))
        setUIAcrylic();
}

function setMenuItemState(preference, state) {
    let menuItem = getMenuItem(preference);
    menuItem.checked = state;
    updateMenuItemUI(preference, state);
    return menuItem;
}

function updateMenuItemUI(preference, state) {
    let $el = $(`.titlebar .menubar .action-label[aria-label="${i18n.__(preference)}"]`).parent();
    if(state)
        $el.addClass('checked');
    else
        $el.removeClass('checked');
}

function getMenuItem(label) {
    let menuItem = null;

    for (let i in Menu.getApplicationMenu().items) {
        appMenuItem = Menu.getApplicationMenu().items[i];

        for (let j in appMenuItem.submenu.items) {
            if (appMenuItem.submenu.items[j].label == i18n.__(label) && appMenuItem.submenu.items[j].type == "checkbox") {
                menuItem = appMenuItem.submenu.items[j];
                break;
            }
        }

        if (menuItem != null)
            break;
    }

    return menuItem;
}
