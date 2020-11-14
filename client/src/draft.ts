import {enablePatches, applyPatches} from "immer";
import {GameState} from "setzling-common";
import * as PIXI from 'pixi.js';
import {Sprite} from "pixi.js";


export const draft = () => {

    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

    const app = new PIXI.Application({forceCanvas: true, width: 1200, height: 800});
   // app.view.style.cssText = "position: absolute; top: 0; left: 0; bottom: 0: right: 0;";
    document.body.prepend(app.view);
    console.log("NEW")

    app.loader
        .add('tree', './assets/tree.png')
        .add('setzling', './assets/setzling.png')
        .load((loader, resources) => {
            console.log("NEWWW")
            const tree = new PIXI.Sprite(resources?.tree?.texture);
            console.log(tree);

            // Setup the position of the bunny
            tree.x = app.renderer.width / 2;
            tree.y = app.renderer.height / 2;
           // tree.visible = false;

            // Rotate around the center
            tree.anchor.x = 0.5;
            tree.anchor.y = 1;
            tree.scale.set(4, 4);

            // Add the bunny to the scene we are building.
            app.stage.addChild(tree);

            const seedlings: Sprite[] = [];
            for(let i = 0; i<20;i++){
                const seedling = new PIXI.Sprite(resources?.setzling?.texture);
                seedling.x = 0;
                seedling.y = 0;
                seedling.visible = false;
                seedling.anchor.x = 0.5;
                seedling.anchor.y = 1;
                seedling.scale.set(2, 2);
                app.stage.addChild(seedling)
                seedlings.push(seedling);
            }


            enablePatches();

            const $game = document.querySelector('#game');

            function render(state: GameState) {

                app.stage.children.sort(function(a,b) {
                    if (a.position.y > b.position.y) return 1;
                    if (a.position.y < b.position.y) return -1;
                    return 0;
                });
                app.stage.children.forEach((child)=>{
                    child.zIndex = child.y;
                })


                seedlings.forEach(s=>s.visible = false);

                let color = 0;
                state.players.forEach((player: any) => {
                    const seedling = seedlings[color++];
                    seedling.x = player.position.x;
                    seedling.y = player.position.y;
                    seedling.visible = true;
                })

                if ($game) {
                    $game.innerHTML = "";

                }
            }

            const ws = new WebSocket((window as any).WEB_SOCKET_BASE_URL);
            ws.onopen = function (event) {
                console.log("open");
                const msg = {
                    type: 'JoinGame',
                    options: {
                        gameId: 'default'
                    }
                }
                ws.send(JSON.stringify(msg));
            };


            ws.onmessage = (() => {
                let state: GameState;
                return function (event: MessageEvent) {
                    const message = JSON.parse(event.data);
                    if (message.type === 'UpdateState') {
                        console.log('UpdateState', message.options);
                        if (message.options.snapshot) {
                            state = message.options.snapshot
                        }
                        if (message.options.patches) {
                            state = applyPatches(state, message.options.patches);
                        }
                        console.log("Update state!");
                    }
                    const $pre = document.querySelector('pre')
                    if ($pre) {
                        $pre.innerHTML = JSON.stringify(state, null, 2);
                    }
                    render(state);
                }
            })();


            let arrows = {
                up: false,
                down: false,
                left: false,
                right: false
            };

            function sendControlUpdate() {
                const msg = {
                    type: 'ControlUpdate',
                    options: {
                        controls: {arrows}
                    }
                }
                ws.send(JSON.stringify(msg));
            }

            document.addEventListener('keyup', (e) => {
                if (e.code === "ArrowUp") {
                    arrows.up = false;
                } else if (e.code === "ArrowDown") {
                    arrows.down = false;
                } else if (e.code === "ArrowLeft") {
                    arrows.left = false;
                } else if (e.code === "ArrowRight") {
                    arrows.right = false;
                }
                sendControlUpdate();
            })

            document.addEventListener('keydown', (e) => {
                if (e.code === "ArrowUp") {
                    arrows.up = true;
                } else if (e.code === "ArrowDown") {
                    arrows.down = true;
                } else if (e.code === "ArrowLeft") {
                    arrows.left = true;
                } else if (e.code === "ArrowRight") {
                    arrows.right = true;
                }
                sendControlUpdate();
            })

        })



}
