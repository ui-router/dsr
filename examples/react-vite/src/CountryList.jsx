import * as React from 'react';
import { UISref, UISrefActive, UIView } from '@uirouter/react';

export class CountryList extends React.Component {
  render() {
    const { countries } = this.props;

    return (
      <div>
        <UIView />

        <div className="container">
          {countries.map((country) => {
            return (
              <UISrefActive class="active" key={country}>
                <UISref to=".countrydetail" params={{ country }}>
                  <a>{country}</a>
                </UISref>
              </UISrefActive>
            );
          })}
        </div>
      </div>
    );
  }
}
