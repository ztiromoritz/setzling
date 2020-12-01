import * as Tone from "tone";

export type PixiResources = Partial<Record<string, PIXI.LoaderResource>>;
export type ToneResources = { samplers?: {[id:string]:Tone.Sampler} } ;
export type SetzlingResources = {
    pixiResources: PixiResources
    toneResources: ToneResources
};

export const toneAssets : SetzlingResources =  {
    pixiResources: {},
    toneResources: {}
};

export class Assets {
    static async loadAll(pixi: PIXI.Application) : Promise<SetzlingResources>{
        const pixiResourcesPromise = Assets.loadPixi(pixi);
        const toneResourcesPromise = Assets.loadTone();
        const [pixiResources, toneResources] = await Promise.all([pixiResourcesPromise, toneResourcesPromise]);
        return {pixiResources, toneResources};
    }

    static loadPixi(pixi: PIXI.Application): Promise<PixiResources> {
        return new Promise((resolve)=>{
            pixi.loader
                .add('tree', './assets/tree.png')
                .add('setzling', './assets/setzling.png')
                .add('tileset', './assets/Tileset.png')
                .load((loader, resources)=>{
                    resolve(resources);
                });
        })
    }

    static loadTone(): Promise<ToneResources>{
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
};