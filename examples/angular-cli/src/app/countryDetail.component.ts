import { Input, Component } from '@angular/core';

@Component({
  selector: 'country-detail-cmp',
  template: `
    <h3>{{ country }}</h3>
    <div style="height: 100px;">
      <img [src]="imageSrc()" [alt]="'flag of ' + country" />
    </div>
  `,
})
export class CountryDetailComponent {
  @Input() country: string = '';

  imageSrc() {
    if (!this.country) {
      return '';
    }
    const prefix = 'http://www.randomlists.com/img/national-flags/';
    const imageName = this.country.toLowerCase().replace(/ /g, '_');
    return `${prefix}${imageName}.gif`;
  }
}
