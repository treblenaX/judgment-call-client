import { createSocketConnection, initLobbyState, isSocketAlive, readyUpPlayer, refreshLobbyInfo, requestLobbyCode, socket, waitForLobbyInfo } from "./socket";

export class SocketService {
    /**
     * Connects to the server and starts socket connection.
     * @returns 
     */
    static async connectToServer() {
        // If the socket is not alive, make a connection
        if (!isSocketAlive()) {
            try {
                await createSocketConnection();
            } catch (err) {
                return {
                    error: err,
                    result: false
                }
            }
        }

        return {
            result: true
        };
    }

    /**
     * Connects to the server socket and then gets the lobby code
     * @returns { connected: boolean, lCode: string | the lobby code}
     */
    static async connectToLobby(request) {
        return new Promise(async (resolve) => {
            const lCode = await requestLobbyCode(request);
            const connection = await initLobbyState(lCode);

            resolve({ connectedToLobby: connection, lCode: lCode });
        });
    }

    /**
     * Update lobby information
     * @param {*} connected 
     * @param {*} lCode 
     * @param {*} setLobbyPlayers 
     * @returns 
     */
    static async updateLobbyInformation(lCode) {
        return new Promise(async (resolve) => {
            const players = await waitForLobbyInfo(lCode);

            resolve(players);
        });
    }

    static async emitReadyStatus(request) {
        return await readyUpPlayer(request);
    }

    static refreshLobbyInformation(setLobbyPlayers) {
        return refreshLobbyInfo(setLobbyPlayers);
    }
}
