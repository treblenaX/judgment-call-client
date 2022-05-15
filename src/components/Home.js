import '../styles/Home.scss';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import PageContainer from './PageContainer';
import { LobbyService } from '../services/LobbyService.js';
import { GameStates } from '../constants/GameStates';
import { useEffect } from 'react';

function Home(props) {
    const setErrorStateCallback = props.setErrorStateCallback;
    const setPageCallback = props.setPageCallback;
    const setPlayerNameCallback = props.setPlayerNameCallback;
    const setClientHostCallback = props.setClientHostCallback;
    const setJoinLobbyCodeCallback = props.setJoinLobbyCodeCallback;
    const setGameStateCallback = props.setGameStateCallback;

    const onClickJoin = async (e) => {
        const name = document.getElementById('input-name').value;
        const code = document.getElementById('input-code').value;

        try {
            // Build request
            const request = {
                lobbyCode: code
            };
            // Verify lobby code
            const isValidLobby = await LobbyService.doesLobbyExist(request, setErrorStateCallback);

            // After successful response - setPage to 'lobby'
            if (isValidLobby) {
                setPlayerNameCallback(name);
                setJoinLobbyCodeCallback(request.lobbyCode);
                setClientHostCallback(false);
                // Send user to loading page
                setPageCallback('loading');
                setGameStateCallback(GameStates.LOADING);
            } else {
                throw new Error('Lobby is not valid.');
            }
        } catch (error) {
            setErrorStateCallback(error);
        }
    };

    const onClickCreate = async (e) => {
        const name = document.getElementById('input-name').value;

        try {
            // Handshake attempt with server
            const isAlive = await LobbyService.isAPIAlive(setErrorStateCallback);

            // After successful response - setPage to 'lobby'
            if (isAlive) {
                setPlayerNameCallback(name);
                setClientHostCallback(true);
                // Send user to loading page
                setPageCallback('loading');
                setGameStateCallback(GameStates.LOADING);
            } else {
                throw new Error('Server connection error.');
            }
        } catch (error) {
            setErrorStateCallback(error);
        }
    }

    return (
        <PageContainer>
            <Stack direction='column' spacing={2}>
                <h1 id='title'>JUDGMENT CALL</h1>
                <p>
                    You'll be playing the game with a minimum of 4 players and a maximum of 6 players.
                </p>
                <p>
                    Please note: This is the very first prototype of an online adaptation of Judgment Call. If there's ever any errors. Please refresh and restart the whole game.</p>
                <TextField 
                    required
                    fullWidth
                    className='text-field'
                    id="input-name" 
                    label="Name" 
                    variant="outlined" 
                    margin="normal" />
                <TextField 
                    fullWidth
                    className='text-field'
                    id="input-code" 
                    label="Room Code (Optional)" 
                    variant="outlined" 
                    margin="normal" />
                <Stack spacing={2} direction='row' justifyContent='center'>
                    <Button 
                        variant="contained"
                        color="secondary"
                        onClick={onClickCreate}>
                        Create Lobby
                    </Button>
                    <Button 
                        variant="outlined"
                        color="secondary"
                        onClick={onClickJoin}>
                        Join Lobby
                    </Button>
                </Stack>
            </Stack>
        </PageContainer>
    )
}

export default Home;