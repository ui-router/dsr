import * as React from 'react';

export class CountryDetail extends React.Component {
  render() {
    const { country } = this.props;
    if (!country) return null;

    const prefix = '//www.randomlists.com/img/national-flags/';
    const imageName = country.toLowerCase().replace(/ /g, '_');
    const imgSrc = `${prefix}${imageName}.gif`;
    const alt = `flag of ${country}}`;

    return (
      <div>
        <h3>{country}</h3>
        <div style={{ height: '100px' }}>
          <img src={imgSrc} alt={alt} />
        </div>
      </div>
    );
  }
}
