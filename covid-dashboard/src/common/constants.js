const DIAGRAM_WORD_POPULATION = 7753933875;
const ACCESS_TOKEN = 'sk.eyJ1IjoiYXNiYXJuIiwiYSI6ImNraW16YjR6czAzeXoyeW95cHUya3djdTIifQ.nhucE6in6G6-Np4PI-CyFA';

const CRITERIONS = [
    {
        name: 'Total number of cases',
        value: 'cases',
        color: '#BC0000',
    },
    {
        name: 'Total number of deaths',
        value: 'deaths',
        color: '#ffff0a',
    },
    {
        name: 'Total number of recoveries',
        value: 'recovered',
        color: '#00bc00',
    },
    {
        name: 'Number of cases in the last day',
        value: 'todayCases',
        color: '#880000',
    },
    {
        name: 'Number of deaths in the last day',
        value: 'todayDeaths',
        color: '#9000ff',
    },
    {
        name: 'Number of recoveries in the last day',
        value: 'todayRecovered',
        color: '#0042E5',
    },
    {
        name: 'Number of cases per 100 thousand population',
        value: 'casesPer100K',
        color: '#FF1493',
    },
    {
        name: 'Number of deaths per 100 thousand population',
        value: 'deathsPer100K',
        color: '#727317',
    },
    {
        name: 'Number of recoveries per 100 thousand population',
        value: 'recoveredPer100K',
        color: '#34ebe5',
    },
    {
        name: 'Number of cases per 100 thousand population in the last day',
        value: 'todayCasesPer100K',
        color: '#EE5A5A',
    },
    {
        name: 'Number of deaths per 100 thousand population in the last day',
        value: 'todayDeathsPer100K',
        color: '#FFA500',
    },
    {
        name: 'Number of recoveries per 100 thousand population in the last day',
        value: 'todayRecoveredPer100K',
        color: '#15153D',
    },
];

const EXCLUSION_CONTRIES = [
    'Aruba', 'Palestine', 'Myanmar', 'French Polynesia', 'French Guiana', 'Réunion', 'Guadeloupe', 'Hong Kong', 'Mayotte',
    'Martinique', 'Curaçao', 'Sint Maarten', 'Gibraltar', 'Saint Martin', 'Turks and Caicos Islands', 'Faroe Islands', 'Bermuda',
    'Isle of Man', 'Cayman Islands', 'Caribbean Netherlands', 'St. Barth', 'British Virgin Islands', 'Macao', 'Holy See (Vatican City State)', 'Greenland',
    'Falkland Islands (Malvinas)', 'Saint Pierre Miquelon', 'Montserrat', 'Anguilla', 'Western Sahara', 'Wallis and Futuna', 'Channel Islands',
];

export {
    ACCESS_TOKEN, DIAGRAM_WORD_POPULATION, CRITERIONS, EXCLUSION_CONTRIES,
};
