import './Datalist.scss';

export default class Datalist {
    #searchInput = null;
    #datalist = null;
    #config = [];

    constructor(searchInput, config) {
        this.#searchInput = searchInput;
        this.#config = config;
    }

    render() {
        this.#datalist = document.createElement('div');
        this.#datalist.classList.add('datalist');
        this.#datalist.classList.add('datalist--hide');

        this.#openEvents();
        this.#closeEvents();
        this.#targetEvents();
        this.#changeEvents();

        return this.#datalist;
    }

    set config(config) {
        this.#config = config;
    }

    fill(input) {
        this.#datalist.innerHTML = '';

        this.#config.forEach((countryConfig) => {
            const configCountry = countryConfig.country.toLowerCase();
            const inputCountry = input.toLowerCase();

            if (configCountry.includes(inputCountry)) {
                const option = document.createElement('div');
                option.textContent = countryConfig.country;
                this.#datalist.append(option);
            }
        });
    }

    open() {
        this.#datalist.classList.remove('datalist--hide');
        this.#datalist.scrollTop = 0;
    }

    close() {
        this.#datalist.classList.add('datalist--hide');
    }

    #openEvents() {
        this.#searchInput.addEventListener('click', this.open.bind(this));
        this.#searchInput.addEventListener('focus', this.open.bind(this));
    }

    #closeEvents() {
        this.#searchInput.addEventListener('blur', () => {
            setTimeout(this.close.bind(this), 100);
        });

        window.addEventListener('scroll', this.close.bind(this));
    }

    #targetEvents() {
        this.#datalist.addEventListener('click', (event) => {
            if (event.target !== event.currentTarget) {
                const targetText = event.target.textContent;

                this.#searchInput.value = targetText;
                this.#searchInput.dispatchEvent(new Event('search'));

                this.fill(targetText);
            }
        });
    }

    #changeEvents() {
        this.#searchInput.addEventListener('input', (event) => {
            this.fill(event.target.value);
        });
    }
}
