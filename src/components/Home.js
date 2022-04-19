import '../styles/Home.scss';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

function Home() {
    const onClickJoin = () => {
        console.log('join');
    };

    const onClickCreate = () => {
        console.log('create');
    };

    return (
        <div className='page-container'>
            <main>
                <Stack
                    direction='column'
                    spacing={2}
                >
                    <h1 id='title'>JUDGEMENT CALL</h1>
                    <TextField 
                        fullWidth
                        className='text-field'
                        id="input-name" 
                        label="Name" 
                        variant="outlined" 
                        margin="normal"
                    />
                    <TextField 
                        fullWidth
                        className='text-field'
                        id="input-code" 
                        label="Room Code (Optional)" 
                        variant="outlined" 
                        margin="normal"
                    />
                    <Stack 
                        spacing={2}
                        direction='row'
                        justifyContent='center'
                    >
                        <Button 
                            variant="contained"
                            color="secondary"
                            onClick={onClickCreate}>
                            New Game
                        </Button>
                        <Button 
                            variant="outlined"
                            color="secondary"
                            onClick={onClickJoin}>
                            Join Game
                        </Button>
                    </Stack>
                </Stack>
            </main>
        </div>
    )
}

export default Home;