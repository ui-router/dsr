import * as React from 'react';
import { UISref, UISrefActive, UIView } from '@uirouter/react';

export class ContinentList extends React.Component {
  render() {
    const { continents } = this.props;
    return (
      <div>
        <h3>Continents</h3>

        {continents.map((continent) => {
          return (
            <UISrefActive class="active" key={continent}>
              <span style={{ margin: '1em' }}>
                <UISref to=".countrylist" params={{ continent }}>
                  <a>{continent}</a>
                </UISref>
              </span>
            </UISrefActive>
          );
        })}

        <UIView />
      </div>
    );
  }
}
