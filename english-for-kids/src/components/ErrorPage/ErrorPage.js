import './ErrorPage.scss';

export default class ErrorPage {
    render() {
        const errorPage = document.createElement('main');
        const container = document.createElement('div');
        const errorPageInner = document.createElement('div');
        const errorText = document.createElement('h1');

        errorPage.classList.add('error-page');
        container.classList.add('container');
        errorPageInner.classList.add('error-page__inner');
        errorText.classList.add('error-page__text');

        errorText.textContent = 'The page you’re looking for can’t be found.';

        errorPageInner.append(errorText);
        container.append(errorPageInner);
        errorPage.append(container);

        return errorPage;
    }
}
