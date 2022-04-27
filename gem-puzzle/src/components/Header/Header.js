import './Header.scss';

export default class Header {
    static create() {
        const header = document.createElement('section');
        header.classList.add('puzzle__header');

        const container = document.createElement('div');
        container.classList.add('container');

        const headerInner = document.createElement('div');
        headerInner.classList.add('puzzle__header__inner');

        const headerText = document.createElement('h1');
        headerText.classList.add('puzzle__header__text');
        headerText.textContent = 'Gem Puzzle';

        headerInner.append(headerText);
        container.append(headerInner);
        header.append(container);
        document.body.append(header);
    }
}
