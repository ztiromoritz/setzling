import { Point } from "./Geo";
import { ItemInstance } from "./ItemInstance";

export type ClientId = string;


export type HorizontalDirection = number; // <0: left, >=0: right

export interface Controls {
    arrows: {
        up: boolean,
        down: boolean,
        left: boolean,
        right: boolean
    }
}


export interface Player {
    clientId: ClientId,
    name?: string,
    position: Point,
    controls: Controls,
    communicationRange: number
    lastHorizontalDirection: HorizontalDirection,
    items: {
        selected: number
        inventory: (ItemInstance | undefined)[]
        bag: ItemInstance[]
    }
}
