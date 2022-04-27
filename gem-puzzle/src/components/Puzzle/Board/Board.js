import './Board.scss';

const BODY_PADDING = 20;
const MIN_WIDTH = 500;

const range = (start, end) => [...Array(end - start + 1).keys()].map((i) => i + start);

export default class Board {
    #board = document.createElement('div');
    #boardInner = document.createElement('div');
    #chips = [];

    create() {
        const container = document.createElement('div');

        this.#board.classList.add('board');
        container.classList.add('container');
        this.#boardInner.classList.add('board__inner');

        container.append(this.#boardInner);
        this.#board.append(container);
        document.body.append(this.#board);
    }

    setBoardStyles(boardSize) {
        const boardStyles = () => {
            const boardGap = document.body.clientWidth > MIN_WIDTH ? '5px' : '0.89vw';

            const bodyWidth = document.body.clientWidth;
            const boardWidth = `${bodyWidth > MIN_WIDTH ? 480 : bodyWidth - BODY_PADDING}px`;
            const boardGapsWidth = `${boardGap} * ${boardSize - 1}`;
            const boardClearWidth = `(${boardWidth} - ${boardGapsWidth})`;
            const chipFontSize = `calc(${boardClearWidth} / ${boardSize} / 2.5)`;

            this.#boardInner.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
            this.#boardInner.style.gap = boardGap;
            this.#boardInner.style.fontSize = chipFontSize;
        };

        boardStyles();
        window.addEventListener('resize', boardStyles);
    }

    fill(config) {
        this.#boardInner.innerHTML = '';
        this.#chips = [];

        config.forEach((chipConfig) => {
            const chip = Board.#createChip(chipConfig);
            this.#chips.push(chip);
        });

        this.#chips.forEach((chip) => {
            this.#boardInner.append(chip);
        });
    }

    static #createChip(chipConfig) {
        const chip = document.createElement('div');
        chip.classList.add(chipConfig.class);

        if (chipConfig.class !== 'empty') {
            chip.setAttribute('draggable', 'true');
        }

        return chip;
    }

    fillChips(config, viewMode, image) {
        this.#chips = this.#chips.map((chip, chipIndex) => {
            const newChip = chip;

            if (config[chipIndex].class !== 'empty') {
                switch (viewMode) {
                    case 'number':
                        newChip.textContent = config[chipIndex].number;
                        newChip.style.backgroundImage = '';
                        break;
                    case 'image':
                        newChip.textContent = '';
                        newChip.style.backgroundImage = `url(${image})`;
                        break;
                    default:
                        throw new Error('Unsupported ViewMode');
                }
            }

            return newChip;
        });
    }

    setChipsStyles(config, boardSize) {
        const chipStyle = () => {
            this.#chips = this.#chips.map((chip, chipIndex) => {
                const newChip = chip;

                const bodyWidth = document.body.clientWidth;
                newChip.style.backgroundSize = `${bodyWidth > 500 ? 480 : bodyWidth - 20}px`;

                const chipId = config[chipIndex].id;
                newChip.style.backgroundPosition = Board.getImagePosition(chipId, boardSize);

                return newChip;
            });
        };

        chipStyle();
        window.addEventListener('resize', chipStyle);
    }

    static getImagePosition(id, boardSize) {
        const ceil = Math.floor(id % boardSize);
        const row = Math.floor(id / boardSize);
        const position = 100 / (boardSize - 1);
        return `${ceil * position}% ${row * position}%`;
    }

    setBoardListeners(config, boardSize, replaceChips, animationReplaceChips, isGameEnd) {
        if (isGameEnd) return;

        this.#boardInner.onclick = (event) => {
            if (event.target.className === 'chip') {
                const chipIndex = this.#getChipIndex(event.target);
                const emptyIndex = this.#getEmptyIndex(config);

                if (this.#isConfigValueReplaced(boardSize, chipIndex, emptyIndex)) {
                    animationReplaceChips(chipIndex, emptyIndex);
                }
            }
        };

        this.#boardInner.ondragstart = (event) => {
            const chipIndex = this.#getChipIndex(event.target);
            event.dataTransfer.setData('text/plain', JSON.stringify(chipIndex));

            setTimeout(() => {
                event.target.classList.add('hide');
            }, 0);
        };

        this.#boardInner.ondragend = (event) => {
            event.target.classList.remove('hide');
        };

        this.#boardInner.ondragover = (event) => {
            event.preventDefault();
        };

        this.#boardInner.ondrop = (event) => {
            event.preventDefault();

            if (event.target.className !== 'empty') return;

            const chipIndex = JSON.parse(event.dataTransfer.getData('text/plain'));
            const emptyIndex = this.#getEmptyIndex(config);

            if (this.#isConfigValueReplaced(boardSize, chipIndex, emptyIndex)) {
                replaceChips(chipIndex, emptyIndex);
            }
        };
    }

    chipAnimation(boardSize, chipIndex, emptyIndex) {
        const chip = this.#chips[chipIndex];
        const empty = this.#chips[emptyIndex];

        const gap = document.body.clientWidth > 550 ? '5px' : '0.89vw';
        const basic = `calc(100% + ${gap})`;
        const basicReverse = `calc(-100% - ${gap})`;

        switch (chipIndex) {
            case emptyIndex - 1:
                chip.style.left = basic;
                empty.style.left = basicReverse;
                break;
            case emptyIndex + 1:
                chip.style.left = basicReverse;
                empty.style.left = basic;
                break;
            case emptyIndex - boardSize:
                chip.style.top = basic;
                empty.style.top = basicReverse;
                break;
            case emptyIndex + boardSize:
                chip.style.top = basicReverse;
                empty.style.top = basic;
                break;
            default:
                throw new Error('Unsupported chipIndex');
        }

        this.#chips[chipIndex] = chip;
        this.#chips[emptyIndex] = empty;
    }

    #getEmptyIndex(config) {
        return config.findIndex((chipConfig) => chipConfig.class === 'empty');
    }

    #getChipIndex(target) {
        return this.#chips.findIndex((chip) => chip === target);
    }

    #isConfigValueReplaced(boardSize, chipIndex, emptyIndex) {
        const possibleIndexes = Board.#getConfigPossibleIndexes(boardSize, emptyIndex);
        return possibleIndexes.includes(chipIndex);
    }

    static #getConfigPossibleIndexes(boardSize, emptyIndex) {
        const possibleIndexes = [];

        if (emptyIndex % boardSize !== 0) {
            possibleIndexes.push(emptyIndex - 1);
        }

        if (emptyIndex % boardSize !== boardSize - 1) {
            possibleIndexes.push(emptyIndex + 1);
        }

        if (!range(0, boardSize - 1).includes(emptyIndex)) {
            possibleIndexes.push(emptyIndex - boardSize);
        }

        if (!range(boardSize ** 2 - boardSize, boardSize ** 2 - 1).includes(emptyIndex)) {
            possibleIndexes.push(emptyIndex + boardSize);
        }

        return possibleIndexes;
    }

    mixConfig(boardSize, config, times, replaceConfigValues, pushHistory) {
        for (let i = 0; i < times; i++) {
            const emptyIndex = this.#getEmptyIndex(config);
            const possibleIndexes = Board.#getConfigPossibleIndexes(boardSize, emptyIndex);
            const chipIndex = possibleIndexes.sort(() => Math.random() - 0.5)[0];
            replaceConfigValues(chipIndex, emptyIndex);
            pushHistory({ chipIndex, emptyIndex });
        }
    }

    gameEnd(stringTime, moves) {
        const winBlock = document.createElement('div');
        winBlock.classList.add('winBlock');
        winBlock.textContent = `Ура! Вы решили головоломку за ${stringTime} и ${moves} ходов`;
        this.#boardInner.append(winBlock);
    }

    static playSound(isSound) {
        if (isSound) {
            const sound = new Audio('keyAudio.mp3');
            sound.play();
        }
    }
}
