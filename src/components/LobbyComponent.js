import { useEffect, useState } from "react";
import socketIOClient from 'socket.io-client';
import { closeSocketConnection, createSocketConnection, initLobbyState, refreshLobbyInfo, requestLobbyCode, sendLobbyMessage, socket, verifySocketConnection, waitForLobbyInfo } from "../services/socket";
import PlayerListComponent from "./PlayerListComponent";

const ENDPOINT = 'http://localhost:3000';

export default function LobbyComponent(props) {
    const player = props.player;
    const joinCode = props.joinCode;
    const isHost = props.isHost;

    const [connectedToLobby, setConnectedToLobby] = useState(false);
    const [lobbyCode, setLobbyCode] = useState(null);

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
                console.log(players);
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

    useEffect(() => {
        handleConnection();

        // return () => closeSocketConnection();
    }, []);
    
    return (
        <div>
            <h2>
                Lobby Code: {lobbyCode}
            </h2>
            <div>
                <PlayerListComponent lobbyPlayers={lobbyPlayers} />
            </div>
        </div>
    );
}