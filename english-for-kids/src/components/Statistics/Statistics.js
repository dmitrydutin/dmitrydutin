import './Statistics.scss';
import Store from '../Store/store';
import AppDom from '../../app/app-dom';
import AppRouterDOM from '../../app/app-router-dom';

export default class Statistics {
    #statistics = [];
    #lastSortedBy;
    #table = null;

    constructor() {
        Store.statistics.forEach((categoryConfig) => {
            categoryConfig.content.forEach((cardConfig) => {
                const answersSum = cardConfig.correct + cardConfig.incorrect;
                const percentText = Math.floor((cardConfig.correct / answersSum) * 100) || 0;

                this.#statistics.push({
                    ...cardConfig,
                    category: categoryConfig.title,
                    percent: percentText
                });
            });
        });
    }

    render() {
        const statistics = document.createElement('main');
        const container = document.createElement('div');
        const statisticsInner = document.createElement('div');
        const statisticsHeader = this.#createHeader();
        const statisticsBody = this.#createBody();

        statistics.classList.add('statistics');
        container.classList.add('container');
        statisticsInner.classList.add('statistics__inner');

        statisticsInner.append(statisticsHeader);
        statisticsInner.append(statisticsBody);
        container.append(statisticsInner);
        statistics.append(container);

        return statistics;
    }

    #createHeader() {
        const header = document.createElement('div');
        const repeatButton = document.createElement('button');
        const resetButton = document.createElement('button');

        header.classList.add('statistics__header');
        repeatButton.classList.add('statistics__header__repeat');
        resetButton.classList.add('statistics__header__reset');

        repeatButton.textContent = 'Repeat difficult words';
        resetButton.textContent = 'Reset';

        repeatButton.addEventListener('click', () => {
            AppRouterDOM.navigateTo('/difficult-words');
        });

        resetButton.addEventListener('click', () => {
            Store.resetStatistics();
            AppDom.reRender();
        });

        header.append(repeatButton);
        header.append(resetButton);

        return header;
    }

    #createBody() {
        const body = document.createElement('div');
        this.#table = document.createElement('table');

        body.classList.add('statistics__body');
        this.#table.classList.add('statistics__body__table');

        this.#fillTable();
        body.append(this.#table);

        return body;
    }

    #fillTable() {
        this.#table.innerHTML = '';

        const thead = this.#createThead();
        const tbody = this.#createTbody();

        thead.classList.add('statistics__body__table__head');
        tbody.classList.add('statistics__body__table__body');

        this.#table.append(thead);
        this.#table.append(tbody);
    }

    #createThead() {
        const thead = document.createElement('thead');
        const tr = document.createElement('tr');

        const categories = this.#createTh('Categories', 'category');
        const words = this.#createTh('Words', 'word');
        const translation = this.#createTh('Translation', 'translation');
        const trained = this.#createTh('Trained', 'trained');
        const correct = this.#createTh('Correct', 'correct');
        const incorrect = this.#createTh('Incorrect', 'incorrect');
        const percent = this.#createTh('%', 'percent');

        tr.append(categories);
        tr.append(words);
        tr.append(translation);
        tr.append(trained);
        tr.append(correct);
        tr.append(incorrect);
        tr.append(percent);
        thead.append(tr);

        return thead;
    }

    #createTh(value, sortedBy) {
        const th = document.createElement('th');
        th.textContent = value;

        th.addEventListener('click', () => {
            this.#sortTable(sortedBy);
        });

        return th;
    }

    #createTbody() {
        const tbody = document.createElement('tbody');

        this.#statistics.forEach((cardStatistics) => {
            const tr = document.createElement('tr');

            const categoryTd = this.#createTd(cardStatistics.category);
            const wordTd = this.#createTd(cardStatistics.word);
            const translationTd = this.#createTd(cardStatistics.translation);
            const trained = this.#createTd(cardStatistics.trained);
            const correct = this.#createTd(cardStatistics.correct);
            const incorrect = this.#createTd(cardStatistics.incorrect);
            const percent = this.#createTd(cardStatistics.percent);

            tr.append(categoryTd);
            tr.append(wordTd);
            tr.append(translationTd);
            tr.append(trained);
            tr.append(correct);
            tr.append(incorrect);
            tr.append(percent);

            tbody.append(tr);
        });

        return tbody;
    }

    #createTd(value) {
        const td = document.createElement('td');
        td.textContent = value;
        return td;
    }

    #sortTable(sortedBy) {
        if (this.#lastSortedBy === sortedBy) {
            this.#lastSortedBy = '';
            this.#sortStatistics(sortedBy);

            this.#statistics.reverse();
        } else {
            this.#lastSortedBy = sortedBy;
            this.#sortStatistics(sortedBy);
        }

        this.#fillTable();
    }

    #sortStatistics(sortedBy) {
        this.#statistics.sort((a, b) => {
            if (typeof a[sortedBy] === 'string') {
                if (a[sortedBy] > b[sortedBy]) return 1;
                if (a[sortedBy] < b[sortedBy]) return -1;
                return 0;
            }

            return a[sortedBy] - b[sortedBy];
        });
    }
}
