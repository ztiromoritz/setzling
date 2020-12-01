import * as Tone from "tone";
export type ToneResources = { samplers?: {[id:string]:Tone.Sampler} } ;

export function loadTone(): Promise<ToneResources>{
    const guitarMajor = new Tone.Sampler({
        urls: {
            "C3": "Guitar-C-Major.wav",
            "F3": "Guitar-F-Major.wav",
            "G3": "Guitar-G-Major.wav"
        },
        release: 1,
        baseUrl: "./assets/",
    }).toDestination();

    const guitarMinor = new Tone.Sampler({
        urls: {
            "A3": "Guitar-A-Minor.wav",
            "D4": "Guitar-D-Minor.wav",
            "E4": "Guitar-E-Minor.wav"
        },
        release: 1,
        baseUrl: "./assets/",
    }).toDestination();

    return Tone.loaded().then(()=>{
        return {
            samplers: {
                guitarMajor,
                guitarMinor
            }
        }
    })
}