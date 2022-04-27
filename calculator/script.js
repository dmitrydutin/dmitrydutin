class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement, errorTextElement) {
        this.currentOperandTextElement = currentOperandTextElement
        this.previousOperandTextElement = previousOperandTextElement
        this.errorTextElement = errorTextElement
        this.readyToReset = false
        this.clear()
    }

    clear() {
        this.currentOperand = ''
        this.previousOperand = ''
        this.operation = undefined
        this.readyToReset = false
    }

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1)
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return
        this.currentOperand = this.currentOperand.toString() + number.toString()
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return

        if (this.currentOperand !== '' && this.previousOperand !== '') {
            this.compute()
        }

        this.previousOperand = this.currentOperand
        this.currentOperand = ''
        this.operation = operation
    }

    compute() {
        const prev = parseFloat(this.previousOperand)
        const current = parseFloat(this.currentOperand)
        if (isNaN(prev) || isNaN(current)) return

        let computation

        switch (this.operation) {
            case 'addition':
                computation = (prev * 10 + current * 10) / 10
                break
            case 'subtraction':
                computation = (prev * 10 - current * 10) / 10
                break
            case 'multiply':
                computation = ((prev * 10) * (current * 10)) / 100
                break
            case 'divide':
                computation = ((prev * 10) / (current * 10))

                if (computation === Infinity) {
                    this.viewError('You cannot divide by zero')
                    return
                }
                break
            case 'power':
                computation = prev ** current
                break
            default:
                return
        }

        this.readyToReset = true
        this.previousOperand = ''
        this.currentOperand = computation.toString()
        this.operation = undefined
    }

    singleOperation(operation) {
        if (this.currentOperand === '') return

        const current = parseFloat(this.currentOperand)
        if (isNaN(current)) return

        let computation

        switch (operation) {
            case 'inversion':
                computation = -current
                break
            case 'root':
                computation = Math.sqrt(current)

                if (isNaN(computation)) {
                    this.viewError("Can't find a root of a negative number")
                    return
                }
                break
            default:
                return
        }

        this.currentOperand = computation.toString()
    }

    viewError(errorText) {
        this.errorTextElement.textContent = errorText

        setTimeout(() => {
            this.errorTextElement.textContent = ''
        }, 3000)
    }

    getDisplayNumber(number) {
        const integerDigits = parseFloat(number.split('.')[0])
        const decimalDigits = number.split('.')[1]

        let integerDisplay

        if (isNaN(integerDigits)) {
            integerDisplay = ''
        } else {
            integerDisplay = integerDigits.toLocaleString('ru')
        }

        if (decimalDigits === undefined) {
            return integerDisplay
        } else {
            return `${integerDisplay}.${decimalDigits}`
        }
    }

    updateDisplay() {
        this.currentOperandTextElement.textContent = this.getDisplayNumber(this.currentOperand)

        if (this.operation !== undefined) {
            const operationSymbol = operations[this.operation]
            this.previousOperandTextElement.textContent = `${this.previousOperand} ${operationSymbol}`
        } else {
            this.previousOperandTextElement.textContent = ''
        }
    }
}

const numberButtons = document.querySelectorAll('[data-number]')
const operationButtons = document.querySelectorAll('[data-operation]')
const equalsButton = document.querySelector('[data-equals]')
const deleteButton = document.querySelector('[data-delete]')
const allClearButton = document.querySelector('[data-all-clear]')
const previousOperandTextElement = document.querySelector('[data-previous-operand]')
const currentOperandTextElement = document.querySelector('[data-current-operand]')
const singleOperationButtons = document.querySelectorAll('[data-single-operation]')
const errorTextElement = document.querySelector('[data-error]')
const operations = { power: '^', divide: '÷', multiply: '×', subtraction: '-', addition: '+' }

const calculator = new Calculator(
    previousOperandTextElement,
    currentOperandTextElement,
    errorTextElement
)

numberButtons.forEach((button) => {
    button.addEventListener('click', () => {
        if (
            calculator.previousOperand === '' &&
            calculator.currentOperand !== '' &&
            calculator.readyToReset
        ) {
            calculator.currentOperand = ''
            calculator.readyToReset = false
        }

        calculator.appendNumber(button.dataset.number)
        calculator.updateDisplay()
    })
})

operationButtons.forEach((button) => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.dataset.operation)
        calculator.updateDisplay()
    })
})

equalsButton.addEventListener('click', () => {
    calculator.compute()
    calculator.updateDisplay()
})

allClearButton.addEventListener('click', () => {
    calculator.clear()
    calculator.updateDisplay()
})

deleteButton.addEventListener('click', () => {
    calculator.delete()
    calculator.updateDisplay()
})

singleOperationButtons.forEach((button) => {
    button.addEventListener('click', () => {
        calculator.singleOperation(button.dataset.singleOperation)
        calculator.updateDisplay()
    })
})
