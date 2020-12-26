import { createApp } from 'vue';
import { Connection } from '../store/connectionHandler';
import { CustomGame } from '../types/customGame';
import { SetzlingInventory } from './inventory';
import { SetzlingUi } from './ui';


export function initializeUi(connection: Connection){
    const VueApp = {
        template: `<setzling-ui></setzling-ui>`
    }
    const app = createApp(VueApp);
    app.component('setzling-ui', SetzlingUi);
    app.component('setzling-inventory', SetzlingInventory);
    app.provide('connection', connection);
    app.mount('#ui');
}