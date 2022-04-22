import '../styles/Loading.scss';
import PageContainer from './PageContainer';
import Stack from '@mui/material/Stack';
import { ThreeDots } from 'react-loading-icons';
import { useEffect } from 'react';
import { LobbyService } from '../services/LobbyService';
import { GameStates } from '../constants/GameStates';

function Loading(props) {
    const isClientHost = props.clientInfo.isClientHost;
    const playerName = props.clientInfo.playerName;
    const joinLobbyCode = props.clientInfo.joinLobbyCode;

    // Overall lobby state 
    const setLobbyStateCallback = props.setLobbyStateCallback;
    // Setting lobby players
    const setLobbyPlayersCallback = props.setLobbyPlayersCallback;
    // Setting the `readyStatus` object of the lobby
    const setLobbyReadyStatusCallback = props.setLobbyReadyStatusCallback;
    // Setting the game state after load
    const setGameStateCallback = props.setGameStateCallback;
    // Setting the player of the client
    const setClientPlayerCallback = props.setClientPlayerCallback;
    // Setting whether or not the client is the 'host'
    const setClientHostCallback = props.setClientHostCallback;
    // Setting the lobby code
    const setLobbyCodeCallback = props.setLobbyCodeCallback;
    // Set page director
    const setPageCallback = props.setPageCallback;

    // ASYNC HELPERS
    const connectToLobby = async (request) => {
        const lobbyResponse = (isClientHost) 
            ? await LobbyService.createLobby(request) 
            : await LobbyService.joinLobby(request);

        setLobbyStateCallback(lobbyResponse.lobby);
        setClientPlayerCallback(lobbyResponse.clientPlayer);
        setLobbyCodeCallback(lobbyResponse.lobby.lobbyCode);

        // Direct user to `lobby`
        setPageCallback('lobby');
    };

    useEffect(() => {
        // Build request
        const request = {
            playerName: playerName,
            lobbyCode: joinLobbyCode
        }

        // Set 'LOBBY' game state
        setGameStateCallback(GameStates.LOADING);
        connectToLobby(request);
    }, []);

    return (
        <PageContainer>
            <Stack spacing={2} direction='column' alignItems={'center'}>
                <ThreeDots />
            </Stack>
        </PageContainer>
    );
}

export default Loading;