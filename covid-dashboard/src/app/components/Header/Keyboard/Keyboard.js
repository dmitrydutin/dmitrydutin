import './Keyboard.scss';
import config from './keyboard.json';

export default class Keyboard {
    elements = {
        keyboard: null,
        keysConfig: null,
        textBlock: null,
    };

    properties = {
        value: '',
        lang: 'en',
        shift: false,
        capsLock: false,
        cursorPosition: 0,
    };

    constructor(textBlock) {
        this.elements.textBlock = textBlock;
        this.elements.keysConfig = config;

        this.#setKeyboardListeners();
    }

    render() {
        this.elements.keyboard = document.createElement('div');
        this.elements.keyboard.classList.add('keyboard', 'keyboard--hidden');
        this.#fillKeyboard();

        return this.elements.keyboard;
    }

    #setKeyboardListeners() {
        this.elements.textBlock.addEventListener('focus', () => {
            this.elements.keyboard.classList.remove('keyboard--hidden');
        });

        window.addEventListener('click', (event) => {
            const keyboard = event.target.closest('.keyboard');
            const input = event.target.closest('input');

            if (keyboard === null && input === null) {
                this.elements.keyboard.classList.add('keyboard--hidden');
            }
        });

        this.elements.textBlock.addEventListener('click', () => {
            this.properties.cursorPosition = this.elements.textBlock.selectionStart;
        });
    }

    #fillKeyboard() {
        const keyboardKeys = document.createDocumentFragment();

        this.elements.keysConfig.forEach((rowConfig) => {
            const row = this.#createRow(rowConfig);
            keyboardKeys.append(row);
        });

        this.elements.keyboard.innerHTML = '';
        this.elements.keyboard.append(keyboardKeys);
    }

    #createRow(rowConfig) {
        const row = document.createElement('div');
        row.classList.add('row');

        rowConfig.forEach((keyConfig) => {
            const key = this.#createKey(keyConfig);
            row.append(key);
        });

        return row;
    }

    #createKey(keyConfig) {
        const key = document.createElement('div');
        key.classList.add(...this.#getKeyClasses(keyConfig));
        key.textContent = keyConfig[this.properties.lang][this.#getType()];

        key.addEventListener('click', () => {
            setTimeout(() => {
                this.#setKeyEvent(keyConfig);
            }, 100);
        });

        return key;
    }

    #getKeyClasses(keyConfig) {
        const classes = ['keyboard__key'];

        keyConfig.classes?.forEach((keyClass) => {
            classes.push(keyClass);
        });

        if (
            (keyConfig.code === '20' && this.properties.capsLock)
            || (keyConfig.code === '16' && this.properties.shift)
        ) {
            classes.push('active');
        }

        return classes;
    }

    #getType() {
        if (this.properties.capsLock === true && this.properties.shift === true) return 'caps&shift';
        if (this.properties.capsLock === true) return 'caps';
        if (this.properties.shift === true) return 'shift';
        return 'default';
    }

    #setKeyEvent(keyConfig) {
        switch (keyConfig.event) {
            case 'delete':
                if (this.#isTextRange()) {
                    this.#setText('');
                } else if (this.properties.cursorPosition > 0) {
                    this.properties.value = this.#getUnselectedText(this.properties.cursorPosition);
                    this.elements.textBlock.value = this.properties.value;
                    this.#setCursorPosition('left');
                }

                this.elements.textBlock.dispatchEvent(new Event('input'));
                break;
            case 'tab':
                this.#setText('    ');
                this.elements.textBlock.dispatchEvent(new Event('input'));
                break;
            case 'caps':
                this.properties.capsLock = !this.properties.capsLock;
                this.#fillKeyboard();
                break;
            case 'enter':
                this.elements.textBlock.dispatchEvent(new Event('search'));
                break;
            case 'shift':
                this.properties.shift = !this.properties.shift;
                this.#fillKeyboard();
                break;
            case 'close':
                this.elements.textBlock.blur();
                this.elements.keyboard.classList.add('keyboard--hidden');
                break;
            case 'lang':
                this.properties.lang = this.properties.lang === 'en' ? 'ru' : 'en';
                this.#fillKeyboard();
                break;
            case 'space':
                this.#setText(' ');
                break;
            case 'arrow-left':
                this.#setCursorPosition('left');
                break;
            case 'arrow-right':
                this.#setCursorPosition('right');
                break;
            case 'control':
                break;
            case 'alt':
                break;
            default:
                this.#setText(keyConfig[this.properties.lang][this.#getType()]);
        }

        if (keyConfig.event !== 'close') {
            this.elements.textBlock.focus();
        }
    }

    #getUnselectedText(cursorPosition) {
        const leftUnselectedText = this.properties.value.slice(0, cursorPosition - 1);
        const rightUnselectedText = this.properties.value.slice(cursorPosition);

        return leftUnselectedText + rightUnselectedText;
    }

    #setText(text) {
        this.elements.textBlock.setRangeText(
            text,
            this.elements.textBlock.selectionStart,
            this.elements.textBlock.selectionEnd,
            'end',
        );

        this.properties.value = this.elements.textBlock.value;
        this.properties.cursorPosition = this.elements.textBlock.selectionStart;

        this.elements.textBlock.dispatchEvent(new Event('input'));
    }

    #isTextRange() {
        return (
            this.elements.textBlock.selectionStart
            !== this.elements.textBlock.selectionEnd
        );
    }

    #setCursorPosition(direction) {
        if (direction === 'right') {
            if (this.properties.cursorPosition < this.elements.textBlock.value.length) {
                this.properties.cursorPosition += 1;
            }
        } else if (direction === 'left') {
            if (this.properties.cursorPosition > 0) {
                this.properties.cursorPosition -= 1;
            }
        }

        this.elements.textBlock.selectionStart = this.properties.cursorPosition;
        this.elements.textBlock.selectionEnd = this.properties.cursorPosition;
    }
}
