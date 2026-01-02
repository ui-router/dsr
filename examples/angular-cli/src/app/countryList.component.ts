import { Input, Component } from '@angular/core';

@Component({
  selector: 'country-list-cmp',
  template: `
    <ui-view></ui-view>

    <div class="container">
      <a
        *ngFor="let country of countries"
        uiSref=".countrydetail"
        [uiParams]="{ country: country }"
        uiSrefActive="active"
      >
        {{ country }}
      </a>
    </div>
  `,
  styles: [
    `
      .container {
        display: flex;
        flex-flow: row wrap;
      }
      .container > * {
        border: 1px solid;
        padding: 0.5em;
        margin: 0.5em;
        flex: 1 1 75px;
      }
      .container > a.active {
        background: lightgray;
      }
    `,
  ],
})
export class CountryListComponent {
  @Input() countries: string[] = [];
}
