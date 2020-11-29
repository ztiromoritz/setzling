import {enablePatches, applyPatches} from "immer";
import {GameState, JitsiRoomId, LoginMessage, Player} from "setzling-common";
import * as PIXI from 'pixi.js';
import {Sprite} from "pixi.js";

import {Assets, PixiResources, ToneResources} from "./assets";
import {testMap} from "./tileMapTest";
import {mainRenderer} from "./pixi-helper";
import {initializeKeys} from "./controls/keys";
import {initializeRangeSlider} from "./controls/rangeSlider";
import {bindKeysToSounds} from "./controls/soundKey";


export const draft = () => {
    function initializePIXI() {
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

        const app = new PIXI.Application({width: 1200, height: 800});
        // app.view.style.cssText = "position: absolute; top: 0; left: 0; bottom: 0: right: 0;";
        let mainSection = document.querySelector('#grid-main')
        if (mainSection != null)
            mainSection.prepend(mainRenderer.view);
        else
            document.body.prepend(mainRenderer.view);
        return app;
    }

    function addTreeToScene(pixiResources: PixiResources) {
        const tree = new PIXI.Sprite(pixiResources?.tree?.texture);
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
    }

    function preallocateSeedlings(pixiResources: PixiResources, amount: number) {
        const seedlings: Sprite[] = [];
        for (let i = 0; i < amount; i++) {
            const seedling = new PIXI.Sprite(pixiResources?.setzling?.texture);
            seedling.x = 0;
            seedling.y = 0;
            seedling.visible = false;
            seedling.anchor.x = 0.5;
            seedling.anchor.y = 1;
            seedling.scale.set(2, 2);
            app.stage.addChild(seedling)
            seedlings.push(seedling);
        }
        return seedlings;
    }

    function drawCommunicationRange(player: Player, communicationRangeLayer: any) {
        communicationRangeLayer.lineStyle(1, 0xff0000, 0.5)
        communicationRangeLayer.drawCircle(player.position.x, player.position.y, player.communicationRange);
    }

    function appendJitsiIntegration(roomId: JitsiRoomId) {
        const domain = 'meet.jit.si';
        const options = {
            roomName: roomId,
            width: 400,
            height: 400,
            configOverwrite: {
                startWithAudioMuted: false,
                prejoinPageEnabled: false
            },
            //interfaceConfigOverwrite: {},
            parentNode: document.querySelector('#meet')
        };
        const api = new (window as any).JitsiMeetExternalAPI(domain, options);
    }

    const app = initializePIXI();

    Assets
        .loadAll(app)
        .then(({pixiResources, toneResources}) => {

            const $game = document.querySelector('#game');
            const seedlings = preallocateSeedlings(pixiResources, 20);

            bindKeysToSounds(toneResources);

            addTreeToScene(pixiResources);

            appendJitsiIntegration("kevintrompeteisthier");

            enablePatches();



            // prepare stage for drawing communication range later
            let communicationRangeLayer = new PIXI.Graphics();
            app.stage.addChild(communicationRangeLayer);

            testMap(app, pixiResources);

            mainRenderer.render(app.stage);

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
                    seedling.y = player.position.y + /*to center around middle:*/ (seedling.height/2);
                    seedling.visible = true;
                    drawCommunicationRange(player, communicationRangeLayer);
                })
                app.stage.addChild(communicationRangeLayer);

                if ($game) {
                    $game.innerHTML = "";
                }

                mainRenderer.render(app.stage);
            }


            const ws = new WebSocket((window as any).WEB_SOCKET_BASE_URL);
            ws.onopen = function (event) {
                let gameId = 'default';
                const msg = {
                    type: 'JoinGame',
                    options: {
                        gameId: gameId
                    }
                }
                console.log("Joined game: "+gameId);
                ws.send(JSON.stringify(msg));
            };

            ws.onmessage = (() => {
                let state: GameState;
                return function (event: MessageEvent) {
                    const message = JSON.parse(event.data);
                    switch (message.type) {
                        case 'UpdateState':
                            // console.log('UpdateState', message.options);
                            if (message.options.snapshot) {
                                state = message.options.snapshot
                            }
                            if (message.options.patches) {
                                state = applyPatches(state, message.options.patches);
                            }
                            render(state);
                            break;
                        case "Login":
                            let clientId:string = (message as LoginMessage).options.clientId;
                            console.log("My client ID is "+clientId);
                            break;
                        default:
                            console.error("Unable to handle incoming websocket message of type: "+message.type);
                            break;
                    }
                }
            })();


            initializeRangeSlider(ws);
            initializeKeys(ws);

        });
}
