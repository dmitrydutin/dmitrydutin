import './Header.scss';
import { headerAPI } from '../../api/api';
import Store from '../Store/store';
import { countryInclude, removeDuplicateCountries } from '../../../common/helpers';
import Datalist from './Datalist/Datalist';
import Keyboard from './Keyboard/Keyboard';

export default class Header {
    #countries = [];
    #header = null;
    #searchInput = null;
    #themeButton = null;

    render() {
        this.#header = document.createElement('header');
        const logo = this.#createLogo();
        const searchForm = document.createElement('div');
        this.#searchInput = this.#createSearchInput();
        const searchDatalist = new Datalist(this.#searchInput, []);
        const keyboard = new Keyboard(this.#searchInput).render();
        this.#themeButton = this.#createThemeButton();

        this.#getCountries().then(() => {
            searchDatalist.config = this.#countries;
            searchDatalist.fill('');
        });

        this.#header.classList.add('header');
        searchForm.classList.add('header__search-form');

        this.#setThemeMode();
        Store.subscribeTheme(this.#setThemeMode.bind(this));

        searchForm.append(this.#searchInput);
        searchForm.append(searchDatalist.render());

        this.#header.append(logo);
        this.#header.append(searchForm);
        this.#header.append(keyboard);
        this.#header.append(this.#themeButton);

        return this.#header;
    }

    #setThemeMode() {
        if (Store.theme === 'light') {
            this.#header.classList.add('light');
            this.#searchInput.classList.add('light');
            this.#themeButton.classList.add('light');
        } else if (Store.theme === 'dark') {
            this.#header.classList.remove('light');
            this.#searchInput.classList.remove('light');
            this.#themeButton.classList.remove('light');
        }
    }

    #createLogo() {
        const logo = document.createElement('h1');
        logo.classList.add('header__logo');
        logo.textContent = 'Covid dashboard';
        return logo;
    }

    #createSearchInput() {
        const searchInput = document.createElement('input');
        searchInput.classList.add('header__search-input');

        searchInput.type = 'search';
        searchInput.placeholder = 'Search country...';

        searchInput.addEventListener('search', () => {
            this.#chooseCountryListener(searchInput.value);
        });

        return searchInput;
    }

    #chooseCountryListener(countryName) {
        if (countryInclude(this.#countries, countryName)) {
            Store.country = countryName;
            Store.notify();
        }
    }

    async #getCountries() {
        const response = await headerAPI.getCountries();

        if (response.status === 200) {
            this.#countries = removeDuplicateCountries(response.data);
        } else {
            throw new Error('List of countries not received');
        }
    }

    #createThemeButton() {
        const themeButton = document.createElement('button');
        themeButton.classList.add('header__theme-button');

        themeButton.addEventListener('click', () => {
            Store.theme = Store.theme === 'light' ? 'dark' : 'light';
            Store.notifyTheme();
        });

        return themeButton;
    }
}
