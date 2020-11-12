import { InstanceInfo } from "setzling-common";
import { GameStore } from "../game/GameStore";

export class InstanceService {
    private store: GameStore;

    constructor(store: GameStore){
        this.store = store;
    }


    listInstances(){

    }

    getInstance(id: string){

    }

    getInstanceInfo(id:string):InstanceInfo{
        return { id, playerOnline: 0 };
    }

}