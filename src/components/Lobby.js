import '../styles/Lobby.scss';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';

function Lobby(props) {
    // TODO: Handle ready up click
    const onClickReady = (e) => {
        console.log('ready');
    };

    return (
        <div className='page-container'>
            <main>
                <Stack direction='column' spacing={2}>
                    <h1 id='title'>LOBBY <span id='code'>#123456</span></h1>
                    <Divider/>
                    {/* TODO: Replace with real players */}
                    <PlayerList players={null}/>
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

function PlayerList(players) {
    // TODO: Replace this with players from props
    const playerElements = ['Alan', 'Elbert', 'Nate', 'James', null, null].map((player, i) => {
        if (player) {
            return (
                <h3 key={i} className='player-name'>{player}</h3>
            )
        }
        return (
            <h3 key={i} className='player-name-placeholder'>None</h3>
        )
    });

    return (
        <div>
            {playerElements}
        </div>
    )
}

export default Lobby;