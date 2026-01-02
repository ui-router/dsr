import { Input, Component } from '@angular/core';

@Component({
  selector: 'continent-list-cmp',
  template: `
    <h3>Continents</h3>

    <span *ngFor="let continent of continents" style="margin: 1em" uiSrefActive="active">
      <a uiSref=".countrylist" [uiParams]="{ continent: continent }">{{ continent }}</a>
    </span>

    <ui-view></ui-view>
  `,
})
export class ContinentListComponent {
  @Input() continents: string[] = [];
}
