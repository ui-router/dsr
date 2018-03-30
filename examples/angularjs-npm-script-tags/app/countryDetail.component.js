angular.module('app').component('countryDetail', {
  template: `
    <h3>{{ $ctrl.country }}</h3>
    <div style="height: 100px;">
      <img src="{{ $ctrl.imageSrc() }}" [alt]="'flag of ' + $ctrl.country">
    </div>
  `,
  controller: function () {
    this.imageSrc = function() {
      if (!this.country) { return ''; }
      const prefix = 'http://www.randomlists.com/img/national-flags/';
      const imageName = this.country.toLowerCase().replace(/ /g, '_');
      return `${prefix}${imageName}.gif`;
    };
  },
  bindings: {
    country: '<',
  },
});


