export function initializeRangeSlider(ws: WebSocket){
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
    const min = 30;
    const max = 300;
    let communicationRange = 50;
    let startIncrementHoldTimeout:number;
    let incrementInterval: number;


    document.addEventListener('keydown', (e) => {
        if(e.key === '+'){
            communicationRange = Math.min(communicationRange+1, max);
            sendCommunicationRangeUpdate(communicationRange);
        } else if(e.key === '-'){
            communicationRange = Math.max(communicationRange-1, min);
            sendCommunicationRangeUpdate(communicationRange);
        }
    })

}