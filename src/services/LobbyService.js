import { ENDPOINT } from '../App.js';
import { SocketHandler } from './socket.js';
import { SocketService } from './SocketService.js';

const API_ENDPOINT = '/api/lobby/';

export class LobbyService {
    /**
     * Requests to the server to create a lobby
     * @param {*} request 
     * @returns {
     *  lobbyCode: string
     * }
     */
    static createLobby = async (request) => {
        try {
            // Build the endpoint
            const callpoint = ENDPOINT + API_ENDPOINT + 'createLobby';
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
            return await SocketHandler.joinLobby(newRequest);
        } catch (error) {
            return error;
        }
    }

    static joinLobby = async (request) => {
        try {
            const baseUrl = ENDPOINT + API_ENDPOINT;
            // Check if the lobby exists
            const existenceUrl = baseUrl + 'isValid?lobbyCode=' + request.lobbyCode;

            const existenceResponse = await fetch(existenceUrl);
            const existenceResults = await existenceResponse.json();

            // Error guard
            if (existenceResults.error) throw new Error(existenceResults.error);

            // On 'connection' - socket to join lobby
            return await SocketHandler.joinLobby(request);
        } catch (error) {
            return error;
        }
    }

    

    static doesLobbyExist = async (request) => {
        // Build the endpoint
        const callpointBase = ENDPOINT + API_ENDPOINT + 'isValid';
        const callpoint = callpointBase + '?lobbyCode=' + request.lobbyCode;
        // GET request to check if lobby is valid
        const response = await fetch(callpoint, {
            method: 'GET'
        })

        return await response.json();
    }
}