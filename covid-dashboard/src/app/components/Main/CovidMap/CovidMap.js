/* eslint-disable no-unused-vars  */
/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
import './CovidMap.scss';
import 'leaflet/dist/leaflet.css';

import LeafletMap from 'leaflet';
import marker from 'leaflet/dist/images/marker-icon.png';
import marker2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import Swiper from 'swiper/bundle';
import 'swiper/swiper-bundle.css';
import statesData from './custom.geo.json';
import Store from '../../Store/store';
import { convertCountryName, addCriterions } from '../../../../common/helpers';
import Basic from '../Basic/Basic';
import { mapAPI } from '../../../api/api';
import { ACCESS_TOKEN, CRITERIONS } from '../../../../common/constants';
import LeftArrow from '../../../../assets/images/left-arrow-diagram.svg';
import RightArrow from '../../../../assets/images/right-arrow-diagram.svg';

delete LeafletMap.Icon.Default.prototype._getIconUrl;

LeafletMap.Icon.Default.mergeOptions({
    iconRetinaUrl: marker2x,
    iconUrl: marker,
    shadowUrl: markerShadow,
});

export default class CovidMap extends Basic {
    #covidMapContainer = null;

    constructor() {
        super();
        this.mapMarkers = LeafletMap.layerGroup();
        this.data = [];
        this.mymap = null;
        this.country = undefined;
    }

    renderPopup(elem, criterion) {
        const countryContainer = document.createElement('div');
        const countryFlag = document.createElement('img');
        const countryName = document.createTextNode(`  ${elem.country}`);
        const countryCriterion = document.createElement('p');

        countryFlag.style.width = '100px';
        countryFlag.style.width = '30px';
        countryFlag.src = `${elem.countryInfo.flag}`;
        countryCriterion.textContent = (`${criterion.charAt(0).toUpperCase()}${criterion.slice(1)}: ${elem[criterion]}`);

        countryContainer.append(countryFlag);
        countryContainer.append(countryName);
        countryContainer.append(countryCriterion);

        return countryContainer;
    }

    renderButtons(mymap) {
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');
        buttonContainer.classList.add('swiper-container');

        const buttonPrev = document.createElement('img');
        buttonPrev.classList.add('swiper-button-prev');
        buttonPrev.classList.add('button-prev');
        buttonPrev.src = LeftArrow;
        const buttonNext = document.createElement('img');
        buttonNext.classList.add('swiper-button-next');
        buttonNext.classList.add('button-next');
        buttonNext.src = RightArrow;
        const swiperWrapper = document.createElement('div');
        swiperWrapper.classList.add('swiper-wrapper');

        CRITERIONS.forEach((elem) => {
            const swiperSlide = document.createElement('div');
            swiperSlide.classList.add('swiper-slide');
            const swiperSlideText = document.createElement('span');
            swiperSlideText.textContent = elem.name;
            swiperSlide.append(swiperSlideText);
            swiperWrapper.append(swiperSlide);
        });

        buttonContainer.append(swiperWrapper);
        buttonContainer.append(buttonPrev);
        buttonContainer.append(buttonNext);
        document.body.append(buttonContainer);
        const swiper = new Swiper(buttonContainer, {
            slidesPerView: 1,
            spaceBetween: 30,
            navigation: {
                nextEl: buttonNext,
                prevEl: buttonPrev,
            },
            allowTouchMove: false,
        });
        buttonPrev.addEventListener('click', () => {
            this.#changeCriterion(
                mymap, CRITERIONS[swiper.realIndex].value,
                CRITERIONS[swiper.realIndex].color,
            );
        });
        buttonNext.addEventListener('click', () => {
            this.#changeCriterion(
                mymap, CRITERIONS[swiper.realIndex].value,
                CRITERIONS[swiper.realIndex].color,
            );
        });
        Store.subscribeCriterion((criterion) => {
            const index = CRITERIONS.findIndex((elem) => elem.value === criterion.value);
            swiper.slideTo(index, 250, false);
        });
        return buttonContainer;
    }

    drawCircles(mymap, data, criterion, color) {
        const maxCases = data.reduce(
            (prev, current) => ((prev[criterion] > current[criterion]) ? prev : current),
        )[criterion];

        data.forEach((element) => {
            const circle = LeafletMap.circle(
                [element.countryInfo.lat, element.countryInfo.long],
                {
                    color,
                    fillColor: color,
                    fillOpacity: 1,
                    radius: 250000 * (element[criterion] / maxCases),

                },
            );
            this.mapMarkers.addLayer(circle);
        });

        this.mapMarkers.addTo(mymap);
    }

    #setThemeMode() {
        if (Store.theme === 'light') {
            this.#covidMapContainer.classList.add('light');
        } else if (Store.theme === 'dark') {
            this.#covidMapContainer.classList.remove('light');
        }
    }

    render() {
        const covidMapContainer = document.createElement('div');
        const covidMap = document.createElement('div');
        const scaleButton = this.createScaleButton(covidMapContainer);

        this.#covidMapContainer = covidMapContainer;
        this.#setThemeMode();
        Store.subscribeTheme(this.#setThemeMode.bind(this));

        covidMapContainer.classList.add('covid-map-container');
        covidMapContainer.append(covidMap);
        covidMap.classList.add('covid-map');

        covidMap.id = 'mapid';
        covidMapContainer.append(scaleButton);
        document.body.append(covidMapContainer);

        const mymap = LeafletMap.map('mapid', {
            worldCopyJump: true,
            zoom: 15,
            maxZoom: 20,
            minZoom: 2,
            ACCESS_TOKEN,
        }).setView([0, 50], 2);

        const CartoDBDarkMatter = LeafletMap.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            subdomains: 'abcd',
            ACCESS_TOKEN,
        });
        const CartoDBDarkMatterLight = LeafletMap.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            subdomains: 'abcd',
            apikey: ACCESS_TOKEN,
        });
        if (Store.theme === 'light') {
            CartoDBDarkMatterLight.addTo(mymap);
        } else if (Store.theme === 'dark') {
            CartoDBDarkMatter.addTo(mymap);
        }
        Store.subscribeTheme(
            (theme) => {
                if (theme === 'light') {
                    mymap.removeLayer(CartoDBDarkMatter);
                    CartoDBDarkMatterLight.addTo(mymap);
                } else if (theme === 'dark') {
                    mymap.removeLayer(CartoDBDarkMatterLight);
                    CartoDBDarkMatter.addTo(mymap);
                }
            },
        );

        setInterval(() => {
            mymap.invalidateSize();
        }, 500);

        this.#fetchData().then(() => {
            this.#fetchData().then(() => {
            });
            covidMapContainer.append(this.renderButtons(mymap, this.data));
            this.drawCircles(mymap, this.data, 'cases', '#BC0000');
        }).then(() => {
            mymap.on('click', (e) => {
                this.#fetchCountry(e.latlng.lat, e.latlng.lng)
                    .then(() => {
                        this.#chooseCountryListener(this.country);
                    });
            });
            this.mymap = mymap;
            Store.subscribeCriterion(
                this.updateCriterion.bind(this),
            );
        }).then(() => {
            const info = LeafletMap.control();
            const { data } = this;
            info.onAdd = function (map) {
                this._div = LeafletMap.DomUtil.create('div', 'info');
                this.update();
                return this._div;
            };

            info.update = function (props) {
                if (props) {
                    const str = convertCountryName(props.name);
                    const countryIndex = data.map((element) => element.country)
                        .findIndex((elem) => elem === str);
                    if (countryIndex === -1) return;
                    const country = data[countryIndex];
                    this._div.innerHTML = `<h4>${Store.criterion.name}</h4>${props
                        ? `<img src="${country.countryInfo.flag}"><b>${props.name}</b><br />${country[Store.criterion.value]} people`
                        : 'Hover over a country'}`;
                }
            };

            info.addTo(mymap);
            function createLegend() {
                const legend = LeafletMap.control({ position: 'bottomright' });

                legend.onAdd = function () {
                    const div = LeafletMap.DomUtil.create('div', 'info legend');
                    const grades = [0, 25, 50, 75, 100];
                    const labels = [];
                    let from; let
                        to;
                    labels.push(
                        'Legend',
                    );
                    for (let i = 0; i < grades.length; i++) {
                        from = grades[i];
                        to = grades[i + 1];
                        let rad;
                        switch (from) {
                            case 0:
                                rad = 5;
                                break;
                            case 25:
                                rad = 7.5;
                                break;
                            case 50:
                                rad = 15;
                                break;
                            case 75:
                                rad = 22.5;
                                break;
                            case 100:
                                rad = 30;
                                break;
                            default:
                                break;
                        }
                        labels.push(
                            `<div class="legend-criterion" >
                            <i style="width:${rad}px;height:${rad}px;background:${Store.criterion.color}"></i> ${from}%
                            </div>`,
                        );
                    }
                    div.innerHTML = labels.join('<br>');
                    return div;
                };
                legend.addTo(mymap);
                Store.subscribeCriterion(() => {
                    legend.remove();
                });
            }
            function style() {
                return {
                    weight: 1,
                    opacity: 1,
                    color: '#ffff',
                    fillColor: '#81858c',
                };
            }
            function highlightFeature(e) {
                const layer = e.target;

                layer.setStyle({
                    weight: 3,
                    color: '#81858c',
                    fillOpacity: 0.5,
                });

                if (!LeafletMap.Browser.ie
                    && !LeafletMap.Browser.opera
                    && !LeafletMap.Browser.edge) {
                    layer.bringToFront();
                }

                info.update(layer.feature.properties);
            }

            let geojson;

            function resetHighlight(e) {
                geojson.resetStyle(e.target);
                info.update();
            }

            function onEachFeature(feature, layer) {
                layer.on({
                    mouseover: highlightFeature,
                    mouseout: resetHighlight,
                });
            }

            geojson = LeafletMap.geoJson(statesData, {
                style,
                onEachFeature,
            }).addTo(mymap);

            createLegend();
            Store.subscribeCriterion(() => {
                createLegend();
            });
        });

        return covidMapContainer;
    }

    async #fetchData() {
        const response = await mapAPI.getAllData();

        if (response.status === 200) {
            this.data = response.data;
            addCriterions(this.data);
        } else {
            throw new Error('COVID-19 API FETCH ERROR');
        }
    }

    async #fetchCountry(lat, lng) {
        const response = await mapAPI.getCountryName(lat, lng);

        if (response.status === 200) {
            this.country = response.data.countryName;
        } else {
            throw new Error('COVID-19 API FETCH ERROR');
        }
    }

    #chooseCountryListener(countryName) {
        const country = convertCountryName(countryName);
        if (this.data.map((element) => element.country)
            .findIndex((elem) => elem === country) !== -1) {
            Store.country = country;
            Store.notify();
        }
    }

    #changeCriterion(mymap, name, circleColors) {
        this.mapMarkers.clearLayers();
        this.drawCircles(mymap, this.data, name, circleColors);
        Store.criterion = CRITERIONS.find((elem) => elem.value === name);
        Store.notifyCriterion();
    }

    updateCriterion(criterion) {
        if (this.data.length) {
            this.mapMarkers.clearLayers();
            this.drawCircles(this.mymap, this.data, criterion.value, criterion.color);
        }
    }
}
