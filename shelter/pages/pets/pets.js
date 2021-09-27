class Menu {
    constructor() {
        this.body = document.body
        this.headerInner = document.querySelector('.header__inner')
        this.headerMenu = document.querySelector('.header__menu')
        this.headerBurgerMenu = document.querySelector('.header__burger-menu')
        this.headerBlackout = document.querySelector('.header__blackout')
    }

    addListenersForMenu() {
        this.headerBurgerMenu.addEventListener('click', this.toggleDroppedMenu.bind(this))
        this.headerBlackout.addEventListener('click', this.toggleDroppedMenu.bind(this))
        window.addEventListener('resize', (event) => {
            if (event.target.innerWidth > 767) this.closeDroppedMenu()
        })
    }

    toggleDroppedMenu() {
        this.headerInner.classList.toggle('active')
        this.headerMenu.classList.toggle('active')
        this.headerBurgerMenu.classList.toggle('active')
        this.headerBlackout.classList.toggle('active')
        this.body.classList.toggle('scroll')
    }

    closeDroppedMenu() {
        this.headerInner.classList.remove('active')
        this.headerMenu.classList.remove('active')
        this.headerBurgerMenu.classList.remove('active')
        this.headerBlackout.classList.remove('active')
        this.body.classList.remove('scroll')
    }
}

class Links extends Menu {
    constructor() {
        super()
        this.body = document.body
        this.currentHeaderLinks = document.querySelectorAll('a[href$="pets.html"]')
        this.disabledHeaderLinks = document.querySelectorAll('a[href^="#"]')
        this.addListenerForCurrentLinks()
        this.addListenerForDisabledLinks()
    }

    addListenerForCurrentLinks() {
        this.currentHeaderLinks.forEach((link) => {
            link.addEventListener('click', (event) => {
                event.preventDefault()

                this.body.scrollIntoView({
                    block: 'start',
                    behavior: 'smooth',
                })

                super.closeDroppedMenu()
            })
        })
    }

    addListenerForDisabledLinks() {
        this.disabledHeaderLinks.forEach((link) => {
            link.addEventListener('click', (event) => {
                event.preventDefault()
            })
        })
    }
}

class Popup {
    constructor(pets) {
        this.pets = pets
        this.petsPopup = document.querySelector('.pets__popup')
        this.petsClose = document.querySelector('.pets__close')
        this.petsBlackout = document.querySelector('.pets__blackout')
    }

    addListenersForPopup() {
        this.petsClose.addEventListener('click', () => {
            this.closePopup()
        })

        this.petsBlackout.addEventListener('click', () => {
            this.closePopup()
        })

        this.petsBlackout.addEventListener('mouseover', () => {
            this.petsClose.classList.add('active')
        })

        this.petsBlackout.addEventListener('mouseout', () => {
            this.petsClose.classList.remove('active')
        })
    }

    fillPopup(index) {
        const popupImg = this.petsPopup.querySelector('.pets__popup__img img')
        const popupName = this.petsPopup.querySelector('.pets__popup__name')
        const popupType = this.petsPopup.querySelector('.pets__popup__type')
        const popupDescription = this.petsPopup.querySelector('.pets__popup__description')

        popupImg.src = this.pets[index].img
        popupImg.alt = this.pets[index].name

        popupName.textContent = this.pets[index].name
        popupType.textContent = `${this.pets[index].type} - ${this.pets[index].breed}`
        popupDescription.textContent = this.pets[index].description

        const age = document.getElementById('age')
        const inoculations = document.getElementById('inoculations')
        const diseases = document.getElementById('diseases')
        const parasites = document.getElementById('parasites')

        age.textContent = this.pets[index].age
        inoculations.textContent = this.pets[index].inoculations.join(', ')
        diseases.textContent = this.pets[index].diseases.join(', ')
        parasites.textContent = this.pets[index].parasites.join(', ')
    }

    openPopup(index) {
        this.fillPopup(index)
        this.petsPopup.classList.add('active')
        this.petsBlackout.classList.add('active')
        this.body.classList.add('scroll')
    }

    closePopup() {
        this.petsPopup.classList.remove('active')
        this.petsBlackout.classList.remove('active')
        this.body.classList.remove('scroll')
    }
}

class Slider extends Popup {
    constructor(pets) {
        super(pets)
        this.pets = pets
        this.petsList = []
        this.body = document.body
        this.firstBtn = document.querySelector('#first')
        this.prevBtn = document.querySelector('#prev')
        this.currentBtn = document.querySelector('#current')
        this.nextBtn = document.querySelector('#next')
        this.lastBtn = document.querySelector('#last')
        this.track = document.querySelector('.friend__track')
        this.sliderScroll = 0
        this.cards = this.getCardsNumber()

        this.nextBtn.addEventListener('click', () => {
            this.scrollTrack('right', this.cards)
        })

        this.prevBtn.addEventListener('click', () => {
            this.scrollTrack('left', this.cards)
        })

        this.firstBtn.addEventListener('click', () => {
            this.scrollTrack('first', this.cards)
        })

        this.lastBtn.addEventListener('click', () => {
            this.scrollTrack('last', this.cards)
        })

        window.addEventListener('resize', (event) => {
            let newCards = this.getCardsNumber()

            if (newCards !== this.cards) {
                this.removeCardsBlock()
                this.generatePetsList(getCardsNumber())
                this.generateCardsBlock(getCardsNumber())
                this.cards = newCards
            }
        })
    }

    getCardsNumber() {
        let cards = 3
        if (document.body.clientWidth >= 1280) cards = 8
        else if (document.body.clientWidth >= 768) cards = 6
        return cards
    }

    createCard(index) {
        const card = document.createElement('div')
        const cardHeader = document.createElement('div')
        const cardHeaderImg = document.createElement('img')
        const cardBody = document.createElement('div')
        const cardBodyTitle = document.createElement('h4')
        const cardButton = document.createElement('button')

        card.className = 'friends__card'
        cardHeader.className = 'friends__card__header'
        cardBody.className = 'friends__card__body'
        cardBodyTitle.className = 'friends__card__title'
        cardButton.className = 'friends__card__button'

        cardBodyTitle.textContent = this.pets[index].name
        cardButton.textContent = 'Learn more'

        cardHeaderImg.src = this.pets[index].img
        cardHeaderImg.alt = this.pets[index].name

        cardHeader.appendChild(cardHeaderImg)
        card.appendChild(cardHeader)
        cardBody.appendChild(cardBodyTitle)
        cardBody.appendChild(cardButton)
        card.appendChild(cardBody)

        card.setAttribute('data-id', index)

        card.addEventListener('click', (event) => {
            super.openPopup(event.currentTarget.getAttribute('data-id'))
            super.addListenersForPopup()
        })

        return card
    }

    generatePetsList(cards = 8) {
        const slides = 48 / cards
        const cardsNumbers = [0, 1, 2, 3, 4, 5, 6, 7]
        const arraysIndex = []
        const result = []
        let incompleteArrays = []

        for (let i = 0; i < slides; i++) {
            arraysIndex.push(i)
            incompleteArrays.push(i)
            result.push([])
        }

        for (let i = 0; i < cardsNumbers.length; i++) {
            let currentArraysIndex = incompleteArrays.sort(() => Math.random() - 0.5).slice(0, 6)

            if (currentArraysIndex.length < 6) {
                incompleteArrays = [...arraysIndex]
                const length = 6 - currentArraysIndex.length
                const newIndexes = incompleteArrays
                    .filter((item) => !currentArraysIndex.includes(item))
                    .sort(() => Math.random() - 0.5)
                    .slice(0, length)
                currentArraysIndex = currentArraysIndex.concat(newIndexes)
                incompleteArrays = incompleteArrays.filter((item) => !newIndexes.includes(item))
            } else {
                incompleteArrays = incompleteArrays.filter((item) => !currentArraysIndex.includes(item))
            }

            currentArraysIndex.forEach((index) => result[index].push(cardsNumbers[i]))
        }

        result.forEach((array) => {
            array = array.sort(() => Math.random() - 0.5)
        })

        this.petsList = result.flat()
    }

    generateCardsBlock(cards = 8) {
        const slides = 48 / cards
        for (let i = 0, k = 0; i < slides; i++) {
            const cardsBlock = document.createElement('div')
            cardsBlock.classList.add('friends__slider__block')

            for (let j = 0; j < cards; j++, k++) {
                const card = this.createCard(this.petsList[k])
                cardsBlock.appendChild(card)
            }

            this.track.append(cardsBlock)
        }
    }

    scrollTrack(side, cards = 8) {
        let scroll = 1200
        if (cards === 6) scroll = 580
        else if (cards === 3) scroll = 270
        const slides = 48 / cards

        switch (side) {
            case 'left':
                this.sliderScroll += scroll
                this.lastBtn.removeAttribute('disabled')
                this.nextBtn.removeAttribute('disabled')

                if (this.sliderScroll === 0) {
                    this.firstBtn.setAttribute('disabled', '')
                    this.prevBtn.setAttribute('disabled', '')
                }
                break
            case 'right':
                this.sliderScroll -= scroll
                this.firstBtn.removeAttribute('disabled')
                this.prevBtn.removeAttribute('disabled')

                if (this.sliderScroll === -scroll * (slides - 1)) {
                    this.lastBtn.setAttribute('disabled', '')
                    this.nextBtn.setAttribute('disabled', '')
                }
                break
            case 'first':
                this.sliderScroll = 0
                this.lastBtn.removeAttribute('disabled')
                this.nextBtn.removeAttribute('disabled')
                this.firstBtn.setAttribute('disabled', '')
                this.prevBtn.setAttribute('disabled', '')
                break
            case 'last':
                this.sliderScroll = -scroll * (slides - 1)
                this.firstBtn.removeAttribute('disabled')
                this.prevBtn.removeAttribute('disabled')
                this.lastBtn.setAttribute('disabled', '')
                this.nextBtn.setAttribute('disabled', '')
                break
        }

        this.currentBtn.textContent = Math.abs(this.sliderScroll / scroll) + 1
        this.track.style.transform = `translateX(${this.sliderScroll}px)`
    }

    removeCardsBlock() {
        const slides = 48 / this.cards

        for (let i = 0; i < slides; i++) {
            this.track.removeChild(this.track.lastChild)
        }

        this.sliderScroll = 0
        this.lastBtn.removeAttribute('disabled')
        this.nextBtn.removeAttribute('disabled')
        this.firstBtn.setAttribute('disabled', '')
        this.prevBtn.setAttribute('disabled', '')

        this.currentBtn.textContent = 1
        this.track.style.transform = `translateX(0px)`
    }
}

// Run

const getCardsNumber = () => {
    let cards = 3
    if (document.body.clientWidth >= 1280) cards = 8
    else if (document.body.clientWidth >= 768) cards = 6
    return cards
}

const main = (pets) => {
    const menu = new Menu()
    menu.addListenersForMenu()

    const links = new Links()

    const slider = new Slider(pets)
    slider.generatePetsList(getCardsNumber())
    slider.generateCardsBlock(getCardsNumber())
}

const getPets = async () => {
    const url = '../../common/pets.json'
    const res = await fetch(url)
    const pets = await res.json()

    main(pets)
}

document.addEventListener('DOMContentLoaded', getPets);
