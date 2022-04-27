import './BottomButtonsGroup.scss';

export default class BottomButtonsGroup {
    static create(newGameListener) {
        const buttonsGroup = document.createElement('div');
        const container = document.createElement('div');
        const buttonsGroupInner = document.createElement('div');
        const newGameButton = BottomButtonsGroup.#getNewGameButton(newGameListener);

        buttonsGroup.classList.add('puzzle__btn-group');
        container.classList.add('container');
        buttonsGroupInner.classList.add('puzzle__btn-group__inner');

        buttonsGroupInner.append(newGameButton);
        container.append(buttonsGroupInner);
        buttonsGroup.append(container);
        document.body.append(buttonsGroup);
    }

    static #getNewGameButton(newGameListener) {
        const newGameButton = document.createElement('button');
        newGameButton.classList.add('btn', 'btn-large');
        newGameButton.textContent = 'New game';
        newGameButton.addEventListener('click', newGameListener);
        return newGameButton;
    }
}
