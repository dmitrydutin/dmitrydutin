import './SwitchMode.scss';
import AppDOM from '../../app/app-dom';
import Store from '../Store/store';

export default class SwitchMode {
    render() {
        const switchMode = document.createElement('div');

        switchMode.classList.add('switch-mode');
        if (Store.gameMode) switchMode.classList.add('active');

        switchMode.setAttribute('aria-label', 'Режим игры');
        switchMode.setAttribute('role', 'button');
        switchMode.setAttribute('tabindex', '0');

        switchMode.addEventListener('click', () => {
            Store.gameMode = !Store.gameMode;
            AppDOM.reRender();
        });

        switchMode.addEventListener('keypress', (event) => {
            if (['Space', 'Enter'].includes(event.code)) {
                Store.gameMode = !Store.gameMode;
                AppDOM.reRender();
            }
        });

        return switchMode;
    }
}
