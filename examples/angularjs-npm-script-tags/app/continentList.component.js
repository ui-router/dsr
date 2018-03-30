angular.module('app').component('continentList', {
  template: `
    <h3>Continents</h3>

    <span ng-repeat="continent in $ctrl.continents" style="margin: 1em" ui-sref-active="active">
      <a ui-sref=".countrylist({ continent: continent })">{{ continent }}</a>
    </span>

    <ui-view></ui-view>
  `,
  bindings: {
    continents: '<',
  },
});


