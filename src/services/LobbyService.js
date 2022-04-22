import { SERVER_ENDPOINT } from '../components/App.js';
import { SocketService } from './SocketService.js';

const API_ENDPOINT = '/api/lobby/';

export class LobbyService {
    static isAPIAlive = async () => {
        try {
            const callpoint = SERVER_ENDPOINT + API_ENDPOINT;
            const response = await fetch(callpoint);
            const result = await response.text();

            return Boolean(result);
        } catch (error) {
            throw new Error(`API handshake error: ${error}`);
        }
    }
    /**
     * Requests to the server to create a lobby
     * @param { Object } request
     *  lobbyCode: string
     * 
     * @returns { * } 
     *  lobby: Lobby object
     */
    static createLobby = async (request) => {
        try {
            // Build the endpoint
            const callpoint = SERVER_ENDPOINT + API_ENDPOINT + 'createLobby';
            // POST request to create lobby 
            const response = await fetch(callpoint, {
                method: 'POST',
                body: JSON.stringify(request),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const results = await response.json();

            // Error guard
            if (results.error) throw new Error(results.error);

            const newRequest = {
                playerName: request.playerName,
                lobbyCode: results.lobbyCode
            };

            // On 'connection' - socket to join lobby
            return await SocketService.joinLobby(newRequest);
        } catch (error) {
            throw new Error(`createLobby error: ${error}`);
        }
    }

    /**
     * 
     * @param { * } request
     *  lobbyCode: string
     * @returns { * }
     *  lobby: Lobby object
     */
    static joinLobby = async (request) => {
        try {
            const baseUrl = SERVER_ENDPOINT + API_ENDPOINT;
            // Check if the lobby exists
            const existenceUrl = baseUrl + 'isValid?lobbyCode=' + request.lobbyCode;

            const existenceResponse = await fetch(existenceUrl);
            const existenceResults = await existenceResponse.json();

            // Error guard
            if (existenceResults.error) throw new Error(existenceResults.error);

            // On 'connection' - socket to join lobby
            return await SocketService.joinLobby(request);
        } catch (error) {
            throw new Error(`joinLobby error: ${error}`);
        }
    }

    

    static doesLobbyExist = async (request) => {
        // Build the endpoint
        const callpointBase = SERVER_ENDPOINT + API_ENDPOINT + 'isValid';
        const callpoint = callpointBase + '?lobbyCode=' + request.lobbyCode;
        // GET request to check if lobby is valid
        const response = await fetch(callpoint);

        return await response.json();
    }
}