class AppDom {
    #Components = null;
    #mounted = null;

    render(Components, mounted) {
        this.#Components = Components;
        this.#mounted = mounted;

        this.#mount();
    }

    reRender() {
        this.#mount();
    }

    #mount() {
        this.#mounted.innerHTML = '';

        this.#Components.forEach((Component) => {
            this.#mounted.append(new Component().render());
        });
    }
}

export default new AppDom();
