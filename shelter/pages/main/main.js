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
        this.currentHeaderLinks = document.querySelectorAll('a[href$="main.html"]')
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
        this.quantity = 3
        this.body = document.body
        this.next = document.querySelector('#next')
        this.prev = document.querySelector('#prev')
        this.arrows = document.querySelectorAll('.pets__slider__arrow')
        this.track = document.querySelector('.pets__slider__cards__track')

        this.next.addEventListener('click', () => {
            this.addListenerForSlider('right')
        })

        this.prev.addEventListener('click', () => {
            this.addListenerForSlider('left')
        })

        window.addEventListener('resize', (event) => {
            let newQuantity = this.getCurrentQuantity()

            if (newQuantity !== this.quantity) {
                this.removeCards('left', this.quantity)
                this.generateCards('left', newQuantity)
                this.quantity = newQuantity
            }
        })
    }

    getCurrentQuantity() {
        let quantity = 1
        if (document.body.clientWidth >= 1280) quantity = 3
        else if (document.body.clientWidth >= 768) quantity = 2
        return quantity
    }

    addListenerForSlider(side) {
        this.quantity = this.getCurrentQuantity()

        setTimeout(() => {
            this.prepareTrack(side)
        }, 0)

        setTimeout(() => {
            this.generateCards(side, this.quantity)
            this.scrollTrack(side, this.quantity)
        }, 100)

        setTimeout(() => {
            this.finishScroll(side)
            this.removeCards(side, this.quantity)
        }, 400)

        setTimeout(() => {
            this.clearScroll()
        }, 410)
    }

    prepareTrack(side) {
        if (side === 'left') {
            this.track.style.right = '0'
        } else {
            this.track.style.left = '0'
        }

        this.arrows.forEach((arrow) => {
            arrow.setAttribute('disabled', '')
        })
    }

    scrollTrack(side, quantity = 3) {
        let bias = 90
        if (quantity === 2 || quantity === 1) bias = 40

        if (side === 'left') {
            this.track.style.right = `calc(-100% - ${bias}px)`
        } else {
            this.track.style.left = `calc(-100% - ${bias}px)`
        }
    }

    finishScroll(side) {
        if (side === 'left') {
            this.track.style.left = '0'
            this.track.style.right = 'auto'
        } else {
            this.track.style.left = 'auto'
            this.track.style.right = '0'
        }
    }

    clearScroll() {
        this.track.style.left = ''
        this.track.style.right = ''

        this.arrows.forEach((arrow) => {
            arrow.removeAttribute('disabled')
        })
    }

    createCard(index) {
        const card = document.createElement('div')
        const cardHeader = document.createElement('div')
        const cardHeaderImg = document.createElement('img')
        const cardBody = document.createElement('div')
        const cardBodyTitle = document.createElement('h4')
        const cardButton = document.createElement('button')

        card.className = 'pets__slider__card'
        cardHeader.className = 'pets__card__header'
        cardBody.className = 'pets__card__body'
        cardBodyTitle.className = 'pets__card__title'
        cardButton.className = 'pets__card__button'

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

    generateCards(side, quantity = 3) {
        let cardsIndex = [0, 1, 2, 3, 4, 5, 6, 7]

        this.track.childNodes.forEach((card) => {
            cardsIndex = cardsIndex.filter((item) => item != card.dataset.id)
        })

        const currentCardsIndex = cardsIndex.sort(() => Math.random() - 0.5).slice(0, quantity)

        for (let i = 0; i < quantity; i++) {
            const card = this.createCard(currentCardsIndex[i])

            if (side === 'left') {
                this.track.prepend(card)
            } else {
                this.track.append(card)
            }
        }
    }

    removeCards(side, quantity = 3) {
        for (let i = 0; i < quantity; i++) {
            const card = side === 'left' ? this.track.lastChild : this.track.firstChild
            this.track.removeChild(card)
        }
    }
}

// Run

const getCurrentQuantity = () => {
    let quantity = 1
    if (document.body.clientWidth >= 1280) quantity = 3
    else if (document.body.clientWidth >= 768) quantity = 2
    return quantity
}

const main = (pets) => {
    const menu = new Menu()
    menu.addListenersForMenu()

    const links = new Links()

    const slider = new Slider(pets)
    slider.generateCards('left', getCurrentQuantity())
}

const getPets = async () => {
    const url = '../../common/pets.json'
    const res = await fetch(url)
    const pets = await res.json()

    main(pets)
}

document.addEventListener('DOMContentLoaded', getPets);
