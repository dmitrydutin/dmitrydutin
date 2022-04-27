import './Menu.scss';
import AppRouterDOM from '../../../app/app-router-dom';
import categoriesConfig from '../../../config/categories.json';

export default class Menu {
    #menuWrapper;
    #menu;

    open() {
        this.#menuWrapper.classList.add('opened');
        this.#menu.classList.add('opened');
        this.#menu.style.visibility = 'visible';
    }

    close() {
        this.#menuWrapper.classList.remove('opened');
        this.#menu.classList.remove('opened');

        return this.#menu.getAnimations()[0].finished.then(() => {
            this.#menu.style.visibility = 'hidden';
        });
    }

    render() {
        this.#menuWrapper = document.createElement('div');
        this.#menu = document.createElement('div');
        const menuTitle = this.#createMenuTitle();
        const menuBody = this.#createMenuBody();

        this.#menuWrapper.classList.add('menu-wrapper');
        this.#menu.classList.add('menu');

        this.#menuWrapper.addEventListener('click', (event) => {
            if (this.#menuWrapper === event.target) this.close();
        });

        this.#menu.append(menuTitle);
        this.#menu.append(menuBody);
        this.#menuWrapper.append(this.#menu);

        return this.#menuWrapper;
    }

    #createMenuTitle() {
        const title = document.createElement('div');
        const titleHomeLink = this.#createHomeLink();
        const titleCloseButton = this.#createCloseButton();

        title.classList.add('menu__title');

        title.append(titleHomeLink);
        title.append(titleCloseButton);

        return title;
    }

    #createHomeLink() {
        const homeLink = document.createElement('a');
        homeLink.classList.add('menu__title__link');

        homeLink.href = '/';
        homeLink.textContent = 'English for kids';
        homeLink.setAttribute('aria-label', 'Английский для детей');

        homeLink.addEventListener('click', (event) => {
            event.preventDefault();
            const currentTargetHref = event.currentTarget.href;

            this.close().then(() => {
                AppRouterDOM.navigateTo(currentTargetHref);
            });
        });

        return homeLink;
    }

    #createCloseButton() {
        const closeButton = document.createElement('div');
        const closeButtonLineTop = document.createElement('span');
        const closeButtonLineBottom = document.createElement('span');

        closeButton.classList.add('menu__close-button');
        closeButtonLineTop.classList.add('menu__close-button__line');
        closeButtonLineBottom.classList.add('menu__close-button__line');

        closeButton.setAttribute('aria-label', 'Закрыть меню');
        closeButton.setAttribute('role', 'button');
        closeButton.setAttribute('tabindex', '0');

        closeButton.append(closeButtonLineTop);
        closeButton.append(closeButtonLineBottom);

        closeButton.addEventListener('click', this.close.bind(this));

        closeButton.addEventListener('keypress', (event) => {
            if (['Space', 'Enter'].includes(event.code)) this.close();
        });

        return closeButton;
    }

    #createMenuBody() {
        const menuBody = document.createElement('div');
        menuBody.classList.add('menu__body');

        categoriesConfig.forEach((category) => {
            const menuItem = document.createElement('a');
            const menuItemIcon = document.createElement('img');
            const menuItemText = document.createElement('p');

            menuItem.classList.add('menu__body__link');
            menuItemIcon.classList.add('menu__body__link__icon');
            menuItemText.classList.add('menu__body__link__text');

            if (category.href === window.location.pathname) {
                menuItem.classList.add('active');
            }

            menuItem.href = category.href;
            menuItemIcon.src = category.image;
            menuItemText.textContent = category.title;

            menuItem.addEventListener('click', (event) => {
                event.preventDefault();
                const currentTargetHref = event.currentTarget.href;

                this.close().then(() => {
                    AppRouterDOM.navigateTo(currentTargetHref);
                });
            });

            menuItem.append(menuItemIcon);
            menuItem.append(menuItemText);
            menuBody.append(menuItem);
        });

        return menuBody;
    }
}
