

import { Item, ItemId } from "./Item";

export const ItemRegistry = (function () {
    const map = new Map<string,Item>();
    return {
        register(id: ItemId, item: Item) {
            map.set(id,item);
        },
        get(id: ItemId): Item {
            return map.get(id);
        }
    }
})();

