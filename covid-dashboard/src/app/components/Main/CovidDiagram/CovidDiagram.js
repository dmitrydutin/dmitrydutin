import './CovidDiagram.scss';
import ApexCharts from 'apexcharts';
import Basic from '../Basic/Basic';
import LeftArrowLight from '../../../../assets/images/left-arrow-diagram.svg';
import RightArrowLight from '../../../../assets/images/right-arrow-diagram.svg';
import LeftArrowDark from '../../../../assets/images/left-arrow-diagram-dark.svg';
import RightArrowDark from '../../../../assets/images/right-arrow-diagram-dark.svg';
import { DIAGRAM_WORD_POPULATION, CRITERIONS } from '../../../../common/constants';
import Store from '../../Store/store';
import { diagramAPI } from '../../../api/api';

export default class CovidDiagram extends Basic {
    constructor() {
        super();
        this.chart = null;
    }

    #covidDiagram = null;
    #globalDataCasesValue = [];
    #globalDataDeathsValue = [];
    #globalDataRecoveredValue = [];
    #localeDataCasesValue = [];
    #localeDataDeathsValue = [];
    #localeDataRecoveredValue = [];
    #localeDataPopulation = null;
    #covidDiagramContainer = null;
    #dataDate = [];

    render() {
        this.#covidDiagram = document.createElement('div');
        this.#covidDiagramContainer = document.createElement('div');
        const scaleButton = this.createScaleButton(this.#covidDiagram);

        this.#covidDiagram.classList.add('covid-diagram');
        this.#covidDiagramContainer.classList.add('covid-diagram__container');

        this.fillDiagram();
        Store.subscribe(this.fillDiagram.bind(this));
        Store.subscribeCriterion(this.fillDiagram.bind(this));

        this.#setThemeMode();
        Store.subscribeTheme(this.#setThemeMode.bind(this));
        Store.subscribeTheme(this.fillDiagram.bind(this));

        this.#covidDiagram.append(this.#covidDiagramContainer);
        this.#covidDiagram.append(scaleButton);

        return this.#covidDiagram;
    }

    #setThemeMode() {
        if (Store.theme === 'light') {
            this.#covidDiagram.classList.add('light');
        } else if (Store.theme === 'dark') {
            this.#covidDiagram.classList.remove('light');
        }
    }

    fillDiagram() {
        this.#covidDiagramContainer.innerHTML = '';
        this.buildDiagram();
    }

    createOptions(colorsArg, titleTextArg, dataOptions) {
        return {
            colors: colorsArg,
            title: {
                text: `${Store.country || 'Global'} ${titleTextArg}`,
            },
            series: [{
                name: `${Store.country || 'Global'} ${titleTextArg}`,
                data: dataOptions,
            }],
            xaxis: {
                categories: this.#dataDate[0],
            },
        };
    }

    async buildDiagram() {
        await this.getGlobalDataFromApi();
        await this.getLocaleDataFromApi();
        await this.getLocaleDataPopulationFromApi();

        let diagramClickCounter = 0;
        const options = [
            this.createOptions(['#BC0000'], 'Cases', Store.country
                ? this.#localeDataCasesValue[0] : this.#globalDataCasesValue[0]),
            this.createOptions(['#ffff0a'], 'Deaths', Store.country
                ? this.#localeDataDeathsValue[0] : this.#globalDataDeathsValue[0]),
            this.createOptions(['#00bc00'], 'Recovered', Store.country
                ? this.#localeDataRecoveredValue[0] : this.#globalDataRecoveredValue[0]),
            this.createOptions(['#880000'], 'Daily Cases', Store.country
                ? this.#localeDataCasesValue[0]
                    .map((el, index) => this.#localeDataCasesValue[0][index + 1]
                        - this.#localeDataCasesValue[0][index]).map((el) => Math.abs(el))
                : this.#globalDataCasesValue[0]
                    .map((el, index) => this.#globalDataCasesValue[0][index + 1]
                        - this.#globalDataCasesValue[0][index]).map((el) => Math.abs(el))),
            this.createOptions(['#9000ff'], 'Daily Deaths', Store.country
                ? this.#localeDataDeathsValue[0]
                    .map((el, index) => this.#localeDataDeathsValue[0][index + 1]
                        - this.#localeDataDeathsValue[0][index]).map((el) => Math.abs(el))
                : this.#globalDataDeathsValue[0]
                    .map((el, index) => this.#globalDataDeathsValue[0][index + 1]
                        - this.#globalDataDeathsValue[0][index]).map((el) => Math.abs(el))),
            this.createOptions(['#0042E5'], 'Daily Recovered', Store.country
                ? this.#localeDataRecoveredValue[0]
                    .map((el, index) => this.#localeDataRecoveredValue[0][index + 1]
                        - this.#localeDataRecoveredValue[0][index]).map((el) => Math.abs(el))
                : this.#globalDataRecoveredValue[0]
                    .map((el, index) => this.#globalDataRecoveredValue[0][index + 1]
                        - this.#globalDataRecoveredValue[0][index]).map((el) => Math.abs(el))),
            this.createOptions(['#FF1493'], 'Cases/100K', Store.country
                ? this.#localeDataCasesValue[0]
                    .map((el) => Math.round((el / this.#localeDataPopulation) * 1000000))
                : this.#globalDataCasesValue[0]
                    .map((el) => Math.round((el / DIAGRAM_WORD_POPULATION) * 1000000))),
            this.createOptions(['#727317'], 'Deaths/100K', Store.country
                ? this.#localeDataDeathsValue[0]
                    .map((el) => Math.round((el / this.#localeDataPopulation) * 1000000))
                : this.#globalDataDeathsValue[0]
                    .map((el) => Math.round((el / DIAGRAM_WORD_POPULATION) * 1000000))),
            this.createOptions(['#34ebe5'], 'Recovered/100K', Store.country
                ? this.#localeDataRecoveredValue[0]
                    .map((el) => Math.round((el / this.#localeDataPopulation) * 1000000))
                : this.#globalDataRecoveredValue[0]
                    .map((el) => Math.round((el / DIAGRAM_WORD_POPULATION) * 1000000))),
            this.createOptions(['#EE5A5A'], 'Daily Cases/100K', Store.country
                ? this.#localeDataCasesValue[0]
                    .map((el) => Math.round((el / this.#localeDataPopulation) * 1000000))
                    .map((el, index) => this.#localeDataCasesValue[0][index + 1]
                        - this.#localeDataCasesValue[0][index]).map((el) => Math.abs(el))
                : this.#globalDataCasesValue[0]
                    .map((el) => Math.round((el / DIAGRAM_WORD_POPULATION) * 1000000))
                    .map((el, index) => this.#globalDataCasesValue[0][index + 1]
                        - this.#globalDataCasesValue[0][index]).map((el) => Math.abs(el))),
            this.createOptions(['#FFA500'], 'Daily Deaths/100K', Store.country
                ? this.#localeDataDeathsValue[0]
                    .map((el) => Math.round((el / this.#localeDataPopulation) * 1000000))
                    .map((el, index) => this.#localeDataDeathsValue[0][index + 1]
                        - this.#localeDataDeathsValue[0][index]).map((el) => Math.abs(el))
                : this.#globalDataDeathsValue[0]
                    .map((el) => Math.round((el / DIAGRAM_WORD_POPULATION) * 1000000))
                    .map((el, index) => this.#globalDataDeathsValue[0][index + 1]
                        - this.#globalDataDeathsValue[0][index]).map((el) => Math.abs(el))),
            this.createOptions(['#15153D'], 'Daily Recovered/100K', Store.country
                ? this.#localeDataRecoveredValue[0]
                    .map((el) => Math.round((el / this.#localeDataPopulation) * 1000000))
                    .map((el, index) => this.#localeDataRecoveredValue[0][index + 1]
                        - this.#localeDataRecoveredValue[0][index]).map((el) => Math.abs(el))
                : this.#globalDataRecoveredValue[0]
                    .map((el) => Math.round((el / DIAGRAM_WORD_POPULATION) * 1000000))
                    .map((el, index) => this.#globalDataRecoveredValue[0][index + 1]
                        - this.#globalDataRecoveredValue[0][index]).map((el) => Math.abs(el))),
        ];

        this.chart?.destroy();

        this.chart = new ApexCharts(this.#covidDiagramContainer, {
            colors: ['#BC0000'],
            theme: {
                mode: Store.theme,
            },
            chart: {
                animations: {
                    enabled: false,
                },
                type: 'area',
                defaultLocale: 'en',
                toolbar: {
                    show: true,
                    offsetX: -20,
                    offsetY: 0,
                    tools: {
                        download: false,
                        selection: false,
                        zoom: false,
                        zoomin: false,
                        zoomout: false,
                        pan: false,
                        reset: false,
                        customIcons: [{
                            icon: `<img src=${Store.theme === 'dark' ? LeftArrowLight : LeftArrowDark} width="17">`,
                            title: 'Prev',
                            class: 'prev-category-icon',
                            click() {
                                if (diagramClickCounter === 0) {
                                    diagramClickCounter += 12;
                                }
                                diagramClickCounter -= 1;
                                Store.criterion = CRITERIONS[options
                                    .indexOf(options[diagramClickCounter])];
                                Store.notifyCriterion();
                            },
                        },
                        {
                            icon: `<img src=${Store.theme === 'dark' ? RightArrowLight : RightArrowDark} width="17">`,
                            title: 'Next',
                            class: 'next-category-icon',
                            click() {
                                if (diagramClickCounter === 11) {
                                    diagramClickCounter = -1;
                                }
                                diagramClickCounter += 1;
                                Store.criterion = CRITERIONS[options
                                    .indexOf(options[diagramClickCounter])];
                                Store.notifyCriterion();
                            },
                        },
                        ],
                    },
                },
            },
            title: {
                text: `${Store.country || 'Global'}  Cases`,
                align: 'center',
                margin: 10,
                style: {
                    fontSize: '14px',
                    fontWeight: 'bold',
                    fontFamily: 'Roboto',
                    color: Store.theme === 'dark' ? '#ffffff' : '#000000',
                },
            },
            dataLabels: {
                enabled: false,
            },
            series: [{
                name: `${Store.country || 'Global'}  Cases`,
                data: Store.country
                    ? this.#localeDataCasesValue[0] : this.#globalDataCasesValue[0],
            }],
            xaxis: {
                type: 'datetime',
                categories: this.#dataDate[0],
            },
        });

        this.chart.render();
        if (Store.criterion.name !== 'Total number of cases') {
            this.chart.updateOptions(options[CRITERIONS.indexOf(Store.criterion)]);
            diagramClickCounter = CRITERIONS.indexOf(Store.criterion);
        }
    }

    async getGlobalDataFromApi() {
        const response = await diagramAPI.getGlobalDataFromApi();

        if (response.status === 200) {
            const { data } = response;
            this.#globalDataCasesValue.push(Object.values(data.cases));
            this.#globalDataDeathsValue.push(Object.values(data.deaths));
            this.#globalDataRecoveredValue.push(Object.values(data.recovered));
            this.#dataDate.push(Object.keys(data.cases));
        } else {
            throw new Error('DiagramGlobalAPI error');
        }
    }

    async getLocaleDataFromApi() {
        if (Store.country) {
            const response = await diagramAPI.getLocaleDataFromApi(Store.country);
            if (response.status === 200) {
                const { data } = response;
                this.#localeDataCasesValue = [];
                this.#localeDataDeathsValue = [];
                this.#localeDataRecoveredValue = [];
                this.#localeDataCasesValue.push(Object.values(data.timeline.cases));
                this.#localeDataDeathsValue.push(Object.values(data.timeline.deaths));
                this.#localeDataRecoveredValue.push(Object.values(data.timeline.recovered));
            } else {
                throw new Error('DiagramLocaleAPI error');
            }
        }
    }

    async getLocaleDataPopulationFromApi() {
        if (Store.country) {
            const response = await diagramAPI.getLocaleDataPopulationFromApi(Store.country);
            if (response.status === 200) {
                const { data } = response;
                this.#localeDataPopulation = null;
                this.#localeDataPopulation = data.population;
            } else {
                throw new Error('DiagramPopulationAPI error');
            }
        }
    }
}
