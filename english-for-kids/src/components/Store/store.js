import categoriesConfig from '../../config/categories.json';

class Store {
    #gameMode = false;
    #statistics;

    constructor() {
        this.#loadGame();

        if (!this.#statistics) {
            this.#initialStatistics();
        }
    }

    get gameMode() {
        return this.#gameMode;
    }

    set gameMode(gameMode) {
        this.#gameMode = gameMode;
    }

    get statistics() {
        return this.#statistics;
    }

    updateStatistics(categoryIndex, index, property) {
        this.#statistics[categoryIndex].content[index][property] += 1;
        this.#saveGame();
    }

    resetStatistics() {
        this.#initialStatistics();
        this.#saveGame();
    }

    #initialStatistics() {
        this.#statistics = categoriesConfig.map((categoryConfig) => {
            const content = categoryConfig.content.map((cardConfig) => ({
                ...cardConfig,
                trained: 0,
                correct: 0,
                incorrect: 0
            }));

            return {
                title: categoryConfig.title,
                content
            };
        });
    }

    #saveGame() {
        localStorage.setItem('statistics', JSON.stringify(this.#statistics));
    }

    #loadGame() {
        this.#statistics = JSON.parse(localStorage.getItem('statistics'));
    }
}

export default new Store();
