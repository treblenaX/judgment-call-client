import '../styles/Loading.scss';
import PageContainer from './PageContainer';
import Stack from '@mui/material/Stack';
import { ThreeDots } from 'react-loading-icons';
import { useEffect, useState } from 'react';
import { LobbyService } from '../services/LobbyService';
import { GameStates } from '../constants/GameStates';
import { SocketService } from '../services/SocketService';

function Loading(props) {
    const isClientHost = props.clientInfo.isClientHost;
    const playerName = props.clientInfo.playerName;
    const joinLobbyCode = props.clientInfo.joinLobbyCode;

    // Overall lobby state 
    const lobbyStateCallbacks = props.lobbyStateCallbacks;
    // Setting the player of the client
    const setClientPlayerCallback = props.setClientPlayerCallback;
    // Setting whether or not the client is the 'host'
    const setClientHostCallback = props.setClientHostCallback;
    // Setting the lobby code
    const setLobbyCodeCallback = props.setLobbyCodeCallback;
    // Set page director
    const setPageCallback = props.setPageCallback;
    // Set state of the game to redirect the page
    const setGameStateCallback = props.setGameStateCallback;
    const setErrorStateCallback = props.setErrorStateCallback;

    // Loading state
    const [isLoaded, setLoaded] = useState(false);

    // ASYNC HELPERS
    const connectToLobby = async (request) => {
        const callbacks = {
            main: lobbyStateCallbacks,
            client: setClientPlayerCallback,
            loaded: setLoaded
        }

        const lobbyResponse = (isClientHost) 
            ? await LobbyService.createLobby(request, setErrorStateCallback, callbacks) 
            : await LobbyService.joinLobby(request, setErrorStateCallback, callbacks);

        // setClientPlayerCallback(lobbyResponse.clientPlayer);
        setLobbyCodeCallback(lobbyResponse.lobby.lobbyCode);
        // setGameStateCallback(GameStates.LOBBY);
    };

    useEffect(() => {
        if (!isLoaded) {
            console.log('requesting..');
            // Build request
            const request = {
                playerName: playerName,
                lobbyCode: joinLobbyCode
            }
    
            connectToLobby(request);
        } else {
            console.log('loading', 'data loded!')
            // Direct user to `lobby`
            setPageCallback('lobby');
        }
    }, [isLoaded]);

    return (
        <PageContainer>
            <Stack spacing={2} direction='column' alignItems={'center'}>
                <ThreeDots />
            </Stack>
        </PageContainer>
    );
}

export default Loading;