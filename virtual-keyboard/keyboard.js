class Keyboard {
    elements = {
        keyboard: null,
        keysConfig: null,
        textBlock: null,
        activeKeys: [],
    }

    properties = {
        value: '',
        lang: 'en',
        shift: false,
        capsLock: false,
        cursorPosition: 0,
        audio: true,
        micro: false,
    }

    constructor(textBlock, keysConfig) {
        this.elements.textBlock = textBlock
        this.elements.keysConfig = keysConfig

        this.elements.textBlock?.addEventListener('focus', () => {
            this.elements.keyboard.classList.remove('keyboard--hidden')
        })

        this.elements.textBlock.addEventListener('click', () => {
            this.properties.cursorPosition = this.elements.textBlock.selectionStart
        })

        this._generateKeyboard()
        this._controlRealKeyboard()
    }

    _generateKeyboard() {
        this.elements.keyboard = document.createElement('div')
        this.elements.keyboard.classList.add('keyboard', 'keyboard--hidden')
        this._fillKeyboard()
        document.body.append(this.elements.keyboard)
    }

    _fillKeyboard() {
        const keyboardKeys = document.createDocumentFragment()

        this.elements.keysConfig.forEach((rowConfig) => {
            const row = this._createRow(rowConfig)
            keyboardKeys.append(row)
        })

        this.elements.keyboard.innerHTML = ''
        this.elements.keyboard.append(keyboardKeys)
    }

    _createRow(rowConfig) {
        const row = document.createElement('div')
        row.classList.add('row')

        rowConfig.forEach((keyConfig) => {
            const key = this._createKey(keyConfig)
            row.append(key)
        })

        return row
    }

    _createKey(keyConfig) {
        if (keyConfig.event === 'touch-bar') {
            return this._createTouchBar()
        }

        const key = document.createElement('div')
        key.classList.add(...this._getKeyClasses(keyConfig))
        key.textContent = keyConfig[this.properties.lang][this._getType()]

        key.addEventListener('click', () => {
            this._setKeyEvent(keyConfig)
            this._setKeyAudio(keyConfig)
        })

        return key
    }

    _createTouchBar() {
        const voiceKeyConfig = {
            code: null,
            event: 'voice',
        }

        const microKeyConfig = {
            code: null,
            event: 'micro',
        }

        const touchBar = document.createElement('div')
        touchBar.classList.add('touch-bar')

        const voiceKey = document.createElement('div')
        const microKey = document.createElement('div')

        voiceKey.classList.add('keyboard__key', 'voice')
        microKey.classList.add('keyboard__key', 'micro')

        if (this.properties.audio === false) voiceKey.classList.add('active')
        if (this.properties.micro === false) microKey.classList.add('active')

        voiceKey.addEventListener('click', () => {
            this._setKeyEvent(voiceKeyConfig)
            this._setKeyAudio(voiceKeyConfig)
        })

        microKey.addEventListener('click', () => {
            this._setKeyEvent(microKeyConfig)
            this._setKeyAudio(microKeyConfig)
            this._setSpeechRecognition()
        })

        touchBar.append(voiceKey)
        touchBar.append(microKey)
        return touchBar
    }

    _getKeyClasses(keyConfig) {
        const classes = ['keyboard__key']

        keyConfig.classes?.forEach((keyClass) => {
            classes.push(keyClass)
        })

        if (
            (keyConfig.code === '20' && this.properties.capsLock) ||
            (keyConfig.code === '16' && this.properties.shift)
        ) {
            classes.push('active')
        }

        this.elements.activeKeys.forEach((activeKey) => {
            if (activeKey.code === keyConfig.code) {
                if (
                    activeKey.eventLocation === undefined ||
                    activeKey.eventLocation === keyConfig.eventLocation
                ) {
                    classes.push('pressed')
                }
            }
        })

        return classes
    }

    _getType() {
        if (this.properties.capsLock === true && this.properties.shift === true) return 'caps&shift'
        else if (this.properties.capsLock === true) return 'caps'
        else if (this.properties.shift === true) return 'shift'
        else return 'default'
    }

    _setKeyEvent(keyConfig) {
        switch (keyConfig.event) {
            case 'delete':
                if (this._isTextRange()) {
                    this._setText('')
                } else {
                    if (this.properties.cursorPosition > 0) {
                        this.properties.value =
                            this.properties.value.slice(0, this.properties.cursorPosition - 1) +
                            this.properties.value.slice(this.properties.cursorPosition)

                        this.elements.textBlock.value = this.properties.value
                        this._setCursorPosition(-1)
                    }
                }
                break
            case 'tab':
                this._setText('    ')
                break
            case 'caps':
                this.properties.capsLock = !this.properties.capsLock
                this._fillKeyboard()
                break
            case 'enter':
                this._setText('\n')
                break
            case 'shift':
                this.properties.shift = !this.properties.shift
                this._fillKeyboard()
                break
            case 'control':
                break
            case 'alt':
                break
            case 'close':
                this.elements.textBlock.blur()
                this.elements.keyboard.classList.add('keyboard--hidden')
                break
            case 'lang':
                this.properties.lang = this.properties.lang === 'en' ? 'ru' : 'en'
                this._fillKeyboard()
                break
            case 'space':
                this._setText(' ')
                break
            case 'arrow-left':
                this._setCursorPosition(-1)
                break
            case 'arrow-right':
                this._setCursorPosition(1)
                break
            case 'voice':
                this.properties.audio = !this.properties.audio
                this._fillKeyboard()
                break
            case 'micro':
                this.properties.micro = !this.properties.micro
                this._fillKeyboard()
                break
            default:
                this._setText(keyConfig[this.properties.lang][this._getType()])
        }

        if (keyConfig.event !== 'close') {
            this.elements.textBlock.focus()
        }
    }

    _setText(text) {
        this.elements.textBlock.setRangeText(
            text,
            this.elements.textBlock.selectionStart,
            this.elements.textBlock.selectionEnd,
            'end'
        )
        this.properties.value = this.elements.textBlock.value
        this.properties.cursorPosition = this.elements.textBlock.selectionStart
    }

    _isTextRange() {
        return this.elements.textBlock.selectionStart !== this.elements.textBlock.selectionEnd
    }

    _setCursorPosition(mixing) {
        if (mixing === 1) {
            if (this.properties.cursorPosition < this.elements.textBlock.value.length) {
                this.properties.cursorPosition++
            }
        } else {
            if (this.properties.cursorPosition > 0) {
                this.properties.cursorPosition--
            }
        }

        this.elements.textBlock.selectionStart = this.properties.cursorPosition
        this.elements.textBlock.selectionEnd = this.properties.cursorPosition
    }

    _controlRealKeyboard() {
        this.elements.textBlock.addEventListener('keydown', (event) => {
            event.preventDefault()

            this.elements.keysConfig.forEach((rowConfig) => {
                rowConfig.forEach((keyConfig) => {
                    if (keyConfig.code == event.which) {
                        if (
                            keyConfig.eventLocation === undefined ||
                            event.location == keyConfig.eventLocation
                        ) {
                            this._setKeyEvent(keyConfig)
                            this._toggleActiveKeys(keyConfig)
                            this._setKeyAudio(keyConfig)
                        }
                    }
                })
            })
        })
    }

    _toggleActiveKeys(keyConfig) {
        this.elements.activeKeys.push(keyConfig)
        this._fillKeyboard()

        setTimeout(() => {
            this.elements.activeKeys.shift()
            this._fillKeyboard()
        }, 90)
    }

    _setKeyAudio(keyConfig) {
        if (this.properties.audio === false) return

        let sound

        switch (keyConfig.code) {
            case '49':
                if (this.properties.lang === 'en') {
                    sound = new Audio('sounds/1.mp3')
                } else {
                    sound = new Audio('sounds/kick.wav')
                }
                sound.play()
                break
            case '50':
                if (this.properties.lang === 'en') {
                    sound = new Audio('sounds/2.mp3')
                } else {
                    sound = new Audio('sounds/kick.wav')
                }
                sound.play()
                break
            case '51':
                if (this.properties.lang === 'en') {
                    sound = new Audio('sounds/3.mp3')
                } else {
                    sound = new Audio('sounds/kick.wav')
                }
                sound.play()
                break
            case '52':
                if (this.properties.lang === 'en') {
                    sound = new Audio('sounds/4.mp3')
                } else {
                    sound = new Audio('sounds/kick.wav')
                }
                sound.play()
                break
            case '53':
                if (this.properties.lang === 'en') {
                    sound = new Audio('sounds/5.mp3')
                } else {
                    sound = new Audio('sounds/kick.wav')
                }
                sound.play()
                break
            case '54':
                if (this.properties.lang === 'en') {
                    sound = new Audio('sounds/6.mp3')
                } else {
                    sound = new Audio('sounds/kick.wav')
                }
                sound.play()
                break
            case '55':
                if (this.properties.lang === 'en') {
                    sound = new Audio('sounds/7.mp3')
                } else {
                    sound = new Audio('sounds/kick.wav')
                }
                sound.play()
                break
            case '56':
                if (this.properties.lang === 'en') {
                    sound = new Audio('sounds/8.mp3')
                } else {
                    sound = new Audio('sounds/kick.wav')
                }
                sound.play()
                break
            case '57':
                if (this.properties.lang === 'en') {
                    sound = new Audio('sounds/9.mp3')
                } else {
                    sound = new Audio('sounds/kick.wav')
                }
                sound.play()
                break
            case '48':
                if (this.properties.lang === 'en') {
                    sound = new Audio('sounds/10.mp3')
                } else {
                    sound = new Audio('sounds/kick.wav')
                }
                sound.play()
                break
            case '189':
                if (this.properties.lang === 'en') {
                    sound = new Audio('sounds/11.mp3')
                } else {
                    sound = new Audio('sounds/kick.wav')
                }
                sound.play()
                break
            case '187':
                if (this.properties.lang === 'en') {
                    sound = new Audio('sounds/12.mp3')
                } else {
                    sound = new Audio('sounds/kick.wav')
                }
                sound.play()
                break
            case '8':
                sound = new Audio('sounds/hihat.wav')
                sound.play()
                break
            case '20':
                sound = new Audio('sounds/ride.wav')
                sound.play()
                break
            case '13':
                sound = new Audio('sounds/tom.wav')
                sound.play()
                break
            case '16':
                sound = new Audio('sounds/openhat.wav')
                sound.play()
                break
            default:
                if (this.properties.lang === 'en') {
                    sound = new Audio('sounds/boom.wav')
                } else {
                    sound = new Audio('sounds/kick.wav')
                }
                sound.play()
        }
    }

    _setSpeechRecognition() {
        if (this.properties.micro === false) return

        window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        const recognition = new SpeechRecognition()
        recognition.interimResults = true
        recognition.lang = this.properties.lang === 'en' ? 'en-US' : 'ru-RU'

        recognition.addEventListener('result', (event) => {
            const transcript = Array.from(event.results)
                .map((result) => result[0])
                .map((result) => result.transcript)
                .join('')

            if (this.properties.micro === false) {
                recognition.stop()
            }

            if (event.results[0].isFinal) {
                this.properties.value += transcript
                this.elements.textBlock.value = this.properties.value
                this.properties.cursorPosition = this.elements.textBlock.selectionStart
            }
        })

        recognition.addEventListener('end', () => {
            recognition.lang = this.properties.lang === 'en' ? 'en-US' : 'ru-RU'
            if (this.properties.micro) recognition.start()
        })

        recognition.start()
    }
}

const getKeysConfig = async () => {
    const url = 'keyboard.json'
    const res = await fetch(url)
    return await res.json()
}

window.addEventListener('DOMContentLoaded', async () => {
    const textBlock = document.querySelector('.use-keyboard-input')
    const keysConfig = await getKeysConfig()
    const keyboard = new Keyboard(textBlock, keysConfig)
})
