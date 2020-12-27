import { ItemId } from "../../item/Item";
import { Point } from "./Geo";

export type ItemInstanceId = string;

export interface ItemInstanceState {
  [key: string]: string | number | boolean
}

export interface ItemInstance {
  id: ItemId
  itemId: ItemInstanceId
  bluprint: boolean
  amount: number
  state: ItemInstanceState
  
  // If this item is placed on map, this is set.
  position ?: Point
}