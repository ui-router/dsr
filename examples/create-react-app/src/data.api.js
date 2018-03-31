function getContinents() {
  return Promise.resolve(require('./data.json'))
    .then(countries => countries.map(country => country.continent))
    .then(continents => continents.reduce((acc, continent) => acc.includes(continent) ? acc : acc.concat(continent), []))
}

function getCountries(continent) {
  return Promise.resolve(require('./data.json'))
    .then(countries => countries.filter(country => country.continent === continent))
    .then(countries => countries.map(country => country.name));
}

export { getContinents, getCountries };
