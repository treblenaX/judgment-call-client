import { useEffect, useState } from "react";
import socketIOClient from 'socket.io-client';
import { closeSocketConnection, createSocketConnection, initLobbyState, readyUpPlayer, refreshLobbyInfo, requestLobbyCode, sendLobbyMessage, socket, verifySocketConnection, waitForLobbyInfo } from "../services/socket";
import PlayerListComponent from "./PlayerListComponent";

const ENDPOINT = 'http://localhost:3000';

export default function LobbyComponent(props) {
    const player = props.player;
    const joinCode = props.joinCode;
    const isHost = props.isHost;

    const [connectedToLobby, setConnectedToLobby] = useState(false);
    const [lobbyCode, setLobbyCode] = useState(null);
    const [isReady, setReady] = useState(false);
    const [readyStateLock, setReadyStateLock] = useState(false);

    // Lobby states
    const [lobbyPlayers, setLobbyPlayers] = useState([{ test: 'test' }]);

    /**
     * Connects to the server socket and then gets the lobby code
     * @returns { connected: boolean, lCode: string | the lobby code}
     */
    async function connectToLobby() {
        return new Promise(async (resolve) => {
            const request = {
                player: player,
                isHost: isHost,
                joinCode: joinCode
            }
            
            await createSocketConnection();
            const lCode = await requestLobbyCode(request);

            setLobbyCode(lCode);

            resolve({ connected: await initLobbyState(lCode), lCode: lCode });
        });
    }

    async function handleLobbyInformation(connected, lCode) {
        return new Promise(async (resolve) => {
            if (!connected) {
                console.log('not connected to a lobby');
            } else {
                const players = await waitForLobbyInfo(lCode);
                setLobbyPlayers(players);

                resolve();
            }
        });
    }

    async function handleConnection() {
        connectToLobby()
            .then(async (payload) => {
                await handleLobbyInformation(payload.connected, payload.lCode);
                await refreshLobbyInfo(setLobbyPlayers);
            });
    }

    async function handleReady() {
        if (!readyStateLock) {     
            setReadyStateLock(true);
            const client = lobbyPlayers.find((p) => player === p.playerName);

            await readyUpPlayer(lobbyCode, setReady, !isReady);

            // Lock to prevent spamming
            setTimeout(() => {
                setReadyStateLock(false);
            }, 1000);
        }
    }

    useEffect(() => {
        handleConnection();

        return () => closeSocketConnection();
    }, []);
    
    return (
        <div className="lobby-container">
            <h2>
                Lobby Code: { lobbyCode }
            </h2>
            <button type="button" onClick={ () => handleReady() }>Ready up!</button>
            <div className="player-list-container">
                <PlayerListComponent client={ { client: player, isReady: isReady } } lobbyPlayers={ lobbyPlayers } />
            </div>
        </div>
    );
}