import io from 'socket.io-client';
import { SERVER_ENDPOINT } from '../components/App.js';
import { ClientSocketStates } from '../constants/ClientSocketStates'
import { ServerSocketStates } from '../constants/ServerSocketStates';

const SOCKET_TIMEOUT = 5000;

const BASE_CONNECT = 'connect';

export var socket = null;

export class SocketService {
    static async joinLobby(request) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.verifySocketConnection();
    
                socket.volatile.emit(ClientSocketStates.CONNECT_TO_LOBBY, request);

                socket.on(ServerSocketStates.PLAYER_CONNECTED_TO_LOBBY, (response) => {
                    if (!response.error) {
                        resolve(response);
                    } else {
                        throw new Error(response.error);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    static async verifySocketConnection() {
        return new Promise(async (resolve, reject) => {
            if (!this.isSocketAlive()) { // Socket is not connected/initialized
                socket = io(SERVER_ENDPOINT);

                // Timeout if the socket does not connect
                setTimeout(() => {
                    if (!this.isSocketAlive()) reject(new Error('Socket connection timed out.'))
                }, SOCKET_TIMEOUT);

                // On connection - verify that it's connected.
                socket.on(BASE_CONNECT, () => {
                    
                    // @TODO: take out if not debug
                    SocketService.debug();
                    resolve(true);
                });
            }
        });
    }

    /** Ready Functions */
    static togglePlayerReady(request) {
        socket.volatile.emit(ClientSocketStates.TOGGLE_PLAYER_READY, request);
    }

    static isSocketAlive = () => { return socket != null && socket.connected }

    /** Listeners */
    static lobbyRefreshListener(lobbyStateCallbacks, setClientPlayer) {
        socket.on(ServerSocketStates.UPDATE_LOBBY_INFORMATION, (response) => {
            console.log(response);
            const serverMessage = response.message;
            const lobby = response.lobby;
            const players = lobby.players;
            const readyStatus = lobby.readyStatus;
            const gameState = lobby.gameMaster.state;

            lobbyStateCallbacks.setLobbyPlayers(players);
            lobbyStateCallbacks.setGameState(gameState);
            lobbyStateCallbacks.setLobbyReadyStatus(readyStatus);

            // @TODO: error handling

            // refresh client player
            setClientPlayer(prevState => players.find(player => player.pId == prevState.pId));
        });
    }

    static startGameListener(timerStart) {
        socket.on(ServerSocketStates.ALL_PLAYERS_READY, (response) => {
            console.log('ALL PLAYERS READY');
            // Start game counter
            timerStart();
        });
    }

    static stopCountDownListener(timerReset) {
        socket.on(ServerSocketStates.STOP_COUNTDOWN, (response) => {
            // Stop and reset game counter
            timerReset();
        });
    }

    static errorListener(setErrorState) {
        socket.on(ServerSocketStates.ERROR, (error) => {
            setErrorState(error);
        });
    }

    static debug() {
        if (socket) {
            socket.onAny((event) => {
                console.log(event);
            })
        }
    }
}
