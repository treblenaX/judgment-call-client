import React from 'react';
import io from 'socket.io-client';

const DEBUG_ENDPOINT = 'http://localhost:3000';
const PROD_ENDPOINT = 'https://judgment-call.herokuapp.com/';

const DEBUG = true; // @TODO: Change this for prod

// Requested Events
const NEED_LOBBY_CODE = 'NEED LOBBY CODE';
const CLIENT_DISCONNECT = 'disconnect';
const CLIENT_JOINED_LOBBY = 'CLIENT JOINED LOBBY';
const REQUESTING_LOBBY_INFO = 'REQUESTING LOBBY INFO';
const UPDATE_READY_STATE = 'UPDATE PLAYER READY STATE';
const DOES_LOBBY_EXIST = 'DOES LOBBY EXIST'

// Response Events
const CLIENT_CONNECTED = 'CLIENT CONNECTED';
const FOUND_LOBBY_CODE = 'FOUND LOBBY CODE';
const WELCOME_PLAYER = 'WELCOME PLAYER';
const SENDING_LOBBY_INFO = 'SENDING LOBBY INFO';
const REFRESH_PLAYER_LIST = 'REFRESH PLAYER LIST';
const CONFIRM_UPDATE_READY_STATE = 'CONFIRMED PLAYER READY STATE';
const LOBBY_EXIST_RESPONSE = 'LOBBY EXISTENCE RESPONSE';

export var socket = null;

export async function verifySocketConnection() {
    if (socket == null) {
        await createSocketConnection();
    }

    return new Promise(resolve => {
        resolve(true);
    });
}

export async function closeSocketConnection() {
    if (socket != null) {
        socket.disconnect();
    }

    return 'Socket connection with server closed.';
}

/** Lobby INIT */

export async function requestLobbyCode(request) {
    const player = request.player;
    const isHost = request.isHost;

    socket.volatile.emit(NEED_LOBBY_CODE, request);

    return new Promise((resolve, reject) => {
        socket.on(FOUND_LOBBY_CODE, (response) => {
            const error = response.error;
            const lobbyCode = response.lobbyCode;

            if (!error) {
                resolve(lobbyCode);
            }
            else {
                reject(error);
            }
        });
    });
}

export async function doesLobbyExist(lobbyCode) {
    // Socket verification
    await verifySocketConnection();

    const request = {
        lobbyCode: lobbyCode
    };

    socket.volatile.emit(DOES_LOBBY_EXIST, request);

    return new Promise((resolve, reject) => {
        socket.on(LOBBY_EXIST_RESPONSE, (response) => {
            resolve(response.existence);
        });
    })
}

export async function createSocketConnection() {
    if (DEBUG) {
        socket = io(DEBUG_ENDPOINT);
    } else {
        socket = io(PROD_ENDPOINT);
    }

    return new Promise(resolve => {
        socket.on(CLIENT_CONNECTED, (connected) => {
            resolve(connected);
        });
    });
}

export async function initLobbyState(lobbyCode) {
    socket.volatile.emit(CLIENT_JOINED_LOBBY, lobbyCode);

    return new Promise(resolve => {
        socket.on(WELCOME_PLAYER, () => {
            resolve(true);
        });
    });
}

export async function waitForLobbyInfo(lobbyCode) {
    socket.volatile.emit(REQUESTING_LOBBY_INFO, lobbyCode);

    return new Promise(resolve => {
        socket.on(SENDING_LOBBY_INFO, (data) => {
            resolve(data);
        });
    });
}

export async function refreshLobbyInfo(setLobbyPlayers) {
    socket.on(REFRESH_PLAYER_LIST, (data) => {
        setLobbyPlayers(data);
    });
}

/** Game States */
export async function readyUpPlayer(lobbyCode, setReady, readyState) {
    const request = {
        lobbyCode: lobbyCode,
        readyState: readyState
    }

    socket.volatile.emit(UPDATE_READY_STATE, request);

    return new Promise(resolve => {
        socket.on(CONFIRM_UPDATE_READY_STATE, (confirmedState) => {
            setReady(confirmedState);
            resolve(confirmedState);
        });
    })
}
