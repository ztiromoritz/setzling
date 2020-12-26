import { Connection } from "../../store/connectionHandler";
import { Ref, ref } from 'vue';
import { Player } from "setzling-common";

export function useCurrentPlayer(connection: Connection): Ref<Player | undefined> {
    const clientId = connection.getLocalState().clientId
    const me = connection.getGameState().players.find((player) => (player.clientId === clientId));
    const player = ref(me);
    PubSub.subscribe("gameState.players", () => {
        player.value = connection.getGameState().players.find((player) => (player.clientId === clientId));
    })
    return player;
}