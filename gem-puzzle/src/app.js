import 'normalize.css';
import './assets/styles/app.scss';

import Header from './components/Header/Header';
import Puzzle from './components/Puzzle/Puzzle';

window.addEventListener('DOMContentLoaded', () => {
    Header.create();

    const puzzle = new Puzzle();
    puzzle.create();
});
