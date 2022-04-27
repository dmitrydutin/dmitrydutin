import './Footer.scss';

export default class Footer {
    render() {
        const footer = document.createElement('footer');
        const container = document.createElement('div');
        const footerInner = document.createElement('div');
        const authorContent = this.#createSiteInfo();
        const courseContent = this.#createCourseInfo();

        footer.classList.add('footer');
        container.classList.add('container');
        footerInner.classList.add('footer__inner');

        footerInner.append(authorContent);
        footerInner.append(courseContent);
        container.append(footerInner);
        footer.append(container);

        return footer;
    }

    #createSiteInfo() {
        const siteInfo = document.createElement('p');
        const siteCreationYear = document.createElement('span');
        const siteAuthor = document.createElement('a');

        siteInfo.classList.add('footer__site-info');
        siteCreationYear.classList.add('footer__site-info__creation-year');
        siteAuthor.classList.add('footer__site-info__author');

        siteCreationYear.textContent = '© 2020';
        siteAuthor.textContent = 'Dmitry Dutin';

        siteAuthor.href = 'https://github.com/dmitrydutin';
        siteAuthor.target = '_blank';

        siteInfo.append(siteCreationYear);
        siteInfo.append(siteAuthor);

        return siteInfo;
    }

    #createCourseInfo() {
        const courseInfo = document.createElement('a');
        courseInfo.classList.add('footer__course-info');

        courseInfo.href = 'https://rs.school/js/';
        courseInfo.target = '_blank';
        courseInfo.setAttribute('aria-label', 'Rolling scopes school');

        return courseInfo;
    }
}
