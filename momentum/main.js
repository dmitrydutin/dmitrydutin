class Time {
    constructor() {
        this.timeBlock = document.getElementById('time')
        this.dateBlock = document.getElementById('date')
        this.dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        this.monthsName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    }

    addZero(number) {
        return (parseInt(number, 10) < 10 ? '0' : '') + number
    }

    showTime() {
        const today = new Date(),
            numberDayOfWeek = today.getDay(),
            date = today.getDate(),
            month = today.getMonth(),
            hours = today.getHours(),
            minutes = today.getMinutes(),
            seconds = today.getSeconds()

        this.timeBlock.innerHTML = `${hours}<span>:</span>${this.addZero(minutes)}<span>:</span>${this.addZero(seconds)}`
        this.dateBlock.innerHTML = `${this.dayName[numberDayOfWeek]}, ${date} ${this.monthsName[month]}`

        setTimeout(this.showTime.bind(this), 1000)
    }

    checkHours(callback) {
        const today = new Date(),
            minutes = today.getMinutes(),
            seconds = today.getSeconds()

        if (minutes === 0 && seconds === 0) {
            callback()
        }

        setTimeout(() => {
            this.checkHours(callback)
        }, 1000)
    }
}

class BackgroundImage {
    constructor() {
        this.body = document.body
        this.baseUrl = 'assets/images/'
        this.greeting = document.getElementById('greeting')
        this.images = ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg', '09.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg']
        this.backgroundImages = []
        this.backgroundImageIndex = 0
        this.backgroundBtn = document.querySelector('.background__btn')
        this.backgroundBtn.addEventListener('click', this.changeBg.bind(this))

        this.createImagesArray()
    }

    randomInt(max) {
        return Math.floor(Math.random() * max)
    }

    createImagesArray() {
        const images = this.images
        let src = []

        images.sort(() => Math.random() - 0.5)
        src = images.slice(0, 6).map((item) => 'night/' + item)
        this.backgroundImages = this.backgroundImages.concat(src)

        images.sort(() => Math.random() - 0.5)
        src = images.slice(0, 6).map((item) => 'morning/' + item)
        this.backgroundImages = this.backgroundImages.concat(src)

        images.sort(() => Math.random() - 0.5)
        src = images.slice(0, 6).map((item) => 'day/' + item)
        this.backgroundImages = this.backgroundImages.concat(src)

        images.sort(() => Math.random() - 0.5)
        src = images.slice(0, 6).map((item) => 'evening/' + item)
        this.backgroundImages = this.backgroundImages.concat(src)
    }

    viewBgImage(src) {
        this.backgroundBtn.setAttribute('disabled', '')
        const img = document.createElement('img')
        img.src = src

        img.onload = () => {
            this.body.style.backgroundImage = `url(${src})`

            setTimeout(() => {
                this.backgroundBtn.removeAttribute('disabled')
            }, 1000)
        }
    }

    setBgGreet() {
        const today = new Date()
        const hours = today.getHours()
        let greetingText = ''

        if (hours >= 6 && hours < 12) {
            greetingText = 'Good Morning:'
        } else if (hours >= 12 && hours < 18) {
            greetingText = 'Good Afternoon:'
        } else if (hours >= 18 && hours < 24) {
            greetingText = 'Good Evening:'
        } else {
            greetingText = 'Good Night:'
        }

        this.backgroundImageIndex = hours
        this.viewBgImage(this.baseUrl + this.backgroundImages[hours])
        this.greeting.textContent = greetingText
    }

    changeBg() {
        if (this.backgroundImageIndex === 23) {
            this.backgroundImageIndex = 0
        } else {
            this.backgroundImageIndex += 1
        }

        const index = this.backgroundImageIndex
        this.viewBgImage(this.baseUrl + this.backgroundImages[index])
    }
}

class Name {
    constructor() {
        this.name = document.getElementById('name')
        this.name.addEventListener('focus', this.focusName.bind(this))
        this.name.addEventListener('keypress', this.setName.bind(this))
        this.name.addEventListener('blur', this.blurName.bind(this))
    }

    getName() {
        if (localStorage.getItem('name') === null) {
            this.name.textContent = '[Enter Name]'
        } else {
            this.name.textContent = localStorage.getItem('name')
        }
    }

    focusName(event) {
        localStorage.setItem('prevName', event.target.textContent)
        this.name.textContent = ''
    }

    setName(event) {
        if (event.which === 13 || event.keyCode === 13) {
            this.name.blur()
        } else {
            localStorage.setItem('name', event.target.textContent)
        }
    }

    blurName(event) {
        if (event.target.textContent !== '') {
            localStorage.setItem('name', event.target.textContent)
        } else {
            const prevName = localStorage.getItem('prevName')
            localStorage.setItem('name', prevName)
            this.name.innerHTML = prevName
        }
    }
}

class Target {
    constructor() {
        this.target = document.getElementById('target')
        this.target.addEventListener('focus', this.focusTarget.bind(this))
        this.target.addEventListener('keypress', this.setTarget.bind(this))
        this.target.addEventListener('blur', this.blurTarget.bind(this))
    }

    getTarget() {
        if (localStorage.getItem('target') === null) {
            this.target.textContent = '[Enter Focus]'
        } else {
            this.target.textContent = localStorage.getItem('target')
        }
    }

    focusTarget(event) {
        localStorage.setItem('prevTarget', event.target.textContent)
        this.target.textContent = ''
    }

    setTarget(event) {
        if (event.which === 13 || event.keyCode === 13) {
            this.target.blur()
        } else {
            localStorage.setItem('target', event.target.textContent)
        }
    }

    blurTarget(event) {
        if (event.target.textContent !== '') {
            localStorage.setItem('target', event.target.textContent)
        } else {
            const prevTarget = localStorage.getItem('prevTarget')
            localStorage.setItem('target', prevTarget)
            this.target.innerHTML = prevTarget
        }
    }
}

class Weather {
    constructor() {
        this.weatherIcon = document.querySelector('.weather-icon')
        this.temperature = document.querySelector('.temperature')
        this.humidity = document.querySelector('.humidity')
        this.windSpeed = document.querySelector('.wind-speed')
        this.city = document.querySelector('.city')
        this.city.addEventListener('focus', this.focusCity.bind(this))
        this.city.addEventListener('keypress', this.setCity.bind(this))
        this.city.addEventListener('blur', this.blurCity.bind(this))
    }

    async getWeather() {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${this.city.textContent}&lang=en&appid=96474cf89f928dfb598c7c674ae16720&units=metric`
        try {
            const res = await fetch(url)
            const data = await res.json()

            this.weatherIcon.className = 'weather-icon owf';
            this.weatherIcon.classList.add(`owf-${data.weather[0].id}`)
            this.temperature.textContent = `${data.main.temp}°C`
            this.humidity.textContent = `${data.main.humidity}%`
            this.windSpeed.textContent = `${data.wind.speed}m/s`
        } catch {
            this.temperature.textContent = ''
            this.humidity.textContent = 'Wrong city name'
            this.windSpeed.textContent = ''
        }
    }

    getCity() {
        if (localStorage.getItem('city') === null) {
            this.city.textContent = 'Select city'
        } else {
            this.city.textContent = localStorage.getItem('city')
        }
    }

    focusCity(event) {
        localStorage.setItem('prevCity', event.target.textContent)
        this.city.textContent = ''
    }

    setCity(event) {
        if (event.which === 13 || event.keyCode === 13) {
            this.city.blur()
        } else {
            localStorage.setItem('city', event.target.textContent)
        }
    }

    blurCity(event) {
        if (event.target.textContent !== '') {
            localStorage.setItem('city', event.target.textContent)
            this.getWeather()
        } else {
            const prevCity = localStorage.getItem('prevCity')
            localStorage.setItem('city', prevCity)
            this.city.innerHTML = prevCity
        }
    }
}

class Quote {
    constructor() {
        this.url = `https://api.adviceslip.com/advice`
        this.quoteText = document.querySelector('.quote__text')
        this.quoteBtn = document.querySelector('.quote__btn')
        this.quoteBtn.addEventListener('click', this.getQuote.bind(this))
    }

    async getQuote() {
        this.quoteBtn.setAttribute('disabled', '')

        const res = await fetch(this.url)
        const data = await res.json()
        this.quoteText.textContent = data.slip.advice

        setTimeout(() => {
            this.quoteBtn.removeAttribute('disabled')
        }, 1000)
    }
}

// Run
const backgroundImage = new BackgroundImage()
backgroundImage.setBgGreet()

const time = new Time()
time.showTime()
time.checkHours(() => {
    backgroundImage.setBgGreet()
})

const name = new Name()
name.getName()

const target = new Target()
target.getTarget()

const weather = new Weather()
weather.getCity()
document.addEventListener('DOMContentLoaded', () => {
    weather.getWeather()
})

const quote = new Quote()
document.addEventListener('DOMContentLoaded', () => {
    quote.getQuote()
})
