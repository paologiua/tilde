
function translate() {
  translateByDescriptor(".new-episodes", 'New Episodes');
  translateByDescriptor(".favorites", 'Favorites');
  translateByDescriptor(".archive", 'Archive');
  translateByDescriptor(".refresh", 'Refresh');
  translateByDescriptor(".statistics", 'Statistics');

  translateByDescriptor('#content-left-player-title>div', 'No episode selected');
  
  document.getElementsByName('search')[0].placeholder=i18n.__('Search');
}

function translateByDescriptor(descriptor, value){
  $(descriptor).html(i18n.__(value));
}
