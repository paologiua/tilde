
function translate() {
  translateByDescriptor(".new-episodes", 'New Episodes');
  translateByDescriptor(".favorites", 'Favorites');
  translateByDescriptor(".archive", 'Archive');
  translateByDescriptor(".settings", 'Settings');
  translateByDescriptor(".statistics", 'Statistics');

  translateByDescriptor('#content-left-player-title>div', 'No episode selected');

  
  translateByDescriptor(".dark-mode-translate", 'Dark mode');
  
  document.getElementsByName('search')[0].placeholder=i18n.__('Search');
}

function translateByDescriptor(descriptor, value){
  $(descriptor).html(i18n.__(value));
}
