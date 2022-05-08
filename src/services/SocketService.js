import io from 'socket.io-client';
import { SERVER_ENDPOINT } from '../components/App.js';
import { ClientSocketStates } from '../constants/ClientSocketStates'
import { GameStates } from '../constants/GameStates.js';
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

    /** Review Functions */
    static sendReview(request) {
        socket.volatile.emit(ClientSocketStates.SEND_REVIEW, request);
    }

    /** Discussion Functions */
    static updateDiscussionData(request) {
        socket.volatile.emit(ClientSocketStates.UPDATE_DISCUSSION, request);
    }
    static toggleDiscussionReady(request) {
        socket.volatile.emit(ClientSocketStates.DISCUSSION_READY, request);
    }

    /** Mitigation Functions */
    static sendMitigation(request) {
        socket.volatile.emit(ClientSocketStates.SEND_MITIGATION, request);
    }

    /** Judgment Call Functions */
    static sendJudgmentCall(request) {
        socket.volatile.emit(ClientSocketStates.SEND_JUDGMENT_CALL, request);
    }

    /** Ready Functions */
    static togglePlayerReady(request) {
        socket.volatile.emit(ClientSocketStates.TOGGLE_PLAYER_READY, request);
    }

    static isSocketAlive = () => socket != null && socket.connected;

    /** Listeners */
    static lobbyRefreshListener(lobbyStateCallbacks, setClientPlayer, setLoaded) {
        socket.on(ServerSocketStates.UPDATE_LOBBY_INFORMATION, (response) => {
            // const serverMessage = response.message;
            const lobby = response.lobby;
            const players = lobby.players;
            const readyStatus = lobby.readyStatus;
            const gameState = lobby.gameMaster.state;
            const gameMaster = lobby.gameMaster;
            const focusPlayer = gameMaster.focusPlayer;

            lobbyStateCallbacks.setLobbyPlayers(players);
            lobbyStateCallbacks.setGameState(gameState);
            lobbyStateCallbacks.setFocusPlayer(focusPlayer);
            lobbyStateCallbacks.setGameMaster(gameMaster);

            lobbyStateCallbacks.setLobbyReadyStatus(readyStatus);

            // @TODO: error handling

            // refresh client player
            if (setClientPlayer) setClientPlayer(prevState => players.find(player => player.pId == prevState.pId));

            // Set loaded init state if present
            if (setLoaded) setLoaded(true);
        });
    }

    static errorListener(setErrorState) {
        socket.on(ServerSocketStates.ERROR, (error) => {
            setErrorState(error);
        });
    }

    static startDealListener(lobbyStateCallbacks, setPageCallback) {
        socket.on(ServerSocketStates.START_DEAL, (response) => {
            // Parse the data from the server
            const lobby = response.lobby;
            const players = lobby.players;
            const readyStatus = lobby.readyStatus;
            const gameState = lobby.gameMaster.state;

            lobbyStateCallbacks.setLobbyPlayers(players);
            lobbyStateCallbacks.setLobbyReadyStatus(readyStatus);
            lobbyStateCallbacks.setGameState(gameState);
            // Set game master
            lobbyStateCallbacks.setGameMaster(lobby.gameMaster);
            // Reset client player and grab the cards
            lobbyStateCallbacks.setClientPlayer((prevState) => players.find((player) => player.pId === prevState.pId));

            // socket.emit(ClientSocketStates.CARDS_DEALT);
            // Start game and navigate to 'review' page
            setPageCallback('scenario');
        });
    }

    static startDiscussionListener(lobbyStateCallbacks, setPageCallback) {
        socket.on(ServerSocketStates.DIRECT_TO_DISCUSSION, (response) => {
            // const serverMessage = response.message;
            const lobby = response.lobby;
            const players = lobby.players;
            const gameState = lobby.gameMaster.state;
            const gameMaster = lobby.gameMaster;
            const readyStatus = lobby.readyStatus;
            const focusPlayer = gameMaster.focusPlayer;

            lobbyStateCallbacks.setFocusPlayer(focusPlayer);
            lobbyStateCallbacks.setGameMaster(gameMaster);
            lobbyStateCallbacks.setGameState(gameState);
            lobbyStateCallbacks.setLobbyReadyStatus(readyStatus);
            // Reset client player 
            lobbyStateCallbacks.setClientPlayer((prevState) => players.find((player) => player.pId === prevState.pId));

            setPageCallback('discussion');
        });
    }

    static startMitigationListener(lobbyStateCallbacks, setPageCallback) {
        socket.on(ServerSocketStates.START_MITIGATION, (response) => {
            // const serverMessage = response.message;
            const lobby = response.lobby;
            const players = lobby.players;
            const gameMaster = lobby.gameMaster;
            const readyStatus = lobby.readyStatus;
            const focusPlayer = gameMaster.focusPlayer;
            const gameState = gameMaster.state;

            lobbyStateCallbacks.setFocusPlayer(focusPlayer);
            lobbyStateCallbacks.setGameMaster(gameMaster);
            lobbyStateCallbacks.setGameState(gameState);
            lobbyStateCallbacks.setLobbyPlayers(players);
            lobbyStateCallbacks.setLobbyReadyStatus(readyStatus);
            // Reset client player 
            lobbyStateCallbacks.setClientPlayer((prevState) => players.find((player) => player.pId === prevState.pId));

            setPageCallback('mitigation');
        });
    }

    static startJudgmentCallListener(lobbyStateCallbacks, setPageCallback) {
        socket.on(ServerSocketStates.START_JUDGMENT_CALL, (response) => {
            // const serverMessage = response.message;
            const lobby = response.lobby;
            const players = lobby.players;
            const gameMaster = lobby.gameMaster;
            const gameState = gameMaster.state;
            const readyStatus = lobby.readyStatus;
            const focusPlayer = gameMaster.focusPlayer;

            lobbyStateCallbacks.setFocusPlayer(focusPlayer);
            lobbyStateCallbacks.setGameMaster(gameMaster);
            lobbyStateCallbacks.setGameState(gameState);
            lobbyStateCallbacks.setLobbyReadyStatus(readyStatus);
            // Reset client player 
            lobbyStateCallbacks.setClientPlayer((prevState) => players.find((player) => player.pId === prevState.pId));

            setPageCallback('judgment');
        });
    }

    static startSummaryListener(lobbyStateCallbacks, setPageCallback) {
        socket.on(ServerSocketStates.START_SUMMARY, (response) => {
            // const serverMessage = response.message;
            const lobby = response.lobby;
            const players = lobby.players;
            const gameMaster = lobby.gameMaster;
            const gameState = gameMaster.state;
            const readyStatus = lobby.readyStatus;
            const focusPlayer = gameMaster.focusPlayer;

            lobbyStateCallbacks.setFocusPlayer(focusPlayer);
            lobbyStateCallbacks.setGameMaster(gameMaster);
            lobbyStateCallbacks.setGameState(gameState);
            lobbyStateCallbacks.setLobbyReadyStatus(readyStatus);
            lobbyStateCallbacks.setEndTime(response.timestamp);
            // Reset client player 
            lobbyStateCallbacks.setClientPlayer((prevState) => players.find((player) => player.pId === prevState.pId));

            setPageCallback('summary');
        })
    }

    /** @TODO: Move this to Timer after prod */
    static startGameListener(timerStart) {
        socket.on(ServerSocketStates.ALL_PLAYERS_READY, (response) => {
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

    static debug() {
        if (socket) {
            socket.onAny((event) => {
                console.log(event);
            })
        }
    }
}
