import './Menu.scss';

export default class Menu {
    static #menu = null;
    static #scoreTableBody = null;
    static autoResult = null;

    static viewMenu() {
        this.#menu.classList.remove('hide');
    }

    static create(
        boardSize,
        selectListener,
        viewMode,
        viewModeListener,
        isSound,
        soundListener,
        records,
        resultListener
    ) {
        Menu.#menu = document.createElement('div');
        Menu.#menu.classList.add('menu', 'hide');

        const container = document.createElement('div');
        container.classList.add('container');

        Menu.#menu.addEventListener('click', (event) => {
            if (Menu.#menu === event.target || container === event.target) {
                Menu.#menu.classList.add('hide');
            }
        });

        const menuInner = document.createElement('div');
        menuInner.classList.add('menu__inner');

        const selectBoardSize = Menu.#getSelectBoardSize(boardSize, selectListener);
        const imageButton = Menu.#getImageButton(viewMode, viewModeListener);
        const soundButton = Menu.#getSoundButton(isSound, soundListener);
        const autoResult = Menu.#getAutoResult(boardSize, resultListener);

        const table = Menu.#getScoreTable();
        Menu.fillScoreTable(boardSize, records);

        menuInner.append(selectBoardSize);
        menuInner.append(imageButton);
        menuInner.append(soundButton);
        menuInner.append(autoResult);
        menuInner.append(table);

        container.append(menuInner);
        Menu.#menu.append(container);
        document.body.append(Menu.#menu);
    }

    static #getSelectBoardSize(boardSize, selectListener) {
        const selectValues = ['3x3', '4x4', '5x5', '6x6', '7x7', '8x8'];
        const selectBoardSize = document.createElement('select');
        selectBoardSize.classList.add('select-css');

        selectValues.forEach((value, index) => {
            const option = document.createElement('option');
            option.textContent = value;
            if (index + 3 === boardSize) option.setAttribute('selected', '');
            selectBoardSize.append(option);
        });

        selectBoardSize.addEventListener('change', () => {
            selectListener(selectBoardSize.selectedIndex + 3);
            Menu.autoResult.removeAttribute('disabled');
        });

        return selectBoardSize;
    }

    static #createButton(textContent, disabled) {
        const btn = document.createElement('button');
        btn.classList.add('btn');
        if (disabled) btn.classList.add('disabled');
        btn.textContent = textContent;
        return btn;
    }

    static #getImageButton(viewMode, viewModeListener) {
        const imageButton = Menu.#createButton('Image', viewMode === 'number');

        imageButton.addEventListener('click', () => {
            viewModeListener();
            imageButton.classList.toggle('disabled');
        });

        return imageButton;
    }

    static #getSoundButton(isSound, soundListener) {
        const soundButton = Menu.#createButton('Sound', !isSound);

        soundButton.addEventListener('click', () => {
            soundListener();
            soundButton.classList.toggle('disabled');
        });

        return soundButton;
    }

    static #getAutoResult(boardSize, resultListener) {
        Menu.autoResult = Menu.#createButton('Auto result', false);
        if (boardSize !== 4) Menu.autoResult.setAttribute('disabled', 'true');

        Menu.autoResult.addEventListener('click', () => {
            resultListener();
            Menu.autoResult.setAttribute('disabled', 'true');
        });

        return Menu.autoResult;
    }

    static #getScoreTable() {
        const table = document.createElement('table');
        table.classList.add('records-table');

        const caption = Menu.#getCaption();
        table.append(caption);

        const thead = document.createElement('thead');
        const tableHead = Menu.#getTableHead();
        thead.append(tableHead);
        table.append(thead);

        Menu.#scoreTableBody = document.createElement('tbody');
        table.append(Menu.#scoreTableBody);

        return table;
    }

    static #getCaption() {
        const caption = document.createElement('caption');
        caption.textContent = 'Best records';
        return caption;
    }

    static #getTableHead() {
        const tr = document.createElement('tr');

        const position = document.createElement('th');
        position.textContent = '#';

        const dateTh = document.createElement('th');
        dateTh.textContent = 'Date';

        const movesTh = document.createElement('th');
        movesTh.textContent = 'Moves';

        tr.append(position);
        tr.append(dateTh);
        tr.append(movesTh);
        return tr;
    }

    static fillScoreTable(boardSize, records) {
        const boardRecords = records[boardSize];
        Menu.#scoreTableBody.innerHTML = '';

        boardRecords.forEach((record, index) => {
            const tr = document.createElement('tr');

            const position = document.createElement('td');
            position.textContent = index + 1;

            const dateTd = document.createElement('td');
            dateTd.textContent = record.date;

            const movesTd = document.createElement('td');
            movesTd.textContent = record.moves;

            tr.append(position);
            tr.append(dateTd);
            tr.append(movesTd);
            Menu.#scoreTableBody.append(tr);
        });
    }
}
