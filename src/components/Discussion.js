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
import DialogContentText from '@mui/material/DialogContentText';
import TextField from '@mui/material/TextField';
import { useState } from 'react';

function Discussion(props) {
    // TODO: Handle ready
    const onClickReady = async (e) => {
        console.log('ready');
    }

    // dialog state
    const [dialogOpen, setDialogOpen] = useState(false);

    // col state
    const [activeCol, setActiveCol] = useState(null);

    // onDialogOpen
    const onDialogOpen = (col) => {
        console.log('Opening dialog with col ' + col);
        setActiveCol(col);
        setDialogOpen(true);
    }

    // TODO: Handle dialog entry
    const onDialogClose = () => {
        const data = document.getElementById('textfield').value;
        const col = activeCol;
        console.log(col, data);
        setDialogOpen(false);
    }

    // TODO: Get real props from server
    props = {
        stakeholderTitle: 'Stakeholder Title',
        review: 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
        rating: 3,
        data: {
            benefits: ['lorem', 'ipsum', 'dolor'],
            harms: ['lorem', 'ipsum', 'dolor'],
            themes: ['lorem', 'ipsum', 'dolor'],
        }
    }

    return (
        <>
            <PageContainer>
                <Stack spacing={2} direction='column'>
                    <Header title='DISCUSSION' />
                    <Review stakeholderTitle={props.stakeholderTitle} review={props.review} rating={props.rating}/>
                    <Table data={props.data} onOpenDialog={onDialogOpen}/>
                    <Button 
                        variant="contained"
                        color="secondary"
                        onClick={onClickReady}>
                        Ready
                    </Button>
                </Stack>
            </PageContainer>
            <Dialog open={dialogOpen} onClose={onDialogClose}>
                <DialogTitle>Add a {activeCol.substring(0, activeCol.length - 1)}</DialogTitle>
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