import '../styles/Home.scss';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import PageContainer from './PageContainer';
import { LobbyService } from '../services/LobbyService.js';
import { GameStates } from '../constants/GameStates';

function Home(props) {
    const setPageCallback = props.setPageCallback;
    const setPlayerNameCallback = props.setPlayerNameCallback;
    const setClientHostCallback = props.setClientHostCallback;
    const setJoinLobbyCodeCallback = props.setJoinLobbyCodeCallback;
    const setGameStateCallback = props.setGameStateCallback;

    let initLoad = true;    // To prevent multiple calls @TODO handle better

    // TODO: Handle join click
    const onClickJoin = async (e) => {
        const name = document.getElementById('input-name').value;
        const code = document.getElementById('input-code').value;

        try {
            initLoad = false;
            // Build request
            const request = {
                lobbyCode: code
            };

            // Verify lobby code
            const isValidLobby = await LobbyService.doesLobbyExist(request);

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
            // @TODO: error handling
            console.log(error);
        }
    };

    const onClickCreate = async (e) => {
        const name = document.getElementById('input-name').value;

        if (initLoad) {
            try {
                initLoad = false;
                // Handshake attempt with server
                const isAlive = await LobbyService.isAPIAlive();
    
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
                initLoad = true;
                // @TODO: error handling
                console.log(error);
            }
        }
    };

    return (
        <PageContainer>
            <Stack direction='column' spacing={2}>
                <h1 id='title'>JUDGMENT CALL</h1>
                <p>
                    You'll be playing the game with a minimum of 4 players and a maximum of 6 players.
                </p>
                <p>
                    Be careful of these known bugs:</p>
                    <ul>
                        <li>Create Lobby/Join Lobby stuck on loading screen.</li>
                            <p>The loading shouldn't take more than 30 seconds. Please refresh and try again and keep doing that until it works.</p>
                    </ul>
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