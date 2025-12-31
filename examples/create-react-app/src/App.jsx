import React, { Component } from 'react';
import { UIRouter, UISref, UISrefActive, UIView } from '@uirouter/react';
import { pushStateLocationPlugin } from '@uirouter/core';
import { Visualizer } from '@uirouter/visualizer';
import { DSRPlugin } from '@uirouter/dsr';

import { ContinentList } from './ContinentList';
import { CountryList } from './CountryList';
import { About } from './About';
import { CountryDetail } from './CountryDetail';

import { getContinents, getCountries } from './data.api';

import './App.css';

const plugins = [pushStateLocationPlugin, Visualizer, DSRPlugin];

export const states = [
  {
    name: 'continentlist',
    url: '/continents',
    dsr: true,
    component: ContinentList,
    resolve: {
      continents: () => getContinents(),
    },
  },

  {
    name: 'continentlist.countrylist',
    url: '/:continent',
    component: CountryList,
    resolve: {
      countries: ['$transition$', ($transition$) => getCountries($transition$.params().continent)],
    },
  },

  {
    name: 'continentlist.countrylist.countrydetail',
    url: '/:country',
    component: CountryDetail,
    resolve: {
      country: ['$transition$', ($transition$) => $transition$.params().country],
    },
  },

  {
    name: 'about',
    url: '/about',
    component: About,
  },
];

function routerConfig(router) {
  // Set initial state
  router.urlService.rules.initial({ state: 'about' });
}

class App extends Component {
  render() {
    return (
      <UIRouter plugins={plugins} states={states} config={routerConfig}>
        <nav data-testid="navigation">
          <UISrefActive class="active">
            <UISref to="about">
              <a>about</a>
            </UISref>
          </UISrefActive>

          <UISrefActive class="active">
            <UISref to="continentlist">
              <a>continentlist</a>
            </UISref>
          </UISrefActive>
        </nav>

        <UIView />
      </UIRouter>
    );
  }
}

export default App;
