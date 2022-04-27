import categoriesConfig from '../../config/categories.json';
import Store from '../Store/store';
import Cards from './Cards';
import { MAX_CARDS_COUNT, DEFAULT_PERCENT } from './constants';

export default class CardController {
    #config = null;
    #isTracked = false;
    #categoryIndex = 0;

    #statistics = [];

    constructor() {
        const path = window.location.pathname;
        const categoryConfig = categoriesConfig.find((config) => config.href === path);
        const categoryIndex = categoriesConfig.findIndex((config) => config.href === path);

        if (categoryConfig !== undefined) {
            this.#config = categoryConfig;
            this.#categoryIndex = categoryIndex;
            this.#isTracked = true;
        } else {
            this.#getStatistics();
            this.#handleStatistics();
            this.#setConfig();
        }
    }

    #getStatistics() {
        Store.statistics.forEach((categoryConfig) => {
            categoryConfig.content.forEach((cardConfig) => {
                const answersSum = cardConfig.correct + cardConfig.incorrect;
                const percentValue = Math.floor((cardConfig.correct / answersSum) * 100);

                this.#statistics.push({
                    ...cardConfig,
                    category: categoryConfig.title,
                    percent: percentValue || DEFAULT_PERCENT
                });
            });
        });
    }

    #handleStatistics() {
        this.#statistics = this.#statistics.filter(
            (cardConfig) => cardConfig.incorrect !== DEFAULT_PERCENT
        );
        this.#statistics.sort((a, b) => a.percent - b.percent);
        this.#statistics = this.#statistics.slice(0, MAX_CARDS_COUNT);
    }

    #setConfig() {
        this.#config = {
            title: 'Difficult words',
            content: this.#statistics
        };
    }

    render() {
        return new Cards(this.#config, this.#isTracked, this.#categoryIndex).render();
    }
}
