import axios from 'axios';

const diagramAPI = {
    getGlobalDataFromApi() {
        return axios.get('https://disease.sh/v3/covid-19/historical/all?lastdays=366');
    },
    getLocaleDataFromApi(country) {
        return axios.get(`https://disease.sh/v3/covid-19/historical/${country}?lastdays=366`);
    },
    getLocaleDataPopulationFromApi(country) {
        return axios.get(`https://disease.sh/v3/covid-19/countries/${country}`);
    },
};

const headerAPI = {
    getCountries() {
        return axios.get('https://disease.sh/v3/covid-19/historical?lastdays=1');
    },
};

const listAPI = {
    getCountriesForTwoDays() {
        return axios.get('https://disease.sh/v3/covid-19/historical?lastdays=2');
    },
};

const mapAPI = {
    getAllData() {
        return axios.get('https://disease.sh/v3/covid-19/countries');
    },
    getCountryName(lat, lng) {
        return axios.get(`https://secure.geonames.org/countryCodeJSON?lat=${lat}&lng=${lng}&username=asbarn`);
    },
};

const tableAPI = {
    getAllData() {
        return axios.get('https://disease.sh/v3/covid-19/all');
    },
};

export {
    headerAPI, mapAPI, diagramAPI, tableAPI, listAPI,
};
