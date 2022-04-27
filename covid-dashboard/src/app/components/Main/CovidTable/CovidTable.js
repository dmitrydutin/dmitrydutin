/* eslint-disable no-param-reassign */
import './CovidTable.scss';
import Swiper from 'swiper/bundle';
import Basic from '../Basic/Basic';

import 'swiper/swiper-bundle.css';
import { convertCountryName, addCriterions } from '../../../../common/helpers';
import Store from '../../Store/store';
import LeftArrow from '../../../../assets/images/left-arrow-diagram.svg';
import RightArrow from '../../../../assets/images/right-arrow-diagram.svg';
import { CRITERIONS } from '../../../../common/constants';
import { mapAPI, tableAPI } from '../../../api/api';

export default class CovidTable extends Basic {
    #covidTable = null;

    constructor() {
        super();
        this.table = null;
        this.data = null;
    }

    render() {
        this.#covidTable = document.createElement('div');
        const scaleButton = this.createScaleButton(this.#covidTable);

        this.#covidTable.classList.add('covid-table');

        this.#covidTable.append(scaleButton);

        const tableContainer = document.createElement('div');
        tableContainer.classList.add('statistics-table-container');
        this.#covidTable.append(tableContainer);

        const table = document.createElement('table');
        this.table = table;
        table.classList.add('statistics-table');
        tableContainer.append(table);
        this.#fetchData().then(() => {
            this.renderTable();
        });

        this.#setThemeMode();
        Store.subscribeTheme(this.#setThemeMode.bind(this));

        const buttonsContainer = document.createElement('div');
        buttonsContainer.classList.add('statistics-button-container');
        buttonsContainer.append(this.renderButtons());
        this.#covidTable.append(buttonsContainer);

        return this.#covidTable;
    }

    #setThemeMode() {
        if (Store.theme === 'light') {
            this.#covidTable.classList.add('light');
        } else if (Store.theme === 'dark') {
            this.#covidTable.classList.remove('light');
        }
    }

    renderTable() {
        const tr = document.createElement('tr');
        tr.classList.add('statistics-table-tr');

        const thName = document.createElement('th');
        thName.classList.add('statistics-table-th');
        thName.textContent = 'Name';
        tr.append(thName);

        const thSection = document.createElement('th');
        thSection.classList.add('statistics-table-th');
        thSection.textContent = Store.criterion.name;
        Store.subscribeCriterion((criterion) => {
            thSection.textContent = criterion.name;
        });
        tr.append(thSection);
        this.table.append(tr);

        const trData = document.createElement('tr');
        trData.classList.add('statistics-table-tr');

        const tdName = document.createElement('td');
        tdName.classList.add('statistics-table-td');

        const str = convertCountryName(Store.country);
        const countryIndex = this.data.map((element) => element.country)
            .findIndex((elem) => elem === str);
        if (countryIndex === -1) return;
        const country = this.data[countryIndex];
        tdName.textContent = country.country;
        trData.append(tdName);

        const tdSection = document.createElement('td');
        tdSection.classList.add('statistics-table-td');
        tdSection.textContent = country[Store.criterion.value];
        Store.subscribe((el) => {
            tdName.textContent = el || 'Global';
            const countryCurrentIndex = this.data.map((element) => element.country)
                .findIndex((elem) => elem === Store.country);
            let countryCurrent;
            if (countryCurrentIndex === -1) countryCurrent = this.data[this.data.length - 1];
            else countryCurrent = this.data[countryCurrentIndex];
            tdName.textContent = countryCurrent.country;
            tdSection.textContent = countryCurrent[Store.criterion.value];
        });
        Store.subscribeCriterion((criterion) => {
            const countryCurrentIndex = this.data.map((element) => element.country)
                .findIndex((elem) => elem === Store.country);
            let countryCurrent;
            if (countryCurrentIndex === -1) countryCurrent = this.data[this.data.length - 1];
            else countryCurrent = this.data[countryCurrentIndex];
            tdName.textContent = countryCurrent.country;
            tdSection.textContent = countryCurrent[criterion.value];
        });
        trData.append(tdSection);

        this.table.append(trData);
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

    async #fetchData() {
        const response = await mapAPI.getAllData();
        const response2 = await tableAPI.getAllData();
        if (response.status === 200) {
            this.data = response.data;
            this.data.push({
                ...response2.data,
                country: 'Global',
            });
            addCriterions(this.data);
        } else {
            throw new Error('COVID-19 API FETCH ERROR');
        }
    }

    #changeCriterion(name) {
        Store.criterion = CRITERIONS.find((elem) => elem.value === name);
        Store.notifyCriterion();
    }
}
