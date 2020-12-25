// @ts-ignore
import html from './inventory.html';

function replaceSlot(element: HTMLElement, slotContent: string) {
    const slot = element.querySelector('slot');
    if (slot) {
        const template = document.createElement('template');
        template.innerHTML = slotContent;
        const children = template.content.children;
        for (let i = 0; i < children.length; i++) {
            const child = children.item(i);
            if(child){
                slot.parentElement?.insertBefore(child, slot);
            }
        }
        slot.parentElement?.removeChild(slot);
    }
}

customElements.define('setzling-inventory', class extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        const slotContent = this.innerHTML;
        this.innerHTML = html;
        document.addEventListener('keydown', (e)=>{
            if(e.code == 'KeyI'){
                this.classList.toggle('hide');
            }
        })
        replaceSlot(this,slotContent);
    }
    
});