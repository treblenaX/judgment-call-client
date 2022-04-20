import '../styles/Lobby.scss';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { LobbyService } from '../services/LobbyService.js';
import { SocketService } from '../services/SocketService.js';

function Lobby(props) {
    const playerName = props.playerName;
    const isClientHost = props.isClientHost;
    const joinLobbyCode = props.joinLobbyCode;

    let initLoad = true;

    // Lobby data
    const [lobbyState, setLobbyState] = useState(null);
    const [clientPlayer, setClientPlayer] = useState(null);
    const [lobbyPlayers, setLobbyPlayers] = useState(null);
    const [lobbyCode, setLobbyCode] = useState(null);

    // ASYNC HELPERS
    const connectToLobby = async (request) => {
        if (initLoad) { // To prevent multiple loads
            initLoad = false;
            if (isClientHost) {
                const lobbyResponse = await LobbyService.createLobby(request);
                setLobbyState(lobbyResponse.lobby);
                setClientPlayer(lobbyResponse.clientPlayer);
            } else {
                const lobbyResponse = await LobbyService.joinLobby(request);
                setLobbyState(lobbyResponse.lobby);
                setClientPlayer(lobbyResponse.clientPlayer);
            }
        }
    };

    useEffect(() => {
        if (!lobbyState) {  // INIT lobby state - first connection
            // Build request
            const request = {
                playerName: playerName,
                lobbyCode: joinLobbyCode
            }

            connectToLobby(request);
        } else {
            // Refresh data load
            setLobbyCode(lobbyState.lobbyCode);
            setLobbyPlayers(lobbyState.players);

            // Listen for lobby state refresh
            SocketService.lobbyRefreshListener(setLobbyState);
        }
    }, [lobbyState]);

    // TODO: Handle ready up click
    const onClickReady = (e) => {
        console.log(lobbyPlayers);
    };

    return (
        <div className='page-container'>
            <main>
                <Stack direction='column' spacing={2}>
                    <h1 id='title'>LOBBY <span id='code'>#{lobbyCode}</span></h1>
                    <Divider/>
                    <PlayerList lobbyPlayers={lobbyPlayers}/>
                    <Divider/>
                    <Button 
                        variant="contained"
                        color="secondary"
                        onClick={onClickReady}>
                        Ready
                    </Button>
                </Stack>
            </main>
        </div>
    );
}

function PlayerList(props) {
    const lobbyPlayers = props.lobbyPlayers;
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        // Update player elements based on changes of lobbyPlayers
        setPlayers(lobbyPlayers);
    }, [lobbyPlayers])  // Rerun - when lobbyPlayers refreshes


    const buildPlayerElements = (players) => {
        const arr = [];
        for (let i = 0; i < 6; i++) {
            if (players && i < players.length) { // if finally connected
                const playerName = players[i].playerName;

                // Show connected player
                arr.push(<h3 key={i} className='player-name'>{playerName}</h3>);
            } else {
                // Show empty spot
                arr.push(<h3 key={i} className='player-name-placeholder'>None</h3>);
            }
        }

        return arr;
    }

    return (
        <div>
            {buildPlayerElements(players)}
        </div>
    )
}

export default Lobby;