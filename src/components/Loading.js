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

    // Loading state
    const [isLoaded, setLoaded] = useState(false);

    // ASYNC HELPERS
    const connectToLobby = async (request) => {
        const lobbyResponse = (isClientHost) 
            ? await LobbyService.createLobby(request) 
            : await LobbyService.joinLobby(request);

        setClientPlayerCallback(lobbyResponse.clientPlayer);
        setLobbyCodeCallback(lobbyResponse.lobby.lobbyCode);

        // Listen for lobby state refresh
    
        SocketService.lobbyRefreshListener(lobbyStateCallbacks, setClientPlayerCallback, setLoaded);
        SocketService.errorListener(console.log);
        // setGameStateCallback(GameStates.LOBBY);
    };

    useEffect(() => {
        if (!isLoaded) {
            // Build request
            const request = {
                playerName: playerName,
                lobbyCode: joinLobbyCode
            }
    
            connectToLobby(request);
        } else {
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