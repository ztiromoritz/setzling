// @ts-ignore
import html from './inventory.html';
import { defineComponent, inject } from 'vue';
import { Connection } from '../store/connectionHandler';
import { useCurrentPlayer } from './components/currentUser';
import { ensureConnection } from './components/ensureConnection';
import { Player } from 'tone';

export const SetzlingInventory = defineComponent({
    template: html,
    setup() {
        const connection = ensureConnection();
        const player = useCurrentPlayer(connection);
        return {
            player
        };
    }
});