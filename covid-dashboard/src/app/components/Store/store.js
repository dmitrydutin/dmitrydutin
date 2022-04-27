class Store {
    #theme = 'light';
    #country = null;
    #criterion = {
        name: 'Total number of cases',
        value: 'cases',
        color: '#BC0000',
    };

    #subscribers = [];
    #subscribersCriterion = [];
    #subscribersTheme = [];

    get theme() {
        return this.#theme;
    }

    set theme(theme) {
        this.#theme = theme;
    }

    get country() {
        return this.#country;
    }

    set country(country) {
        this.#country = country;
    }

    get criterion() {
        return this.#criterion;
    }

    set criterion(criterion) {
        this.#criterion = criterion;
    }

    subscribe(listener) {
        this.#subscribers.push(listener);
    }

    notify() {
        this.#subscribers.forEach((listener) => {
            listener(this.#country);
        });
    }

    subscribeCriterion(listener) {
        this.#subscribersCriterion.push(listener);
    }

    notifyCriterion() {
        this.#subscribersCriterion.forEach((listener) => {
            listener(this.#criterion);
        });
    }

    subscribeTheme(listener) {
        this.#subscribersTheme.push(listener);
    }

    notifyTheme() {
        this.#subscribersTheme.forEach((listener) => {
            listener(this.#theme);
        });
    }
}

export default new Store();
