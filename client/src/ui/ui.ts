// @ts-ignore
import html from './ui.html';
import './inventory';

window.customElements.whenDefined('setzling-ui').then(() => {
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


