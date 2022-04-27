import './Basic.scss';

export default class Basic {
    createScaleButton(component) {
        const scaleButton = document.createElement('button');
        scaleButton.classList.add('scale-button');

        scaleButton.addEventListener('click', () => {
            component.classList.toggle('scale');
            scaleButton.classList.toggle('scale-button--scaled');
        });

        return scaleButton;
    }
}
