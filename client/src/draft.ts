import {enablePatches, applyPatches} from "immer";
import {GameState, Player} from "setzling-common";
import * as PIXI from 'pixi.js';
import {Sprite} from "pixi.js";


export const draft = () => {
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

    const app = new PIXI.Application({width: 1200, height: 800});
   // app.view.style.cssText = "position: absolute; top: 0; left: 0; bottom: 0: right: 0;";
    document.body.prepend(app.view);


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
            for (let i = 0; i < 20; i++) {
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

            // prepare stage for drawing communication range later
            let communicationRangeLayer = new PIXI.Graphics();
            app.stage.addChild(communicationRangeLayer);

            function render(state: GameState) {
                app.stage.children.sort(function (a, b) {
                    if (a.position.y > b.position.y) return 1;
                    if (a.position.y < b.position.y) return -1;
                    return 0;
                });
                app.stage.children.forEach((child) => {
                    child.zIndex = child.y;
                })


                seedlings.forEach(s => s.visible = false);

                let color = 0;
                app.stage.removeChild(communicationRangeLayer);
                communicationRangeLayer = new PIXI.Graphics();
                state.players.forEach((player: any) => {
                    const seedling = seedlings[color++];
                    seedling.x = player.position.x;
                    seedling.y = player.position.y;
                    seedling.visible = true;
                    drawCommunicationRange(player);
                })
                app.stage.addChild(communicationRangeLayer);

                if ($game) {
                    $game.innerHTML = "";
                }
            }

            function drawCommunicationRange(player: Player) {
                communicationRangeLayer.lineStyle(1, 0xff0000, 0.5)
                communicationRangeLayer.drawCircle(player.position.x, player.position.y, player.communicationRange);
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

            function sendCommunicationRangeUpdate(range: number) {
                const msg = {
                    type: 'CommunicationRangeUpdate',
                    options: {
                        range: range
                    }
                }
                ws.send(JSON.stringify(msg));
            }


            // handle range slider
            let rangeSlider = document.querySelector("#communication_range_slider");
            let communicationRange = 50;
            const onUpdateRangeSlider = (rangeSlider: any, rangeLabel: any) => {
                let newValue;
                if (rangeSlider != null) {
                    newValue = rangeSlider.value;
                }
                if (rangeLabel != null) {
                    rangeLabel.innerHTML = "Range: " + newValue;
                }
                communicationRange = newValue;
                sendCommunicationRangeUpdate(newValue)
            };
            if (rangeSlider != null) {
                let rangeLabel = document.querySelector("#communication_range_label");
                rangeSlider.addEventListener("input", () => {
                    onUpdateRangeSlider(rangeSlider, rangeLabel)
                });
                rangeSlider.addEventListener("change", () => {
                    onUpdateRangeSlider(rangeSlider, rangeLabel)
                }); // add onInput and onChange, as Firefox & Chrome trigger on input, while IE10 on change
                console.log("... initialized slider!");
            } else {
                console.error("Range slider cannot be found!");
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

        });
}
