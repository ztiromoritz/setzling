// @ts-ignore
import html from './ui.html';

window.customElements.whenDefined('setzling-ui').then(() => {
    console.log("here");
    const setzlingUi = document.createElement('setzling-ui');
    document.getElementById('ui')?.appendChild(setzlingUi);
});

customElements.define('setzling-ui', class extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = html;   
    }
});


