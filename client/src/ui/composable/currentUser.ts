import { Connection } from "../../store/connectionHandler";
import { Ref, ref } from 'vue';
import { GameState, Player } from "setzling-common";

export function useCurrentPlayer(connection: Connection): Ref<Player | undefined> {
    const clientId = connection.getLocalState().clientId

    const me = connection.getGameState().players[clientId || ''];
    const player = ref(me);
    PubSub.subscribe(`gameState.players.${clientId}`, () => {
        player.value = connection.getGameState().players[clientId || ''];
    })
    return player;
}