// This is just an experiment and might go away soon.
import {ToneResources} from "./assets";

export function bindKeysToSounds(toneResources: ToneResources) {
    document.addEventListener("keydown", (event: KeyboardEvent) => {
        /*
        if (event.key === 'q') {
            toneResources.samplers?.guitarMajor.triggerAttackRelease(["C4"], 4);
            return;
        }
        if (event.key === 'w') {
            toneResources.samplers?.guitarMinor.triggerAttackRelease(["D4"], 4);
            return;
        }
        if (event.key === 'e') {
            toneResources.samplers?.guitarMinor.triggerAttackRelease(["E4"], 4);
            return;
        }
        if (event.key === 'r') {
            toneResources.samplers?.guitarMajor.triggerAttackRelease(["F4"], 4);
            return;
        }
        if (event.key === 't') {
            toneResources.samplers?.guitarMajor.triggerAttackRelease(["G4"], 4);
            return;
        }
        if (event.key === 'z') {
            toneResources.samplers?.guitarMinor.triggerAttackRelease(["A4"], 4);
            return;
        }
        */
    });
}
