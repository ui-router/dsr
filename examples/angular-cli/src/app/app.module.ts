import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { UIRouterModule } from '@uirouter/angular';
import { UIRouter } from '@uirouter/core';
import { DSRPlugin } from '@uirouter/dsr';
import { Visualizer } from '@uirouter/visualizer';

import { AppComponent } from './app.component';
import { CountryDetailComponent } from './countryDetail.component';
import { CountryListComponent } from './countryList.component';
import { getContinents, getCountries } from './data.api';
import { ContinentListComponent } from './continentList.component';
import { AboutComponent } from './about.component';

export const states = [
  {
    name: 'continentlist',
    url: '/continents',
    dsr: true,
    component: ContinentListComponent,
    resolve: {
      'continents': () => getContinents() },
  },

  {
    name: 'continentlist.countrylist',
    url: '/:continent',
    component: CountryListComponent,
    resolve: {
      'countries': ($transition$) => getCountries($transition$.params().continent)
    },
  },

  {
    name: 'continentlist.countrylist.countrydetail',
    url: '/:country',
    component: CountryDetailComponent,
    resolve: {
      'country': ($transition$) => $transition$.params().country
    },
  },

  {
    name: 'about',
    url: '/about',
    component: AboutComponent,
  }
];

export function configFn(router: UIRouter) {
  states.forEach(state => router.stateRegistry.register(state));
  router.urlService.rules.initial({ state: 'home' });
  router.plugin(DSRPlugin);
  router.plugin(Visualizer);
}

@NgModule({
  declarations: [
    AboutComponent,
    AppComponent,
    ContinentListComponent,
    CountryDetailComponent,
    CountryListComponent,
  ],
  entryComponents: [
    AboutComponent,
    AppComponent,
    ContinentListComponent,
    CountryDetailComponent,
    CountryListComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    UIRouterModule.forRoot({
      config: configFn,
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
