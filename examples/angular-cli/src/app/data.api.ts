import data from './data.json';

interface Country {
  name: string;
  continent: string;
}

export function getContinents(): Promise<string[]> {
  return Promise.resolve(data as Country[])
    .then((countries) => countries.map((country) => country.continent))
    .then((continents) =>
      continents.reduce((acc: string[], continent) => (acc.includes(continent) ? acc : acc.concat(continent)), [])
    );
}

export function getCountries(continent: string): Promise<string[]> {
  return Promise.resolve(data as Country[])
    .then((countries) => countries.filter((country) => country.continent === continent))
    .then((countries) => countries.map((country) => country.name));
}
