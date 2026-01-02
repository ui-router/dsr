import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { UIRouterModule, Ng2StateDeclaration } from '@uirouter/angular';
import { UIRouter } from '@uirouter/core';
import { DSRPlugin } from '@uirouter/dsr';
import { Visualizer } from '@uirouter/visualizer';

import { AppComponent } from './app.component';
import { CountryDetailComponent } from './countryDetail.component';
import { CountryListComponent } from './countryList.component';
import { getContinents, getCountries } from './data.api';
import { ContinentListComponent } from './continentList.component';
import { AboutComponent } from './about.component';

export const states: Ng2StateDeclaration[] = [
  {
    name: 'continentlist',
    url: '/continents',
    dsr: true,
    component: ContinentListComponent,
    resolve: [
      {
        token: 'continents',
        resolveFn: () => getContinents(),
      },
    ],
  },
  {
    name: 'continentlist.countrylist',
    url: '/:continent',
    component: CountryListComponent,
    resolve: [
      {
        token: 'countries',
        deps: ['$transition$'],
        resolveFn: (trans: any) => getCountries(trans.params().continent),
      },
    ],
  },
  {
    name: 'continentlist.countrylist.countrydetail',
    url: '/:country',
    component: CountryDetailComponent,
    resolve: [
      {
        token: 'country',
        deps: ['$transition$'],
        resolveFn: (trans: any) => trans.params().country,
      },
    ],
  },
  {
    name: 'about',
    url: '/about',
    component: AboutComponent,
  },
];

export function configFn(router: UIRouter) {
  states.forEach((state) => router.stateRegistry.register(state));
  router.urlService.rules.initial({ state: 'about' });
  router.plugin(DSRPlugin);
  router.plugin(Visualizer);
}

@NgModule({
  declarations: [AboutComponent, AppComponent, ContinentListComponent, CountryDetailComponent, CountryListComponent],
  imports: [
    BrowserModule,
    CommonModule,
    UIRouterModule.forRoot({
      config: configFn,
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
