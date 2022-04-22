import '../styles/Lobby.scss';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { LobbyService } from '../services/LobbyService.js';
import { SocketService } from '../services/SocketService.js';
import { GameStates } from '../constants/GameStates';

function Lobby(props) {
    const playerName = props.playerName;
    const isClientHost = props.isClientHost;
    const joinLobbyCode = props.joinLobbyCode;
    const lobbyPlayers = props.lobbyPlayers;

    const setLobbyPlayersCallback = props.setLobbyPlayersCallback;
    const setLobbyReadyStatusCallback = props.setLobbyReadyStatusCallback;
    const setGameStateCallback = props.setGameStateCallback;
    const setLoadingCallback = props.setLoadingCallback;    //@TODO: create loading state

    let initLoad = true;

    // Lobby data
    const [lobbyState, setLobbyState] = useState(null);
    const [clientPlayer, setClientPlayer] = useState(null);
    const [lobbyCode, setLobbyCode] = useState(null);

    // ASYNC HELPERS
    const connectToLobby = async (request) => {
        if (initLoad) { // To prevent multiple loads
            initLoad = false;
            if (isClientHost) {
                const lobbyResponse = await LobbyService.createLobby(request);
                setLobbyState(lobbyResponse.lobby);
                setClientPlayer(lobbyResponse.clientPlayer);
                setLobbyCode(lobbyResponse.lobby.lobbyCode);
            } else {
                const lobbyResponse = await LobbyService.joinLobby(request);
                setLobbyState(lobbyResponse.lobby);
                setClientPlayer(lobbyResponse.clientPlayer);
                setLobbyCode(lobbyResponse.lobby.lobbyCode);
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

            // Set 'LOBBY' game state
            setGameStateCallback(GameStates.LOBBY);
            connectToLobby(request);
        } else {
            // Refresh data load
            setLobbyPlayersCallback(lobbyState.players);
            setLobbyReadyStatusCallback(lobbyState.readyStatus);

            // Listen for lobby state refresh
            SocketService.lobbyRefreshListener(setLobbyState, setClientPlayer);
            // @TODO: Alan replace this w/ `setErrorState`
            SocketService.errorListener(console.log);
        }
    }, [lobbyState]);   // RERUNS - when lobby state needs to refresh

    // TODO: Handle ready up click
    const onClickReady = async (e) => {
        // Build request
        const request = {
            lobbyCode: lobbyCode,
            pId: clientPlayer.pId,
            readyState: !clientPlayer.readyState
        }

        // Send socket request
        SocketService.togglePlayerReady(request);

        // Change local client player ready status on success
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
                const playerReady = players[i].readyState;

                const readyText = (playerReady) ? 'READY' : 'NOT READY';

                // Show connected player - @TODO: Handle ready state text
                arr.push(
                    <div key={i}>
                        <h3 className='player-name'>{playerName + ' ' + readyText}</h3>
                    </div>
                );
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