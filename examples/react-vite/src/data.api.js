import data from './data.json';

export function getContinents() {
  return Promise.resolve(data)
    .then((countries) => countries.map((country) => country.continent))
    .then((continents) =>
      continents.reduce((acc, continent) => (acc.includes(continent) ? acc : acc.concat(continent)), [])
    );
}

export function getCountries(continent) {
  return Promise.resolve(data)
    .then((countries) => countries.filter((country) => country.continent === continent))
    .then((countries) => countries.map((country) => country.name));
}
