import '../styles/Lobby.scss';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import PageContainer from './PageContainer';
import { useEffect, useState } from 'react';
import { LobbyService } from '../services/LobbyService.js';
import { SocketService } from '../services/SocketService.js';
import { GameStates } from '../constants/GameStates';

function Lobby(props) {
    const lobbyPlayers = props.lobbyPlayers;

    const lobbyState = props.lobbyState;
    const clientPlayer = props.clientPlayer;
    const lobbyCode = props.lobbyCode;

    const setPageCallback = props.setPageCallback;
    const lobbyStateCallbacks = props.lobbyStateCallbacks;
    const setClientPlayerCallback = props.setClientPlayerCallback;
    const setGameStateCallback = lobbyStateCallbacks.setGameState;
    const setErrorStateCallback = props.setErrorStateCallback;

    useEffect(() => {
        // Set Game state to LOBBY on lobby page
        setGameStateCallback(GameStates.LOBBY);
        // Listen for lobby state refresh
        SocketService.lobbyRefreshListener(lobbyStateCallbacks, setClientPlayerCallback);
        // Listen for errors
        SocketService.errorListener(setErrorStateCallback);
        // Listen for the game start
        SocketService.startDealListener(lobbyStateCallbacks, setPageCallback, clientPlayer);
        // Discussion stuff
        SocketService.startDiscussionListener(lobbyStateCallbacks, setPageCallback);
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
        <PageContainer>
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
        </PageContainer>
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