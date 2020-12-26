import { createApp } from 'vue';
import { Commands } from '../commands/commands';
import { Connection } from '../store/connectionHandler';
import { CustomGame } from '../types/customGame';
import { SetzlingInventory } from './inventory';
import { SetzlingUi } from './ui';

export type UiConfig = {
    connection: Connection,
    commands: Commands
}

export function initializeUi({ connection, commands}: UiConfig) {
    const VueApp = {
        template: `<setzling-ui></setzling-ui>`
    }
    const app = createApp(VueApp);
    app.component('setzling-ui', SetzlingUi);
    app.component('setzling-inventory', SetzlingInventory);
    app.provide('connection', connection);
    app.provide('commands', commands);
    app.mount('#ui');
}