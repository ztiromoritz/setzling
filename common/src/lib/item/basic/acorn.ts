import { Item, ItemConsts } from "../Item";
import { ItemRegistry } from "../Registry";

export const ITEM_ACORN = 'item_acorn';

const item : Item = {
    description: 'A young acorn',
    id: ITEM_ACORN,
    displayName: 'acorn',
    inHand : ItemConsts.IN_HAND.NONE,
    inPlace : ItemConsts.IN_PLACE.USABLE,
    pickable: true,
    placeable: true,
    stackable: false
}

ItemRegistry.register(ITEM_ACORN, item);
// must be imported in index.ts
