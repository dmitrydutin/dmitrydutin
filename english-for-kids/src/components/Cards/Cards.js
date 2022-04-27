import './Cards.scss';
import AppRouterDOM from '../../app/app-router-dom';
import Store from '../Store/store';
import SwitchModeButton from '../SwitchMode/SwitchMode';
import { musicsSort } from './helpers';

export default class Cards {
    #config = null;
    #isTracked = false;
    #categoryIndex = 0;

    #statusBlock = null;
    #categoryInner = null;

    #isGameStart = false;
    #incorrectAnswers = 0;
    #disableCards = [];

    #musics = [];
    #currentMusic = {};

    constructor(config, isTracked, categoryIndex) {
        this.#config = config;
        this.#isTracked = isTracked;
        this.#categoryIndex = categoryIndex;

        this.#config.content.forEach((wordConfig, index) => {
            this.#musics.push({ id: index, audio: wordConfig.audio });
        });

        this.#musics.sort(musicsSort);
    }

    render() {
        const category = document.createElement('main');
        const container = document.createElement('div');
        const categoryInner = document.createElement('div');
        const categoryTitle = this.#createTitle(this.#config);
        const categoryCards = this.#createCards(this.#config);
        const controlBar = this.#createControlBar();

        category.classList.add('category');
        container.classList.add('container');
        categoryInner.classList.add('category__inner');

        categoryInner.append(categoryTitle);
        categoryInner.append(categoryCards);

        if (Store.gameMode && this.#config.content.length > 0) {
            categoryInner.append(controlBar);
        }

        categoryInner.append(new SwitchModeButton().render());

        container.append(categoryInner);
        category.append(container);

        this.#categoryInner = categoryInner;

        return category;
    }

    #createTitle(categoryConfig) {
        const title = document.createElement('h1');
        title.classList.add('category__title');
        title.textContent = categoryConfig.title;
        return title;
    }

    #createCards(categoryConfig) {
        const cards = document.createElement('div');
        cards.classList.add('category__cards');

        categoryConfig.content.forEach((cardConfig, index) => {
            const card = this.#createCard(cardConfig, index);
            cards.append(card);
        });

        return cards;
    }

    #createCard({ word, translation, image, audio: audioSrc }, index) {
        const card = document.createElement('div');
        const front = this.#createCardFront(image, word, audioSrc, card, index);
        const back = this.#createCardBack(image, translation);

        card.classList.add('category__card');
        if (Store.gameMode) card.classList.add('active');

        card.addEventListener('mouseleave', () => {
            card.classList.remove('rotated');
        });

        card.append(back);
        card.append(front);

        return card;
    }

    #createCardFront(image, word, audioSrc, card, index) {
        const front = document.createElement('div');
        const frontImage = document.createElement('img');
        const frontDescription = document.createElement('div');
        const rotateButton = document.createElement('div');

        front.classList.add('category__card__front');
        frontImage.classList.add('category__card__image');
        frontDescription.classList.add('category__card__description');
        rotateButton.classList.add('category__card__front__rotate-button');

        frontImage.src = image;
        frontDescription.textContent = word;

        this.#addFrontAccessibility(front, rotateButton, audioSrc, card, index);

        front.addEventListener('click', (event) => {
            if (event.target === rotateButton) return;

            if (Store.gameMode) {
                this.#frontCardController(index, front);
            } else {
                new Audio(audioSrc).play();

                if (this.#isTracked) {
                    Store.updateStatistics(this.#categoryIndex, index, 'trained');
                }
            }
        });

        rotateButton.addEventListener('click', () => {
            card.classList.add('rotated');
        });

        front.append(frontImage);

        if (!Store.gameMode) {
            front.append(frontDescription);
            front.append(rotateButton);
        }

        return front;
    }

    #addFrontAccessibility(front, rotateButton, audioSrc, card, index) {
        front.setAttribute('aria-label', 'Воспроизвести запись');
        front.setAttribute('role', 'button');
        front.setAttribute('tabindex', '0');

        rotateButton.setAttribute('aria-label', 'Перевернуть карточку');
        rotateButton.setAttribute('role', 'button');
        rotateButton.setAttribute('tabindex', '0');

        front.addEventListener('keypress', (event) => {
            if (event.target === rotateButton) return;

            if (Store.gameMode) {
                this.#frontCardController(index, front);
            } else {
                new Audio(audioSrc).play();

                if (this.#isTracked) {
                    Store.updateStatistics(this.#categoryIndex, index, 'trained');
                }
            }
        });

        rotateButton.addEventListener('keypress', (event) => {
            if (['Space', 'Enter'].includes(event.code)) {
                card.classList.add('rotated');
            }
        });
    }

    #createCardBack(image, translation) {
        const back = document.createElement('div');
        const backImage = document.createElement('img');
        const backDescription = document.createElement('div');

        back.classList.add('category__card__back');
        backImage.classList.add('category__card__image');
        backDescription.classList.add('category__card__description');

        backImage.src = image;
        backDescription.textContent = translation;

        back.append(backImage);

        if (!Store.gameMode) {
            back.append(backDescription);
        }

        return back;
    }

    #createControlBar() {
        const controlBar = document.createElement('div');
        const startGameButton = document.createElement('button');
        this.#statusBlock = document.createElement('div');

        controlBar.classList.add('category__control-bar');
        startGameButton.classList.add('category__control-bar__start-game');
        this.#statusBlock.classList.add('category__control-bar__status-block');

        startGameButton.textContent = 'Start game';

        startGameButton.addEventListener('click', () => {
            this.#startGameButtonController(startGameButton);
        });

        controlBar.append(startGameButton);
        controlBar.append(this.#statusBlock);

        return controlBar;
    }

    #createStar() {
        const star = document.createElement('div');
        star.classList.add('category__control-bar__status-block__star');
        this.#statusBlock.append(star);
    }

    #createEmptyStar() {
        const star = document.createElement('div');
        star.classList.add('category__control-bar__status-block__star--empty');
        this.#statusBlock.append(star);
    }

    #startGame(startGameButton) {
        this.#isGameStart = true;
        startGameButton.classList.add('active');
    }

    #startGameButtonController(startGameButton) {
        if (this.#isGameStart) {
            new Audio(this.#currentMusic.audio).play();
        } else {
            this.#startGame(startGameButton);

            this.#currentMusic = this.#musics.pop();
            new Audio(this.#currentMusic.audio).play();
        }
    }

    #frontCardController(index, front) {
        if (!this.#isGameStart || this.#disableCards.includes(index)) return;

        if (this.#currentMusic.id === index) {
            this.#createStar();
            const sound = new Audio('correct.wav').play();
            this.#soundController(sound);

            front.classList.add('disabled');
            this.#disableCards.push(index);

            if (this.#isTracked) {
                Store.updateStatistics(this.#categoryIndex, index, 'correct');
            }
        } else {
            this.#createEmptyStar();
            new Audio('wrong.wav').play();

            this.#incorrectAnswers += 1;

            if (this.#isTracked) {
                Store.updateStatistics(this.#categoryIndex, index, 'incorrect');
            }
        }
    }

    #soundController(sound) {
        if (this.#musics.length > 0) {
            this.#currentMusic = this.#musics.pop();
            sound.then(() => {
                setTimeout(() => {
                    new Audio(this.#currentMusic.audio).play();
                }, 630);
            });
        } else {
            this.#gameEndController();
        }
    }

    #gameEndController() {
        if (this.#incorrectAnswers === 0) {
            new Audio('success.mp3').play();
            this.#createPopup('like.svg', 'Success');
        } else {
            new Audio('failure.mp3').play();
            this.#createPopup('dislike.svg', `Failure: ${this.#incorrectAnswers} mistakes`);
        }

        setTimeout(() => {
            AppRouterDOM.navigateTo('/');
        }, 5000);
    }

    #createPopup(src, text) {
        this.#categoryInner.innerHTML = '';
        const categoryTitle = this.#createTitle(this.#config);
        this.#categoryInner.append(categoryTitle);

        const popup = document.createElement('div');
        const popupImage = document.createElement('img');
        const popupText = document.createElement('div');

        popup.classList.add('category__popup');
        popupImage.classList.add('category__popup__image');
        popupText.classList.add('category__popup__text');

        popupImage.src = src;
        popupText.textContent = text;

        popup.append(popupImage);
        popup.append(popupText);
        this.#categoryInner.append(popup);
    }
}
