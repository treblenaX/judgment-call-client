import '../styles/Mitigation.scss';
import React from 'react';
import PageContainer from './PageContainer';
import Header from './Header';
import TextAreaModule from './TextAreaModule';
import Stack from '@mui/material/Stack';
import { SocketService } from '../services/SocketService';
import { useEffect } from 'react';
import { GameInstructions } from '../constants/GameInstructions';
import { Box, Button, Dialog, DialogContent, DialogContentText, DialogTitle, Modal, Typography } from '@mui/material';

const instructionText = `
    How could the product be changed to prevent these
    problems?
`;

function Mitigation(props) {
    const clientPlayer = props.clientPlayer;
    const lobbyPlayers = props.lobbyPlayers;
    const lobbyStateCallbacks = props.lobbyStateCallbacks;
    const setPageCallback = props.setPageCallback;
    const setClientPlayerCallback = props.setClientPlayerCallback;
    const setErrorStateCallback = props.setErrorStateCallback;

    const dialogData = lobbyPlayers.map(player => {
        const cards = player.cards;
        const review = player.data.review;
        const discussionData = player.data.discussion;

        const data = {
            review: review,
            playerName: player.playerName,
            stakeholder: cards.stakeholder.name,
            principle: cards.principle.name,
            rating: cards.rating.name,
            benefits: discussionData.benefits,
            harms: discussionData.harms,
            themes: discussionData.themes
        }

        return (<div className="dialog-item"><DataDialog payload={data} /></div>);
    });

    const onClickInstructions = () => {
        alert(GameInstructions.MITIGATION);
    }
    const onClickScenarioDetails = () => { 
        const scenario = clientPlayer.cards.scenario;

        alert(
            `${scenario.name}

            ${scenario.description}
            `
        );
    }

    const submitCallback = (data) => {
        // Build request
        const request = {
            lobbyCode: clientPlayer.lobbyCode,
            pId: clientPlayer.pId,
            mitigation: data,
            readyState: !clientPlayer.readyState
        }

        // Send the request
        SocketService.sendMitigation(request);
    }

    useEffect(() => {
        // Listen for errors
        SocketService.errorListener(setErrorStateCallback);
        // Listen for refresh and next phase start
        SocketService.lobbyRefreshListener(lobbyStateCallbacks, setClientPlayerCallback);
        SocketService.startJudgmentCallListener(lobbyStateCallbacks, setPageCallback, clientPlayer);
    }, [])

    return (
        <PageContainer>
            <Stack spacing={2} direction='column'>
                <Header title='MITIGATION' />
                <p>Choose one stakeholder, benefit, harm, or theme that stood out
    in the discussion. </p>
                <div className="dialog-container">
                    {
                        dialogData
                    }
                </div>
                <TextAreaModule
                    readyState={clientPlayer.readyState}
                    label={instructionText}
                    submitCallback={submitCallback}
                />
                <Button 
                    variant="outlined"
                    color="secondary"
                    onClick={onClickInstructions}>
                    Instructions
                </Button>
                <Button 
                    variant="text"
                    color="secondary"
                    onClick={onClickScenarioDetails}>
                    Scenario Details
                </Button>
            </Stack>
        </PageContainer>
    )
}

function DataDialog(props) {
    const data = props.payload;
    const [open, setOpen] = React.useState(false);
    const [scroll, setScroll] = React.useState('paper');

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const arrayToHTML = (array) => {
        return array.map((data, index) => <li key={index}> {data}</li>);
    }

    return (
        <div>
        <Button onClick={handleOpen}>Open {data.playerName} Summary</Button>
        <Dialog
            open={open}
            onClose={handleClose}
            scroll={'paper'}
        >
            <DialogTitle>Player: {data.playerName}</DialogTitle>
            <DialogContent dividers={scroll === 'paper'}>
                <DialogContentText>
                    <div className="modal-row">
                        <h3>Player: {data.playerName}</h3> 
                    </div>
                    <div className="modal-row">
                        <h3>Stakeholder: {data.stakeholder}</h3>
                    </div>
                    <div className="modal-row">
                        <h3>Principle: {data.principle}</h3>
                    </div>
                    <div className="modal-row">
                        <h3>Rating: {data.rating}/5</h3>
                    </div>
                    <div className="modal-row">
                        <h3>Review: </h3> {data.review}
                    </div>
                    <div className="modal-row">
                        Benefits:
                        <ul>
                            {arrayToHTML(data.benefits)}
                        </ul>
                    </div>
                    <div className="modal-row">
                        Harms:
                        <ul>
                            {arrayToHTML(data.harms)}
                        </ul>
                    </div>
                    <div className="modal-row">
                        Themes:
                        <ul>
                            {arrayToHTML(data.themes)}
                        </ul>
                    </div>
                </DialogContentText>
            </DialogContent>
          </Dialog>
        </div>
      );
}

export default Mitigation;