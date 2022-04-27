import './Footer.scss';
import Store from '../Store/store';

export default class Footer {
    #footer = null;
    #companyName = null;
    #authorsInfoTitle = null;
    #firstAuthor = null;
    #secondAuthor = null;
    #thirdAuthor = null;
    #gratitudeInfoTitle = null;
    #gratitudeInfoMentor = null;
    #gratitudeInfoSchool = null;
    #copyright = null;

    render() {
        this.#footer = document.createElement('footer');
        const container = document.createElement('div');
        const footerInner = document.createElement('div');
        const footerTop = this.#createFooterTop();
        const footerBottom = this.#createFooterBottom();

        this.#footer.classList.add('footer');
        container.classList.add('container');
        footerInner.classList.add('footer__inner');

        this.#setThemeMode();
        Store.subscribeTheme(this.#setThemeMode.bind(this));

        footerInner.append(footerTop);
        footerInner.append(footerBottom);
        container.append(footerInner);
        this.#footer.append(container);

        return this.#footer;
    }

    #setThemeMode() {
        if (Store.theme === 'light') {
            this.#footer.classList.add('light');
            this.#companyName.classList.add('light');
            this.#authorsInfoTitle.classList.add('light');
            this.#firstAuthor.classList.add('light');
            this.#secondAuthor.classList.add('light');
            this.#thirdAuthor.classList.add('light');
            this.#gratitudeInfoTitle.classList.add('light');
            this.#gratitudeInfoMentor.classList.add('light');
            this.#gratitudeInfoSchool.classList.add('light');
            this.#copyright.classList.add('light');
        } else if (Store.theme === 'dark') {
            this.#footer.classList.remove('light');
            this.#companyName.classList.remove('light');
            this.#authorsInfoTitle.classList.remove('light');
            this.#firstAuthor.classList.remove('light');
            this.#secondAuthor.classList.remove('light');
            this.#thirdAuthor.classList.remove('light');
            this.#gratitudeInfoTitle.classList.remove('light');
            this.#gratitudeInfoMentor.classList.remove('light');
            this.#gratitudeInfoSchool.classList.remove('light');
            this.#copyright.classList.remove('light');
        }
    }

    #createFooterTop() {
        const footerTop = document.createElement('div');
        const footerTopCompany = this.#createFooterTopCompany();
        const footerTopContent = this.#createFooterTopContent();

        footerTop.classList.add('footer__top');

        footerTop.append(footerTopCompany);
        footerTop.append(footerTopContent);

        return footerTop;
    }

    #createFooterTopCompany() {
        const company = document.createElement('div');
        this.#companyName = document.createElement('h2');

        company.classList.add('footer__top__company');
        this.#companyName.classList.add('footer__top__company__name');
        this.#companyName.textContent = 'Covid dashboard';

        company.append(this.#companyName);
        return company;
    }

    #createFooterTopContent() {
        const content = document.createElement('div');
        content.classList.add('footer__top__content');

        const authorsInfo = this.#createAuthorsInfo();
        const gratitudeInfo = this.#createGratitudeInfo();

        content.append(authorsInfo);
        content.append(gratitudeInfo);

        return content;
    }

    #createAuthorsInfo() {
        const authorsInfo = document.createElement('div');
        this.#authorsInfoTitle = document.createElement('h2');
        this.#firstAuthor = document.createElement('a');
        this.#secondAuthor = document.createElement('a');
        this.#thirdAuthor = document.createElement('a');

        authorsInfo.classList.add('footer__top__content__container');
        this.#authorsInfoTitle.classList.add('footer__top__content__title');
        this.#firstAuthor.classList.add('footer__top__content__link');
        this.#secondAuthor.classList.add('footer__top__content__link');
        this.#thirdAuthor.classList.add('footer__top__content__link');

        this.#authorsInfoTitle.textContent = 'Team';
        this.#firstAuthor.textContent = 'Dmitry Dutin';
        this.#secondAuthor.textContent = 'Maxim Rynkov';
        this.#thirdAuthor.textContent = 'Yaraslau Kabernik-Berazouski';

        this.#firstAuthor.href = 'https://github.com/dmitrydutin';
        this.#secondAuthor.href = 'https://github.com/maximzmei';
        this.#thirdAuthor.href = 'https://github.com/asbarn';

        this.#firstAuthor.target = '_blank';
        this.#secondAuthor.target = '_blank';
        this.#thirdAuthor.target = '_blank';

        authorsInfo.append(this.#authorsInfoTitle);
        authorsInfo.append(this.#firstAuthor);
        authorsInfo.append(this.#secondAuthor);
        authorsInfo.append(this.#thirdAuthor);

        return authorsInfo;
    }

    #createGratitudeInfo() {
        const gratitudeInfo = document.createElement('div');
        this.#gratitudeInfoTitle = document.createElement('h2');
        this.#gratitudeInfoMentor = document.createElement('a');
        this.#gratitudeInfoSchool = document.createElement('a');

        gratitudeInfo.classList.add('footer__top__content__container');
        this.#gratitudeInfoTitle.classList.add('footer__top__content__title');
        this.#gratitudeInfoMentor.classList.add('footer__top__content__link');
        this.#gratitudeInfoSchool.classList.add('footer__top__content__link');

        this.#gratitudeInfoTitle.textContent = 'Gratitude';
        this.#gratitudeInfoMentor.textContent = 'Alexander';
        this.#gratitudeInfoSchool.textContent = 'RSS';

        this.#gratitudeInfoMentor.href = 'https://github.com/noway36';
        this.#gratitudeInfoSchool.href = 'https://rs.school/';

        this.#gratitudeInfoMentor.target = '_blank';
        this.#gratitudeInfoSchool.target = '_blank';

        gratitudeInfo.append(this.#gratitudeInfoTitle);
        gratitudeInfo.append(this.#gratitudeInfoMentor);
        gratitudeInfo.append(this.#gratitudeInfoSchool);

        return gratitudeInfo;
    }

    #createFooterBottom() {
        const footerBottom = document.createElement('div');
        this.#copyright = document.createElement('p');
        const courseInfo = document.createElement('a');

        footerBottom.classList.add('footer__bottom');
        this.#copyright.classList.add('footer__bottom__copyright');
        courseInfo.classList.add('footer__bottom__course');

        this.#copyright.textContent = 'Made with ️❤ in Belarus © 2020';

        courseInfo.href = 'https://rs.school/js/';
        courseInfo.target = '_blank';

        footerBottom.append(this.#copyright);
        footerBottom.append(courseInfo);

        return footerBottom;
    }
}
