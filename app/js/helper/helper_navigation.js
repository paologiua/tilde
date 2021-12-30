// ---------------------------------------------------------------------------------------------------------------------
// LEFT COLUMN
// ---------------------------------------------------------------------------------------------------------------------

function setItemCounts() {
    $('#menu-episodes .menu-count').html(allNewEpisodes.length());
    $('#menu-favorites .menu-count').html(allFavoritePodcasts.length());
}

function setGridLayout(enable) {
    if (enable)
        $('#list').addClass("grid-layout");
    else
        $('#list').removeClass("grid-layout");
}

// ---------------------------------------------------------------------------------------------------------------------
// RIGHT COLUMN
// ---------------------------------------------------------------------------------------------------------------------

function setHeaderViewAction(_Mode) {
    let $content_right_header_actions = $('#content-right-header-actions');
    switch (_Mode) {
        case "list":
            $content_right_header_actions.html(s_ListView);
            $content_right_header_actions.find('svg').click(function () {
                toggleList('list');
            });
            break;

        case "grid":
            $content_right_header_actions.html(s_GridView);
            $content_right_header_actions.find('svg').click(function () {
                toggleList('grid');
            });
            break;

        default: 
            $content_right_header_actions.html(''); 
            break;
    }
}

function toggleList(_View) {
    switch (_View) {
        case "list":
            setGridLayout(false)
            setHeaderViewAction("grid")
            break;

        case "grid":
            setGridLayout(true)
            setHeaderViewAction("list")
            break;

        default: 
            break;
    }
}

// ---------------------------------------------------------------------------------------------------------------------
// MENU
// ---------------------------------------------------------------------------------------------------------------------

function clearMenuSelection() {
    $('#menu li').removeClass('selected');
}