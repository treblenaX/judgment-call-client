import '../styles/Discussion.scss';
import Header from './Header';
import PageContainer from './PageContainer';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { SocketService } from '../services/SocketService';

function Discussion(props) {
    const clientPlayer = props.clientPlayer;
    const focusPlayer = props.focusPlayer;
    const lobbyStateCallbacks = props.lobbyStateCallbacks;
    const setPageCallback = props.setPageCallback;

    // ui state
    const [dialogOpen, setDialogOpen] = useState(false);
    const [activeCol, setActiveCol] = useState(null);

    useState(() => {
        // Listen for lobby state refresh
        SocketService.lobbyRefreshListener(lobbyStateCallbacks);

        SocketService.startMitigationListener(lobbyStateCallbacks, setPageCallback);
    }, []);

    // TODO: Handle ready
    const onClickReady = async (e) => {
        // Build request
        const request = {
            lobbyCode: clientPlayer.lobbyCode,
            pId: clientPlayer.pId,
            readyState: !clientPlayer.readyState
        }

        // Send socket request
        SocketService.toggleDiscussionReady(request);
    }
    
    // onDialogOpen
    const onDialogOpen = (col) => {
        // console.log('Opening dialog with col ' + col);
        setActiveCol(col);
        setDialogOpen(true);
    }

    // TODO: Handle dialog entry
    const onDialogClose = () => {
        const val = document.getElementById('textfield').value;
        const col = activeCol;

        // Send update to server
        const request = {
            lobbyCode: clientPlayer.lobbyCode,
            col: col,
            val: val
        }
        SocketService.updateDiscussionData(request);

        setDialogOpen(false);
    }

    return (
        <>
            <PageContainer>
                <Stack spacing={2} direction='column'>
                    <Header title='DISCUSSION' />
                    <Review stakeholderTitle={focusPlayer.stakeholder.name} review={focusPlayer.review} rating={focusPlayer.rating.name}/>
                    <Table data={focusPlayer.data} onOpenDialog={onDialogOpen}/>
                    {   !clientPlayer.readyState
                        ? <Button 
                            variant="contained"
                            color="secondary"
                            onClick={onClickReady}>
                            Ready
                        </Button>
                        : <Button 
                            variant="primary"
                            color="secondary"
                            onClick={onClickReady}>
                            Unready
                        </Button>
                    }
                </Stack>
            </PageContainer>
            <Dialog open={dialogOpen} onClose={onDialogClose}>
                <DialogTitle>Add a {activeCol ? activeCol.substring(0, activeCol.length - 1) : 'null'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="textfield"
                        multiline
                        rows={3}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onDialogClose}>Submit</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

function Review(props) {
    const stakeholderTitle = props.stakeholderTitle;
    const review = props.review;
    return (
        <Stack spacing={2} direction='column' alignItems={'center'}>
            <h2 className='stakeholder-title'>{stakeholderTitle}</h2>
            <Rating
                name="rating"
                value={props.rating}
                readOnly
            />
            <div className='review'>{review}</div>  
        </Stack>
    );
}

function Table(props) {
    const cols = [];
    // console.log(props.data);
    for (let col in props.data) {
        cols.push(<TableColumn onOpenDialog={props.onOpenDialog} name={col} items={props.data[col]} />);
    }

    return (
        <Stack justifyContent='center' spacing={2} divider={<Divider orientation='vertical' flexItem />} direction='row'>
            {cols}
        </Stack>
    );
}

function TableColumn(props) {
    const items = props.items;

    const onAddClicked = (e) => {
        const col = e.target.getAttribute('col-name');
        props.onOpenDialog(col);
    }

    return (
        <Stack spacing={2} direction='column'>
            <h3 className='column-name'>{props.name.toUpperCase()}</h3>
            {items.map((item, index) => {
                return <div key={index}>{item}</div>
            })}
            <Button onClick={onAddClicked} col-name={props.name} variant='text' color='secondary'>+ ADD</Button>
        </Stack>
    );
}

export default Discussion;