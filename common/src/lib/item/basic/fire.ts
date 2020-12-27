import { Item, ItemConsts } from "../Item";
import { ItemRegistry } from "../Registry";

export const ITEM_FIRE = 'item_fire';

const item : Item = {
    description: 'A small bonefire',
    id: ITEM_FIRE,
    displayName: 'fire',
    inHand : ItemConsts.IN_HAND.NONE,
    inPlace : ItemConsts.IN_PLACE.USABLE,
    pickable: true,
    placeable: true,
    stackable: false
} 

ItemRegistry.register(ITEM_FIRE, item);