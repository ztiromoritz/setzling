import { ClientItem, ClientItemDescriptor } from "./clientItem";
import { ItemId, ItemRegistry } from "setzling-common";

export const ClientItemRegistry = (function () {
    const map = new Map<String,ClientItem>();
    return {
        register(id: string, item: ClientItemDescriptor) {
            if(ItemRegistry.get(id)){
                const baseItem = ItemRegistry.get(id);
                Object.setPrototypeOf(item, baseItem);
                map.set(id,item as ClientItem);
            }else{
                console.warn(`Could not register client item ${id}. No base item available.`)
            }            
        },
        get(id: ItemId): ClientItem | undefined {
            // TODO: create default client item
            return map.get(id);
        }
    }
})();