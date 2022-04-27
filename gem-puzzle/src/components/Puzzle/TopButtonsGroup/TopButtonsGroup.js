import './TopButtonsGroup.scss';

export default class TopButtonsGroup {
    static #movesBlock = null;

    static create(timeListener, getStringTime, moves, settingsListener) {
        const buttonsGroup = document.createElement('div');
        const container = document.createElement('div');
        const buttonsGroupInner = document.createElement('div');
        const settingsButton = TopButtonsGroup.#getSettingsButton(settingsListener);
        const infoPanel = TopButtonsGroup.#getInfoPanel(timeListener, getStringTime, moves);

        buttonsGroup.classList.add('puzzle__btn-group');
        container.classList.add('container');
        buttonsGroupInner.classList.add('puzzle__btn-group__inner');

        buttonsGroupInner.append(settingsButton);
        buttonsGroupInner.append(infoPanel);
        container.append(buttonsGroupInner);
        buttonsGroup.append(container);
        document.body.append(buttonsGroup);
    }

    static #getSettingsButton(settingsListener) {
        const settingsButton = document.createElement('button');
        settingsButton.classList.add('btn');
        settingsButton.textContent = 'Settings';
        settingsButton.addEventListener('click', settingsListener);
        return settingsButton;
    }

    static #getInfoPanel(timeListener, getStringTime, moves) {
        const infoPanel = document.createElement('div');
        infoPanel.classList.add('info-panel');

        const timeBlock = TopButtonsGroup.#getTimeBlock(timeListener, getStringTime);
        const movesBlock = TopButtonsGroup.#getMovesBlock(moves);

        infoPanel.append(timeBlock);
        infoPanel.append(movesBlock);

        return infoPanel;
    }

    static #getTimeBlock(timeListener, getStringTime) {
        const timeBlock = document.createElement('div');
        timeBlock.textContent = getStringTime();

        setInterval(() => {
            timeListener();
            timeBlock.textContent = getStringTime();
        }, 1000);

        return timeBlock;
    }

    static #getMovesBlock(moves) {
        TopButtonsGroup.#movesBlock = document.createElement('div');
        TopButtonsGroup.updateMovesBlock(moves);
        return TopButtonsGroup.#movesBlock;
    }

    static updateMovesBlock(moves) {
        TopButtonsGroup.#movesBlock.textContent = moves;
    }
}
