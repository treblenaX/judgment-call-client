import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { SocketService } from "../services/SocketService";
import PlayerListComponent from "./PlayerListComponent";

const ENDPOINT = 'http://localhost:3000';

export default function LobbyComponent(props) {
    const player = props.player;
    const joinCode = props.joinCode;
    const isHost = props.isHost;

    const [lobbyCode, setLobbyCode] = useState(null);
    const [isReady, setReady] = useState(false);
    const [readyStateLock, setReadyStateLock] = useState(false);

    // Loading states
    const [isLoading, setLoading] = useState(true);

    // Lobby states
    const [lobbyPlayers, setLobbyPlayers] = useState([]);

    /** Server async functions */
    async function initLobbyConnection() {
        // Socket should already be connected
        const connectionRequest = {
            player: player,
            isHost: isHost,
            joinCode: joinCode
        }
        // No matter create or join - get the LOBBY CODE
        const lobbyResponse = await SocketService.connectToLobby(connectionRequest);
        // Set the lobby code
        setLobbyCode(lobbyResponse.lCode);

        // Update the lobby information
        const lobbyInfoResponse = await SocketService.updateLobbyInformation(lobbyResponse.lCode);
        // Set the players
        setLobbyPlayers(lobbyInfoResponse);

        // LOADING is done
        setLoading(false);
    }

    useEffect(() => {
        // Init lobby connection 
        initLobbyConnection();

        // LISTEN - for lobby infromation refresh
        SocketService.refreshLobbyInformation(setLobbyPlayers);
        // return () => closeSocketConnection();
    }, []);

    /** Click handlers */
    async function handleReady() {
        if (!readyStateLock) {     
            // Turn on lock to prevent spamming
            setReadyStateLock(true);

            const request = {
                lobbyCode: lobbyCode,
                readyState: !isReady
            }

            // Update server ready status
            const readyStatus = await SocketService.emitReadyStatus(request);

            // Set ready status
            setReady(readyStatus);

            setTimeout(() => {
                // Turn off lock
                setReadyStateLock(false);
            }, 1000);
        }
    }
    
    return (
        <div className="lobby-container">
            {
                isLoading
                    ?  
                    <div>Loading lobby details... <FontAwesomeIcon spin={ true } icon={ faSpinner } /></div>
                    :
                    <div>
                        <h2>
                            Lobby Code: { lobbyCode }
                        </h2>
                        <button type="button" onClick={ () => handleReady() }>Ready up!</button>
                        <div className="player-list-container">
                            <PlayerListComponent client={ { client: player, isReady: isReady } } lobbyPlayers={ lobbyPlayers } />
                        </div>
                    </div>
                }
        </div>
    );
}