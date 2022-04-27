/* eslint-disable no-param-reassign */
function countryInclude(countries, countryName) {
    return (
        countries.findIndex((country) => {
            const firstCountry = country.country;
            const secondCountry = countryName;
            return firstCountry === secondCountry;
        }) !== -1
    );
}

function removeDuplicateCountries(data) {
    return data.filter((item, index, array) => {
        const countryIndex = array.findIndex(
            (current) => current.country === item.country,
        );
        return countryIndex === index;
    });
}

function excludeCountries(countries, prohibitedCountries) {
    return countries.filter(
        (country) => !prohibitedCountries.includes(country.country),
    );
}

function sortData(array, field) {
    array.sort((a, b) => (a[field] > b[field] ? 1 : -1)).reverse();
    return array;
}

function convertCountryName(str) {
    switch (str) {
        case 'United States':
            return 'USA';
        case 'United Kingdom':
            return 'UK';
        case 'South Korea':
            return 'S. Korea';
        case undefined:
            return 'Global';

        case null:
            return 'Global';

        default:
            return str;
    }
}

function addCriterions(data) {
    data.forEach((element) => {
        element.casesPer100K = Number.isFinite(
            Math.round((element.cases * 100000)
                / element.population),
        ) ? Math.round((element.cases * 100000)
            / element.population) : 100;

        element.deathsPer100K = Number.isFinite(
            Math.round((element.deaths * 100000)
                / element.population),
        ) ? Math.round((element.deaths * 100000)
            / element.population) : 100;

        element.recoveredPer100K = Number.isFinite(
            Math.round((element.recovered * 100000)
                / element.population),
        ) ? Math.round((element.recovered * 100000)
            / (element.population)) : 100;

        element.todayCasesPer100K = Number.isFinite(
            Math.round((element.todayCases * 100000)
                / element.population),
        ) ? Math.round((element.todayCases * 100000)
            / element.population) : 1;

        element.todayDeathsPer100K = Number.isFinite(
            Math.round((element.todayDeaths * 100000)
                / element.population),
        ) ? Math.round((element.todayDeaths * 100000)
            / element.population) : 1;

        element.todayRecoveredPer100K = Number.isFinite(
            Math.round((element.todayRecovered * 100000)
                / element.population),
        ) ? Math.round((element.todayRecovered * 100000)
            / element.population) : 1;
    });
}
export {
    countryInclude, removeDuplicateCountries, excludeCountries,
    sortData, convertCountryName, addCriterions,
};
