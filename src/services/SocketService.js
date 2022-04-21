import io from 'socket.io-client';
import { ClientSocketStates } from './socket-states/ClientSocketStates';
import { ServerSocketStates } from './socket-states/ServerSocketStates';

const DEBUG_ENDPOINT = 'http://localhost:3000/';
const PROD_ENDPOINT = 'https://judgment-call.herokuapp.com/';
const SOCKET_TIMEOUT = 5000;

const DEBUG = true; // @TODO: Change this for prod

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
                socket = (DEBUG) ? io(DEBUG_ENDPOINT): io(PROD_ENDPOINT);

                // Timeout if the socket does not connect
                setTimeout(() => {
                    if (!this.isSocketAlive()) reject(new Error('Socket connection timed out.'))
                }, SOCKET_TIMEOUT);

                // On connection - verify that it's connected.
                socket.on(BASE_CONNECT, () => {
                    resolve(true);
                });
            }
        });
    }

    static togglePlayerReady(request) {
        socket.volatile.emit(ClientSocketStates.TOGGLE_PLAYER_READY, request);
    }

    static isSocketAlive = () => { return socket != null && socket.connected }

    // lobbyCode
    static lobbyRefreshListener(setLobbyState, setClientPlayer) {
        socket.on(ServerSocketStates.UPDATE_LOBBY_INFORMATION, (response) => {
            const lobby = response.lobby;
            const players = lobby.players;
            
            // @TODO: error handling
            setLobbyState(lobby);

            // refresh client player
            setClientPlayer(prevState => players.find(player => player.pId == prevState.pId));
        });
    }
}
