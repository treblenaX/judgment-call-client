import React from 'react';
import io from 'socket.io-client';

const DEBUG_ENDPOINT = 'http://localhost:3000/';
const PROD_ENDPOINT = 'https://judgment-call.herokuapp.com/';
const SOCKET_TIMEOUT = 5000;

const DEBUG = true; // @TODO: Change this for prod

// Requested Events
const NEED_LOBBY_CODE = 'NEED LOBBY CODE';
const CLIENT_DISCONNECT = 'disconnect';
const CLIENT_JOINED_LOBBY = 'CLIENT JOINED LOBBY';
const REQUESTING_LOBBY_INFO = 'REQUESTING LOBBY INFO';
const UPDATE_READY_STATE = 'UPDATE PLAYER READY STATE';

// Response Events
const CLIENT_CONNECTED = 'CLIENT CONNECTED';
const FOUND_LOBBY_CODE = 'FOUND LOBBY CODE';
const WELCOME_PLAYER = 'WELCOME PLAYER';
const SENDING_LOBBY_INFO = 'SENDING LOBBY INFO';
const REFRESH_PLAYER_LIST = 'REFRESH PLAYER LIST';
const CONFIRM_UPDATE_READY_STATE = 'CONFIRMED PLAYER READY STATE';
const LOBBY_EXIST_RESPONSE = 'LOBBY EXISTENCE RESPONSE';

const BASE_CONNECT = 'connect';

const CONNECT_TO_LOBBY = 'client:connecttolobby';
const DOES_LOBBY_EXIST = 'client:doeslobbyexist';

const PLAYER_CONNECTED_TO_LOBBY = 'server:playerconnectedtolobby';
const LOBBY_DOES_EXIST = 'server:lobbydoesexist';

export var socket = null;

export class SocketHandler {
    static async joinLobby(request) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.verifySocketConnection();
    
                socket.volatile.emit(CONNECT_TO_LOBBY, request);

                socket.on(PLAYER_CONNECTED_TO_LOBBY, (response) => {
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

    static isSocketAlive() {
        if (!socket) return false;
        return socket.connected;
    }
}
