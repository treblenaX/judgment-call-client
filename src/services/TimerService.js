import { ServerSocketStates } from "../constants/ServerSocketStates";
import { socket as _socket } from "./SocketService";

var socket;

export class TimerService {
    /** Review Timers */
    static startReviewTimerListener(timerStart) {
        // Set the socket
        socket = _socket;

        socket.on(ServerSocketStates.START_DEAL, (response) => {
            timerStart();
        });
    }

    static stopReviewTimerListener() {

    }
}