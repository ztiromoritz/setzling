// @ts-ignore
import html from './inventory.html';
import { computed, defineComponent, inject, ref, Ref } from 'vue';
import { Connection } from '../store/connectionHandler';
import { useCurrentPlayer } from './composable/currentUser';
import { ensureConnection } from './composable/ensureConnection';
import { Player } from 'setzling-common';
import { Commands } from '../commands/commands';
import { ensureCommands } from './composable/ensureCommands';


function computeItemList(player: Ref<Player | undefined>) {
    return computed(() => {
        let result = [];
        let selected = player.value?.items.selected;
        for (let i = 0; i < 10; i++) {
            let item = player.value?.items.inventory[i];
            result.push({
                key: `${i + 1}`.slice(-1), // '10' is '0',
                marker: (selected === i) ? '*' : '\xa0',
                label: item?.name || '',
                clazz: (item?.bluprint) ? 'blueprint' : 'instance'
            })
        }
        return result;
    })
}

function initShowHide() {
    const hide = ref(false);
    document.addEventListener('keydown', (e) => {
        if(e.key === 'i'){
            hide.value = !hide.value;
        }
    });
    return hide;  
}



function initItemSelect() {
    const DIGIT = 'Digit';
    const DIGIT_LENGTH = DIGIT.length;
    const commands: Commands = ensureCommands();
    document.addEventListener('keydown', (e) => {
        
        if(e.code.startsWith(DIGIT)){
            const digitValue = e.code.substr(DIGIT_LENGTH);
            const index = (digitValue==='0')?9:parseInt(digitValue)-1;
            console.log("index", index, digitValue);
            commands.selectInventoryItem(index);
        }
    });
}


export const SetzlingInventory = defineComponent({
    template: html,
    setup() {
        const connection = ensureConnection();
        const player = useCurrentPlayer(connection);
        const itemList = computeItemList(player);
        const hide = initShowHide();
        initItemSelect();

        return {
            hide,
            player,
            itemList
        };
    }
});