import Store from './Store/Store';
import Board from './Board/Board';
import Menu from './Menu/Menu';
import TopButtonsGroup from './TopButtonsGroup/TopButtonsGroup';
import BottomButtonsGroup from './BottomButtonsGroup/BottomButtonsGroup';

const getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max));

class Puzzle {
    #store = new Store();
    #board = new Board();

    create() {
        this.#store.loadGame();

        if (this.#store.getConfig() === null) {
            this.#store.createConfig();
            this.#mixConfig();
            this.#store.saveGame();
        }

        Menu.create(
            this.#store.getBoardSize(),
            this.#selectListener.bind(this),
            this.#store.getViewMode(),
            this.#viewModeListener.bind(this),
            this.#store.getSound(),
            this.#soundListener.bind(this),
            this.#store.getRecords(),
            this.#resultListener.bind(this)
        );

        TopButtonsGroup.create(
            this.#timeListener.bind(this),
            this.#store.getStringTime.bind(this.#store),
            this.#store.getMoves(),
            this.#settingsListener.bind(this)
        );

        this.#createBoard();
        BottomButtonsGroup.create(this.#newGameListener.bind(this));
    }

    #mixConfig() {
        this.#board.mixConfig(
            this.#store.getBoardSize(),
            this.#store.getConfig(),
            2000,
            this.#store.replaceConfigValues.bind(this.#store),
            this.#store.pushHistory.bind(this.#store)
        );
    }

    #createBoard() {
        this.#board.create();
        this.#board.setBoardStyles(this.#store.getBoardSize());
        this.#fillBoard();

        this.#board.setBoardListeners(
            this.#store.getConfig(),
            this.#store.getBoardSize(),
            this.#replaceChips.bind(this),
            this.#animationReplaceChips.bind(this),
            this.#store.getIsGameEnd()
        );
    }

    #fillBoard() {
        const store = this.#store;

        this.#board.fill(store.getConfig());
        this.#board.fillChips(store.getConfig(), store.getViewMode(), store.getImage());
        this.#board.setChipsStyles(store.getConfig(), store.getBoardSize());

        if (this.#store.checkGameEnd()) {
            this.#store.setIsGameEnd(true);
            this.#store.setRecord();
            this.#store.saveGame();
            Menu.fillScoreTable(this.#store.getBoardSize(), this.#store.getRecords());
            this.#board.gameEnd(this.#store.getStringTime(), this.#store.getMoves());
        }
    }

    #replaceChips(chipIndex, emptyIndex) {
        this.#store.replaceConfigValues(chipIndex, emptyIndex);
        this.#fillBoard();

        this.#store.setMoves(this.#store.getMoves() + 1);
        TopButtonsGroup.updateMovesBlock(this.#store.getMoves());

        this.#store.pushHistory({ chipIndex, emptyIndex });

        Board.playSound(this.#store.getSound());
        this.#store.saveGame();
    }

    #animationReplaceChips(chipIndex, emptyIndex) {
        this.#store.replaceConfigValues(chipIndex, emptyIndex);
        this.#board.chipAnimation(this.#store.getBoardSize(), chipIndex, emptyIndex);
        setTimeout(this.#fillBoard.bind(this), 120);

        this.#store.setMoves(this.#store.getMoves() + 1);
        TopButtonsGroup.updateMovesBlock(this.#store.getMoves());

        this.#store.pushHistory({ chipIndex, emptyIndex });

        Board.playSound(this.#store.getSound());
        this.#store.saveGame();
    }

    #timeListener() {
        if (this.#store.getIsGameEnd()) return;
        this.#store.setTime(this.#store.getTime() + 1);
        this.#store.saveTime();
    }

    #newGameListener() {
        this.#store.clearHistory();
        this.#store.createConfig();
        this.#mixConfig();

        this.#store.setIsGameEnd(false);
        this.#store.setTime(0);
        this.#store.setMoves(0);
        TopButtonsGroup.updateMovesBlock(0);
        this.#setImage();
        this.#store.saveGame();

        this.#board.setBoardStyles(this.#store.getBoardSize());
        this.#fillBoard();

        this.#board.setBoardListeners(
            this.#store.getConfig(),
            this.#store.getBoardSize(),
            this.#replaceChips.bind(this),
            this.#animationReplaceChips.bind(this),
            this.#store.getIsGameEnd()
        );

        Menu.autoResult.removeAttribute('disabled');
    }

    #setImage() {
        const imageUrls = ['1.jpg', '2.jpg', '3.jpg', '4.jpg'];
        const randomIndex = getRandomInt(imageUrls.length);
        this.#store.setImage(imageUrls[randomIndex]);
    }

    #settingsListener() {
        Menu.viewMenu();
    }

    #selectListener(boardSize) {
        this.#store.setBoardSize(boardSize);
        this.#newGameListener();
        Menu.fillScoreTable(this.#store.getBoardSize(), this.#store.getRecords());
    }

    #viewModeListener() {
        this.#store.setViewMode(this.#store.getViewMode() === 'number' ? 'image' : 'number');
        this.#board.fillChips(
            this.#store.getConfig(),
            this.#store.getViewMode(),
            this.#store.getImage()
        );
        this.#store.saveGame();
    }

    #soundListener() {
        this.#store.setSound(!this.#store.getSound());
        this.#store.saveGame();
    }

    #resultListener() {
        for (let i = 0; i < this.#store.getHistoryLength(); i++) {
            setTimeout(() => {
                const { chipIndex, emptyIndex } = this.#store.getHistoryLastItem();

                this.#store.replaceConfigValues(chipIndex, emptyIndex);
                this.#board.chipAnimation(this.#store.getBoardSize(), chipIndex, emptyIndex);
                setTimeout(this.#fillBoard.bind(this), 120);

                this.#store.setMoves(this.#store.getMoves() + 1);
                TopButtonsGroup.updateMovesBlock(this.#store.getMoves());

                Board.playSound(this.#store.getSound());
                this.#store.saveGame();
            }, 120 * i * 2);
        }
    }
}

export default Puzzle;
