export function initializePlacement(ws: WebSocket){
    function sendPlaceElement(x: number, y:number) {
        const msg = {
            type: 'PlaceElement',
            options: {
                x: x,
                y: y
            }
        }
        ws.send(JSON.stringify(msg));
    }

    const onPlaceElement = () => {
        console.log("Placing test element at player position!")
        sendPlaceElement(0,0); // TODO: test coordinates for the moment
    };

    let placeButton = document.querySelector("#place_button");
    if (placeButton != null) {
        placeButton.addEventListener("click", () => {
            onPlaceElement();
        });
    } else {
        console.error("Place button cannot be found!");
    }
}