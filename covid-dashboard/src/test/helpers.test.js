import {
    countryInclude, removeDuplicateCountries,
    sortData, convertCountryName, addCriterions,
} from '../common/helpers';

const countries = [
    { country: 'Afghanistan' },
    { country: 'Albania' },
    { country: 'Algeria' },
    { country: 'Andorra' },
    { country: 'Angola' },
    { country: 'Anguilla' },
    { country: 'Antigua and Barbuda' },
    { country: 'Argentina' },
    { country: 'Armenia' },
    { country: 'Aruba' },
    { country: 'Australia' },
    { country: 'Austria' },
];

test('should return false', () => {
    expect(countryInclude(countries, 'Belarus')).toBe(false);
});

test('should return true', () => {
    expect(countryInclude(countries, 'Argentina')).toBe(true);
});

test('should return true', () => {
    expect(countryInclude(countries, 'Antigua and Barbuda')).toBe(true);
});

const duplicateCountries = [
    { country: 'Afghanistan' },
    { country: 'Albania' },
    { country: 'Algeria' },
    { country: 'Algeria' },
    { country: 'Andorra' },
    { country: 'Angola' },
    { country: 'Anguilla' },
    { country: 'Antigua and Barbuda' },
    { country: 'Argentina' },
    { country: 'Armenia' },
    { country: 'Armenia' },
    { country: 'Aruba' },
    { country: 'Australia' },
    { country: 'Australia' },
    { country: 'Austria' },
];

const duplicateCountriesResult = [
    { country: 'Afghanistan' },
    { country: 'Albania' },
    { country: 'Algeria' },
    { country: 'Andorra' },
    { country: 'Angola' },
    { country: 'Anguilla' },
    { country: 'Antigua and Barbuda' },
    { country: 'Argentina' },
    { country: 'Armenia' },
    { country: 'Aruba' },
    { country: 'Australia' },
    { country: 'Austria' },
];

test('should return not duplicate countries', () => {
    expect(removeDuplicateCountries(duplicateCountries)).toEqual(duplicateCountriesResult);
});

const sortDataArray = [
    { country: 'Albania', value: 28776 },
    { country: 'Aruba', value: 13318 },
    { country: 'Algeria', value: 19945 },
    { country: 'Andorra', value: 24183 },
    { country: 'Angola', value: 2525 },
    { country: 'Anguilla', value: 19256 },
    { country: 'Antigua and Barbuda', value: 17828 },
    { country: 'Argentina', value: 20525 },
    { country: 'Armenia', value: 13856 },
    { country: 'Afghanistan', value: 36804 },
    { country: 'Australia', value: 9810 },
    { country: 'Austria', value: 8513 },
];

const sortedDataByValue = [
    { country: 'Afghanistan', value: 36804 },
    { country: 'Albania', value: 28776 },
    { country: 'Andorra', value: 24183 },
    { country: 'Argentina', value: 20525 },
    { country: 'Algeria', value: 19945 },
    { country: 'Anguilla', value: 19256 },
    { country: 'Antigua and Barbuda', value: 17828 },
    { country: 'Armenia', value: 13856 },
    { country: 'Aruba', value: 13318 },
    { country: 'Australia', value: 9810 },
    { country: 'Austria', value: 8513 },
    { country: 'Angola', value: 2525 },
];
const fetchedCountries = [
    {
        cases: 155440,
        country: 'Armenia',
        deaths: 2691,
        population: 2965893,
        recovered: 135638,
        todayCases: 838,
        todayDeaths: 18,
        todayRecovered: 1052,
    },
    {
        cases: 32399,
        country: 'Uganda',
        deaths: 245,
        population: 46415146,
        recovered: 10731,
        todayCases: 489,
        todayDeaths: 7,
        todayRecovered: 85,
    }];
const changedCountries = [
    {
        cases: 155440,
        casesPer100K: 5241,
        country: 'Armenia',
        deaths: 2691,
        deathsPer100K: 91,
        population: 2965893,
        recovered: 135638,
        recoveredPer100K: 4573,
        todayCases: 838,
        todayCasesPer100K: 28,
        todayDeaths: 18,
        todayDeathsPer100K: 1,
        todayRecovered: 1052,
        todayRecoveredPer100K: 35,
    },
    {
        cases: 32399,
        casesPer100K: 70,
        country: 'Uganda',
        deaths: 245,
        deathsPer100K: 1,
        population: 46415146,
        recovered: 10731,
        recoveredPer100K: 23,
        todayCases: 489,
        todayCasesPer100K: 1,
        todayDeaths: 7,
        todayDeathsPer100K: 0,
        todayRecovered: 85,
        todayRecoveredPer100K: 0,
    }];

test('should return sortingByValue Array', () => {
    expect(sortData(sortDataArray, 'value')).toEqual(sortedDataByValue);
});

test('should return converted country name', () => {
    expect(convertCountryName('United States')).toEqual('USA');
    expect(convertCountryName('United Kingdom')).toEqual('UK');
});

test('should return country name', () => {
    expect(convertCountryName('Belarus')).toEqual('Belarus');
    expect(convertCountryName('Russia')).toEqual('Russia');
});

test('should return country with new properties', () => {
    expect(() => {
        addCriterions(fetchedCountries);
        return (fetchedCountries[0] === changedCountries[0]
            && fetchedCountries[1] === changedCountries[1]);
    });
});
