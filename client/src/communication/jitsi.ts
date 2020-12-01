import {JitsiRoomId} from "setzling-common";

export function appendJitsiIntegration(roomId: JitsiRoomId) {
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