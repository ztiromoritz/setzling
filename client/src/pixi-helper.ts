import * as PIXI from 'pixi.js';
export function createFrames(texture: PIXI.Texture, {frameWidth, frameHeight}: { frameWidth: number, frameHeight: number }): PIXI.Texture[] {
    const cols = Math.floor(texture.width / frameWidth);
    const rows = Math.floor(texture.height / frameHeight);
    console.log(cols, rows);
    const result = [];
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            result.push(new PIXI.Texture(texture.baseTexture,
                new PIXI.Rectangle(col * frameWidth, row * frameHeight, frameWidth, frameHeight)));
        }
    }
    return result;
};


export const mainRenderer = PIXI.autoDetectRenderer({width: 1200, height: 800});