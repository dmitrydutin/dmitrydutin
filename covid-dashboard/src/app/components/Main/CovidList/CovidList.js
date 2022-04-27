import './CovidList.scss';
import Swiper from 'swiper/bundle';
import Basic from '../Basic/Basic';

import Store from '../../Store/store';
import { CRITERIONS, EXCLUSION_CONTRIES } from '../../../../common/constants';
import { mapAPI } from '../../../api/api';
import 'swiper/swiper-bundle.css';
import LeftArrow from '../../../../assets/images/left-arrow-diagram.svg';
import RightArrow from '../../../../assets/images/right-arrow-diagram.svg';
import { excludeCountries, sortData } from '../../../../common/helpers';

export default class CovidList extends Basic {
    #data = [];
    #sortingData = [];
    #isFirstPush = true;
    #covidList = null;

    render() {
        this.#covidList = document.createElement('div');
        const scaleButton = this.createScaleButton(this.#covidList);
        const covidListContainer = document.createElement('table');

        covidListContainer.classList.add('list__container');
        this.#covidList.append(covidListContainer);

        this.#covidList.classList.add('covid-list');

        Store.subscribeTheme(this.#setThemeMode.bind(this));
        Store.subscribeCriterion(this.fillList.bind(this));

        this.#covidList.append(this.renderButtons());
        this.#covidList.append(scaleButton);
        this.fillList();
        this.#setThemeMode();
        return this.#covidList;
    }

    #setThemeMode() {
        const tdCountries = document.querySelectorAll('.list__container-listbody-table-country-td');
        const tdValues = document.querySelectorAll('.list__container-listbody-table-value-td');
        const captionCountry = document.querySelector('.list__container-caption-country-name');
        const captionValue = document.querySelector('.list__container-caption-country-value');

        if (Store.theme === 'light') {
            this.#covidList.classList.add('light');
            captionCountry?.classList.remove('dark');
            captionValue?.classList.remove('dark');
            tdCountries.forEach((country) => {
                country.classList.remove('dark');
            });
            tdValues.forEach((value) => {
                value.classList.remove('dark');
            });
        } else if (Store.theme === 'dark') {
            this.#covidList.classList.remove('light');
            captionCountry.classList.add('dark');
            captionValue.classList.add('dark');
            tdCountries.forEach((country) => {
                country.classList.add('dark');
            });
            tdValues.forEach((value) => {
                value.classList.add('dark');
            });
        }
    }

    fillList() {
        const covidListContainer = document.querySelector('.list__container');
        if (covidListContainer) {
            this.cleanContainer();
        }
        this.buildlist();
    }

    cleanContainer() {
        const covidListContainer = document.querySelector('.list__container');
        while (covidListContainer.firstChild) {
            covidListContainer.removeChild(covidListContainer.firstChild);
        }
    }

    async buildlist() {
        await this.getAllAPI();

        const covidListContainer = document.querySelector('.list__container');

        const caption = document.createElement('thead');
        caption.classList.add('list__container-caption');
        covidListContainer.append(caption);

        const trCaption = document.createElement('tr');
        trCaption.classList.add('list__container-tr-caption');
        caption.append(trCaption);

        const captionCountryName = document.createElement('th');
        captionCountryName.classList.add('list__container-caption-country-name');
        trCaption.append(captionCountryName);
        captionCountryName.textContent = 'Country';

        const captionValue = document.createElement('th');
        captionValue.classList.add('list__container-caption-country-value');
        trCaption.append(captionValue);
        captionValue.textContent = 'Value';

        const listbody = document.createElement('tbody');
        listbody.classList.add('list__container-table-listbody');
        covidListContainer.append(listbody);

        this.#data.forEach((country) => {
            const criterions = [
                country.cases,
                country.deaths,
                country.recovered,
                country.todayCases,
                country.todayDeaths,
                country.todayRecovered,
                Number.isFinite(Math.round((country.cases / country.population) * 100000))
                    ? Math.round((country.cases / country.population) * 100000)
                    : 1,
                Number.isFinite(Math.round((country.deaths / country.population) * 100000))
                    ? Math.round((country.deaths / country.population) * 100000)
                    : 1,
                Number.isFinite(Math.round((country.recovered / country.population) * 100000))
                    ? Math.round((country.recovered / country.population) * 100000)
                    : 1,
                Number.isFinite(Math.round((country.todayCases / country.population) * 100000))
                    ? Math.round((country.todayCases / country.population) * 100000)
                    : 1,
                Number.isFinite(Math.round((country.todayDeaths / country.population) * 100000))
                    ? Math.round((country.todayDeaths / country.population) * 100000)
                    : 1,
                Number.isFinite(Math.round((country.todayRecovered / country.population) * 100000))
                    ? Math.round((country.todayRecovered / country.population) * 100000)
                    : 1,
            ];
            const countryField = country.country;
            const valueField = criterions[CRITERIONS.indexOf(Store.criterion)];
            const valueCasesField = country.cases;
            const flagField = country.countryInfo.flag;

            this.#sortingData.push({
                country: countryField,
                value: this.#isFirstPush ? valueCasesField : valueField,
                flag: flagField,
            });
        });

        sortData(this.#sortingData, 'value');
        this.#sortingData = excludeCountries(this.#sortingData, EXCLUSION_CONTRIES);

        this.#isFirstPush = false;

        this.#sortingData.forEach((country) => {
            const tr = document.createElement('tr');
            const valueTd = document.createElement('td');
            const countryTd = document.createElement('td');

            tr.classList.add('list__container-listbody-table-value-tr');
            valueTd.classList.add('list__container-listbody-table-value-td');
            countryTd.classList.add('list__container-listbody-table-country-td');
            if (Store.theme === 'dark') {
                valueTd.classList.add('dark');
                countryTd.classList.add('dark');
                captionCountryName.classList.add('dark');
                captionValue.classList.add('dark');
            } else {
                valueTd.classList.remove('dark');
                countryTd.classList.remove('dark');
                captionCountryName.classList.remove('dark');
                captionValue.classList.remove('dark');
            }

            valueTd.textContent = country.value;
            countryTd.innerHTML = `<img class="list__container-listbody-table-flag-img" src="${country.flag}">${country.country}`;

            listbody.append(tr);
            tr.append(countryTd);
            tr.append(valueTd);
        });

        this.addListenersToListOfCountries();
    }

    addListenersToListOfCountries() {
        const table = document.querySelector('.list__container-table-listbody');
        const listener = function (event) {
            if (event.target.closest('.list__container-listbody-table-country-td') === null) {
                return;
            }
            Store.country = event.target.closest('.list__container-listbody-table-country-td').textContent;
            Store.notify();
        };
        table.removeEventListener('click', listener);
        table.addEventListener('click', listener);
    }

    async getAllAPI() {
        const response = await mapAPI.getAllData();
        if (response.status === 200) {
            this.#data = response.data;
            this.#sortingData = [];
        } else {
            throw new Error('List of countries not received');
        }
    }

    renderButtons() {
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
                CRITERIONS[swiper.realIndex].value,
            );
        });
        buttonNext.addEventListener('click', () => {
            this.#changeCriterion(
                CRITERIONS[swiper.realIndex].value,
            );
        });
        Store.subscribeCriterion((criterion) => {
            const index = CRITERIONS.findIndex((elem) => elem.value === criterion.value);
            swiper.slideTo(index, 250, false);
        });
        return buttonContainer;
    }

    #changeCriterion(name) {
        Store.criterion = CRITERIONS.find((elem) => elem.value === name);
        Store.notifyCriterion();
    }
}
