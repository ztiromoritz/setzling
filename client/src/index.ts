import { draft } from './draft';



draft();

export const setzling = {
    init(){
        console.log('Setzling initialized!')
    }
}

export function onUpdateRangeSlider(newValue: number) {
    console.log("Set slider to new Value: "+newValue);
}