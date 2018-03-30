import { APP_MODULE } from './app.module';
APP_MODULE.component('countryList', {
  template: `
    <ui-view></ui-view>

    <div class="container">
      <a ng-repeat="country in $ctrl.countries"
         ui-sref=".countrydetail({ country: country })"
         ui-sref-active="active"
      >
        {{ country }}
      </a>
    </div>
  `,
  bindings: {
    countries: '<',
  },
});


