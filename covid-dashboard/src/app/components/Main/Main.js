import './Main.scss';
import CovidList from './CovidList/CovidList';
import CovidMap from './CovidMap/CovidMap';
import CovidTable from './CovidTable/CovidTable';
import CovidDiagram from './CovidDiagram/CovidDiagram';
import Store from '../Store/store';

export default class Main {
    #main = null;

    render() {
        this.#main = document.createElement('main');
        const mainInner = document.createElement('div');
        const covidList = new CovidList().render();
        const covidMap = new CovidMap().render();
        const covidTable = new CovidTable().render();
        const covidDiagram = new CovidDiagram().render();

        this.#main.classList.add('main');
        mainInner.classList.add('main__inner');

        this.#setThemeMode();
        Store.subscribeTheme(this.#setThemeMode.bind(this));

        mainInner.append(covidList);
        mainInner.append(covidMap);
        mainInner.append(covidTable);
        mainInner.append(covidDiagram);
        this.#main.append(mainInner);

        return this.#main;
    }

    #setThemeMode() {
        if (Store.theme === 'light') {
            this.#main.classList.add('light');
        } else if (Store.theme === 'dark') {
            this.#main.classList.remove('light');
        }
    }
}
