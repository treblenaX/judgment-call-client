import React from 'react';
import io from 'socket.io-client';

// Requested Events
const NEED_LOBBY_CODE = 'NEED LOBBY CODE';
const CLIENT_DISCONNECT = 'disconnect';
const CLIENT_JOINED_LOBBY = 'CLIENT JOINED LOBBY';
const REQUESTING_LOBBY_INFO = 'REQUESTING LOBBY INFO';

// Response Events
const CLIENT_CONNECTED = 'CLIENT CONNECTED';
const FOUND_LOBBY_CODE = 'FOUND LOBBY CODE';
const WELCOME_PLAYER = 'WELCOME PLAYER';
const SENDING_LOBBY_INFO = 'SENDING LOBBY INFO';
const REFRESH_PLAYER_LIST = 'REFRESH PLAYER LIST';

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

    socket.emit(NEED_LOBBY_CODE, request);

    return new Promise((resolve, reject) => {
        socket.on(FOUND_LOBBY_CODE, (response) => {
            const error = response.error;
            const lobbyCode = response.lobbyCode;

            if (!error) resolve(lobbyCode);
            else reject(error);
        });
    });
}

export async function createSocketConnection() {
    const s = io('http://localhost:3000');

    return new Promise(resolve => {
        s.on(CLIENT_CONNECTED, (connected) => {
            socket = s;
            resolve(connected);
        });
    });
}

export async function initLobbyState(lobbyCode) {
    socket.emit(CLIENT_JOINED_LOBBY, lobbyCode);

    return new Promise(resolve => {
        socket.on(WELCOME_PLAYER, () => {
            resolve(true);
        });
    });
}

export async function waitForLobbyInfo(lobbyCode) {
    socket.emit(REQUESTING_LOBBY_INFO, lobbyCode);

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
