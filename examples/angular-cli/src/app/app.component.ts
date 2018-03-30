import { Component } from '@angular/core';
import { StateService } from '@uirouter/core';

@Component({
  selector: 'app-root',
  template: `
    <a uiSref="about" uiSrefActive="active">about</a>
    <a uiSref="continentlist" uiSrefActive="active">continentlist</a>

    <ui-view></ui-view>
  `,
  styles: [`
    .active { font-weight: bold }
  `]
})
export class AppComponent {
  constructor(public $state: StateService) {

  }
  isActive(stateName: string) {
    return this.$state.includes(stateName)
  }
}
