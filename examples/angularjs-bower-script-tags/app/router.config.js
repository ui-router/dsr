console.log(window['@uirouter/visualizer'])
var Visualizer = window['@uirouter/visualizer'].Visualizer;
var DSRPlugin = window['@uirouter/dsr'].DSRPlugin;

var states = [
  {
    name: 'continentlist',
    url: '/continents',
    dsr: true,
    component: 'continentList',
    resolve: {
      'continents': () => getContinents(),
    },
  },

  {
    name: 'continentlist.countrylist',
    url: '/:continent',
    component: 'countryList',
    resolve: {
      'countries': ($transition$) => getCountries($transition$.params().continent),
    },
  },

  {
    name: 'continentlist.countrylist.countrydetail',
    url: '/:country',
    component: 'countryDetail',
    resolve: {
      'country': ($transition$) => $transition$.params().country,
    },
  },

  {
    name: 'about',
    url: '/about',
    component: 'about',
  },
];

angular.module('app', ['ui.router']).config(function ($uiRouterProvider) {
  $uiRouterProvider.plugin(DSRPlugin);
  $uiRouterProvider.plugin(Visualizer);

  // Add states
  states.forEach(state => $uiRouterProvider.stateRegistry.register(state));

  // Set initial state
  $uiRouterProvider.urlService.rules.initial({ state: 'about' });
});


function getContinents() {
  return fetch('app/data.json').then(res => res.json())
      .then(countries => countries.map(country => country.continent))
      .then(continents => continents.reduce((acc, continent) => acc.includes(continent) ? acc : acc.concat(continent), []))
}

function getCountries(continent) {
  return fetch('app/data.json').then(res => res.json())
      .then(countries => countries.filter(country => country.continent === continent))
      .then(countries => countries.map(country => country.name));
}
