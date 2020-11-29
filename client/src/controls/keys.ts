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
}