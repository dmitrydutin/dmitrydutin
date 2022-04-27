import 'normalize.css';
import './app.scss';

import AppRouterDOM from './app/app-router-dom';
import Header from './components/Header/Header';
import Categories from './components/Categories/Categories';
import Cards from './components/Cards/Controller';
import Statistics from './components/Statistics/Statistics';
import ErrorPage from './components/ErrorPage/ErrorPage';
import Footer from './components/Footer/Footer';

const App = [
    Header,
    AppRouterDOM.switch(
        AppRouterDOM.route('/', Categories),
        AppRouterDOM.route('/clothes', Cards),
        AppRouterDOM.route('/space', Cards),
        AppRouterDOM.route('/planets', Cards),
        AppRouterDOM.route('/christmas', Cards),
        AppRouterDOM.route('/food', Cards),
        AppRouterDOM.route('/food2', Cards),
        AppRouterDOM.route('/food3', Cards),
        AppRouterDOM.route('/animals', Cards),
        AppRouterDOM.route('/statistics', Statistics),
        AppRouterDOM.route('/difficult-words', Cards),
        AppRouterDOM.route(undefined, ErrorPage)
    ),
    Footer
];

export default App;
