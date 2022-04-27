export default class Store {
    #boardSize = null;
    #config = [];
    #viewMode = null;
    #image = null;
    #isSound = null;
    #isGameEnd = false;
    #time = 0;
    #moves = 0;
    #records = null;
    #history = null;

    createConfig() {
        this.#config = [];

        for (let i = 0; i < this.#boardSize ** 2; i++) {
            this.#config.push({
                id: i,
                number: i + 1,
                class: i === this.#boardSize ** 2 - 1 ? 'empty' : 'chip'
            });
        }
    }

    getConfig() {
        return this.#config;
    }

    replaceConfigValues(chipIndex, emptyIndex) {
        [this.#config[emptyIndex], this.#config[chipIndex]] = [
            this.#config[chipIndex],
            this.#config[emptyIndex]
        ];
    }

    setBoardSize(boardSize) {
        this.#boardSize = boardSize;
    }

    getBoardSize() {
        return this.#boardSize;
    }

    setViewMode(viewMode) {
        this.#viewMode = viewMode;
    }

    getViewMode() {
        return this.#viewMode;
    }

    setImage(image) {
        this.#image = image;
    }

    getImage() {
        return this.#image;
    }

    setSound(isSound) {
        this.#isSound = isSound;
    }

    getSound() {
        return this.#isSound;
    }

    setIsGameEnd(isGameEnd) {
        this.#isGameEnd = isGameEnd;
    }

    getIsGameEnd() {
        return this.#isGameEnd;
    }

    setTime(time) {
        this.#time = time;
    }

    getTime() {
        return this.#time;
    }

    setMoves(moves) {
        this.#moves = moves;
    }

    getMoves() {
        return this.#moves;
    }

    pushHistory(historyItem) {
        this.#history.push(historyItem);
    }

    clearHistory() {
        this.#history.length = 0;
    }

    getHistoryLastItem() {
        return this.#history.pop();
    }

    getHistoryLength() {
        return this.#history.length;
    }

    setRecord() {
        const date = new Date();

        const currentScore = {
            date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
            moves: this.#moves
        };

        this.#records[this.#boardSize].push(currentScore);
        this.#records[this.#boardSize].sort((a, b) => a.moves - b.moves);

        if (this.#records[this.#boardSize].length > 10) {
            this.#records[this.#boardSize].length = 10;
        }
    }

    getRecords() {
        return this.#records;
    }

    saveGame() {
        localStorage.setItem('boardSize', JSON.stringify(this.#boardSize));
        localStorage.setItem('config', JSON.stringify(this.#config));
        localStorage.setItem('viewMode', JSON.stringify(this.#viewMode));
        localStorage.setItem('image', JSON.stringify(this.#image));
        localStorage.setItem('isSound', JSON.stringify(this.#isSound));
        localStorage.setItem('time', JSON.stringify(this.#time));
        localStorage.setItem('moves', JSON.stringify(this.#moves));
        localStorage.setItem('records', JSON.stringify(this.#records));
        localStorage.setItem('history', JSON.stringify(this.#history));
    }

    loadGame() {
        const defaultRecords = {
            3: [],
            4: [],
            5: [],
            6: [],
            7: [],
            8: []
        };

        this.#boardSize = JSON.parse(localStorage.getItem('boardSize')) ?? 4;
        this.#config = JSON.parse(localStorage.getItem('config'));
        this.#viewMode = JSON.parse(localStorage.getItem('viewMode')) ?? 'number';
        this.#image = JSON.parse(localStorage.getItem('image')) ?? '1.jpg';
        this.#isSound = JSON.parse(localStorage.getItem('isSound')) ?? true;
        this.#time = JSON.parse(localStorage.getItem('time')) ?? 0;
        this.#moves = JSON.parse(localStorage.getItem('moves')) ?? 0;
        this.#records = JSON.parse(localStorage.getItem('records')) ?? defaultRecords;
        this.#history = JSON.parse(localStorage.getItem('history')) ?? [];
    }

    saveTime() {
        localStorage.setItem('time', JSON.stringify(this.#time));
    }

    checkGameEnd() {
        let bufferId = -1;

        return this.#config.every((chip) => {
            if (bufferId > chip.id) return false;
            bufferId = chip.id;
            return true;
        });
    }

    getStringTime() {
        const minutes = Math.floor(this.#time / 60);
        const seconds = this.#time % 60;

        const stringMinutes = minutes < 10 ? `0${minutes}` : minutes;
        const stringSeconds = seconds < 10 ? `0${seconds}` : seconds;

        return `${stringMinutes}:${stringSeconds}`;
    }
}
