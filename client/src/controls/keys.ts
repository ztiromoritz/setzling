export function initializeKeys(ws: WebSocket){
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
        if (e.code === "ArrowUp" || e.code == "KeyW" ) {
            arrows.up = false;
        } else if (e.code === "ArrowDown" || e.code == "KeyS") {
            arrows.down = false;
        } else if (e.code === "ArrowLeft" || e.code == "KeyA") {
            arrows.left = false;
        } else if (e.code === "ArrowRight" || e.code == "KeyD") {
            arrows.right = false;
        }
        sendControlUpdate();
    })

    document.addEventListener('keydown', (e) => {
        if (e.code === "ArrowUp"  || e.code == "KeyW" ) {
            arrows.up = true;
        } else if (e.code === "ArrowDown" || e.code == "KeyS" ) {
            arrows.down = true;
        } else if (e.code === "ArrowLeft" || e.code == "KeyA") {
            arrows.left = true;
        } else if (e.code === "ArrowRight" || e.code == "KeyD") {
            arrows.right = true;
        }
        sendControlUpdate();
    })
}