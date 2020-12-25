import { CustomGame } from "../types/customGame";

export default class TileMarker extends Phaser.GameObjects.Sprite {

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'ui-spritesheet');
        this.setVisible(false);
        this.setOrigin(0, 0);


        let isActive = false;
        scene.input.on(Phaser.Input.Events.POINTER_MOVE, (pointer: Phaser.Input.Pointer) => {
            const { x, y } = this.snapPointerToGrid(pointer);
            this.setPosition(x, y);
        });

        scene.input.on(Phaser.Input.Events.POINTER_DOWN, (pointer: Phaser.Input.Pointer) => {
            console.log("asdf", isActive);
            if (isActive) {
                const { x, y } = this.snapPointerToGrid(pointer);
                (scene.game as CustomGame).commands.placeElement(x, y);
            }
        });

        document.addEventListener('keyup', (e) => {
            if (e.code == "KeyQ") {
                this.setVisible(false);
                isActive = false;
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.code == "KeyQ") {
                this.setVisible(true);
                isActive = true;
            }
        });

    }

    private snapPointerToGrid(pointer: Phaser.Input.Pointer) {
        let { x, y } = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
        return {
            x: Math.floor(x / 16) * 16,
            y: Math.floor(y / 16) * 16
        }
    }


}