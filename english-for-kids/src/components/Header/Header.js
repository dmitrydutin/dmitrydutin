import './Header.scss';
import AppRouterDOM from '../../app/app-router-dom';
import Menu from './Menu/Menu';

export default class Header {
    #menu;

    constructor() {
        this.#menu = new Menu();
    }

    render() {
        const header = document.createElement('header');
        header.classList.add('header');

        header.append(this.#createBurgerButton());
        header.append(this.#createLogoButton());
        header.append(this.#createStatisticsButton());
        header.append(this.#menu.render());

        return header;
    }

    #createBurgerButton() {
        const burgerButton = document.createElement('div');
        const burgerButtonLineTop = document.createElement('span');
        const burgerButtonLineCenter = document.createElement('span');
        const burgerButtonLineBottom = document.createElement('span');

        burgerButton.classList.add('burger-button');
        burgerButtonLineTop.classList.add('burger-button__line');
        burgerButtonLineCenter.classList.add('burger-button__line');
        burgerButtonLineBottom.classList.add('burger-button__line');

        burgerButton.setAttribute('aria-label', 'Главное меню');
        burgerButton.setAttribute('role', 'button');
        burgerButton.setAttribute('tabindex', '0');

        burgerButton.append(burgerButtonLineTop);
        burgerButton.append(burgerButtonLineCenter);
        burgerButton.append(burgerButtonLineBottom);

        burgerButton.addEventListener('click', this.#menu.open.bind(this.#menu));

        burgerButton.addEventListener('keypress', (event) => {
            if (['Space', 'Enter'].includes(event.code)) this.#menu.open();
        });

        return burgerButton;
    }

    #createLogoButton() {
        const logo = document.createElement('a');
        const logoText = document.createElement('span');

        logo.classList.add('header__logo');
        logoText.classList.add('header__logo__text');

        logo.href = '/';
        logoText.textContent = 'English for kids';
        logo.setAttribute('aria-label', 'Английский для детей');

        logo.addEventListener('click', (event) => {
            event.preventDefault();
            AppRouterDOM.navigateTo(event.currentTarget.href);
        });

        logo.append(logoText);
        return logo;
    }

    #createStatisticsButton() {
        const statisticsButton = document.createElement('a');
        statisticsButton.classList.add('header__statistics');

        statisticsButton.href = '/statistics';
        statisticsButton.setAttribute('aria-label', 'Статистика');

        statisticsButton.addEventListener('click', (event) => {
            event.preventDefault();
            AppRouterDOM.navigateTo(event.currentTarget.href);
        });

        return statisticsButton;
    }
}
