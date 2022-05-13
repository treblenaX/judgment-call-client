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
    // const [isLoaded, setLoaded] = useState(false);

    // ASYNC HELPERS
    const connectToLobby = async (request) => {
        console.log('connecting to lobby...');
        const callbacks = {
            main: lobbyStateCallbacks,
            client: setClientPlayerCallback
        }

        const lobbyResponse = (isClientHost) 
            ? await LobbyService.createLobby(request, setErrorStateCallback, callbacks) 
            : await LobbyService.joinLobby(request, setErrorStateCallback, callbacks);
        console.log('lobby connected.');

        // setClientPlayerCallback(lobbyResponse.clientPlayer);
        setLobbyCodeCallback(lobbyResponse.lobby.lobbyCode);
        // setGameStateCallback(GameStates.LOBBY);
    };

    useEffect(() => {
        // console.log(isLoaded);
        // if (!isLoaded) {
            console.log('requesting..');
            console.log('hi');
            // Build request
            const request = {
                playerName: playerName,
                lobbyCode: joinLobbyCode
            }
    
            connectToLobby(request).then(() => setPageCallback('lobby'));
        // } else {
        //     console.log('loading', 'data loded!')
        //     // Direct user to `lobby`
        //     setPageCallback('lobby');
        // }
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