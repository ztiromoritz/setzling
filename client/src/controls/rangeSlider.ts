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
        rangeSlider.blur(); // lose focus after changing value
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
}