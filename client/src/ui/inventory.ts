// @ts-ignore
import html from './inventory.html';

customElements.define('setzling-inventory', class extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = html;   
    }
});