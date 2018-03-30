import { Visualizer } from '@uirouter/visualizer';
import { DSRPlugin } from '@uirouter/dsr';

import { APP_MODULE } from './app.module';
import { getContinents, getCountries } from './data.api';

import './about.component';
import './continentList.component';
import './countryDetail.component';
import './countryList.component';

export const states = [
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

APP_MODULE.config(function ($uiRouterProvider) {
  $uiRouterProvider.plugin(DSRPlugin);
  $uiRouterProvider.plugin(Visualizer);

  // Add states
  states.forEach(state => $uiRouterProvider.stateRegistry.register(state));

  // Set initial state
  $uiRouterProvider.urlService.rules.initial({ state: 'about' });
});
