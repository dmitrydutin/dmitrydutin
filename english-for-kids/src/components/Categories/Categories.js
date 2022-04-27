import './Categories.scss';
import AppRouterDOM from '../../app/app-router-dom';
import categoriesConfig from '../../config/categories.json';
import SwitchModeButton from '../SwitchMode/SwitchMode';
import Store from '../Store/store';

export default class Categories {
    render() {
        const categories = document.createElement('main');
        const container = document.createElement('div');
        const categoriesInner = document.createElement('div');
        const categoriesTitle = this.#createTitle();
        const categoriesCards = this.#createCards();

        categories.classList.add('categories');
        container.classList.add('container');
        categoriesInner.classList.add('categories__inner');

        categoriesInner.append(categoriesTitle);
        categoriesInner.append(categoriesCards);
        categoriesInner.append(new SwitchModeButton().render());

        container.append(categoriesInner);
        categories.append(container);

        return categories;
    }

    #createTitle() {
        const title = document.createElement('h1');

        title.classList.add('categories__title');
        title.textContent = 'Choose category';

        return title;
    }

    #createCards() {
        const cards = document.createElement('div');
        cards.classList.add('categories__cards');

        categoriesConfig.forEach((category) => {
            const card = this.#createCard(category.title, category.image, category.href);
            cards.append(card);
        });

        return cards;
    }

    #createCard(title, imageSrc, href) {
        const card = document.createElement('a');
        const image = document.createElement('img');
        const description = document.createElement('div');

        card.classList.add('categories__card');
        image.classList.add('categories__card__image');
        description.classList.add('categories__card__description');

        if (Store.gameMode) {
            card.classList.add('active');
        }

        card.href = href;
        image.src = imageSrc;
        description.textContent = title;

        card.addEventListener('click', (event) => {
            event.preventDefault();
            AppRouterDOM.navigateTo(event.currentTarget.href);
        });

        card.append(image);
        card.append(description);

        return card;
    }
}
