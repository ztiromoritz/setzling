export function initializeServerKeys(ws: WebSocket) {
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
                controls: { arrows }
            }
        }
        ws.send(JSON.stringify(msg));
    }


    document.addEventListener('keyup', (e) => {
        /*switch (e.code) {
            case "ArrowUp":
            case "KeyW":
                arrows.up = false;
                break;
            case "ArrowDown"
        }*/
        if (e.code === "ArrowUp" || e.code == "KeyW") {
            arrows.up = false;
            sendControlUpdate();
        } else if (e.code === "ArrowDown" || e.code == "KeyS") {
            arrows.down = false;
            sendControlUpdate();
        } else if (e.code === "ArrowLeft" || e.code == "KeyA") {
            arrows.left = false;
            sendControlUpdate();
        } else if (e.code === "ArrowRight" || e.code == "KeyD") {
            arrows.right = false;
            sendControlUpdate();
        }
        
    })

    document.addEventListener('keydown', (e) => {
        if (e.code === "ArrowUp" || e.code == "KeyW") {
            arrows.up = true;
            sendControlUpdate();
        } else if (e.code === "ArrowDown" || e.code == "KeyS") {
            arrows.down = true;
            sendControlUpdate();
        } else if (e.code === "ArrowLeft" || e.code == "KeyA") {
            arrows.left = true;
            sendControlUpdate();
        } else if (e.code === "ArrowRight" || e.code == "KeyD") {
            arrows.right = true;
            sendControlUpdate();
        }
    })
}

