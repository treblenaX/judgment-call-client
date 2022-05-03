import '../styles/Scenario.scss';
import PageContainer from './PageContainer';
import Header from './Header';
import TextAreaModule from './TextAreaModule';
import Stack from '@mui/material/Stack';
import { SocketService } from '../services/SocketService';
import { useEffect } from 'react';

function Scenario(props) {
    const clientPlayer = props.clientPlayer;
    const gameMaster = props.gameMaster;

    const lobbyStateCallbacks = props.lobbyStateCallbacks;
    const setClientPlayerCallback = props.setClientPlayerCallback;

    // TODO: Handle submit callback
    const submitCallback = (data) => {
        // Build request
        const request = {
            lobbyCode: clientPlayer.lobbyCode,
            pId: clientPlayer.pId,
            review: data
        };
        
        SocketService.sendReview(request);
        // Listen for lobby state refresh
        SocketService.lobbyRefreshListener(lobbyStateCallbacks, setClientPlayerCallback);
        // @TODO: fix lobby ready status refresh
    }

    useEffect(() => {
        // Send review ready to server

    }, [])

    const situation = gameMaster.scenario.scenario_description; 
    const cards = clientPlayer.cards;

    return (
        <PageContainer>
            <Stack spacing={2} direction='column'>
                <Header title='SCENARIO' />
                <div className='situation-text'>{situation}</div>
                <CardContainer cards={cards} />
                <TextAreaModule submitCallback={submitCallback} />
            </Stack>
        </PageContainer>
    );
}

function CardContainer(props) {
    const cards = props.cards;
    const stakeholder = cards.stakeholder;
    const principle = cards.principle;
    const rating = cards.rating;

    return (
        <Stack spacing={2} direction='row'>
            <Card 
                key='0' 
                payload={stakeholder} 
                />
            <Card 
                key='1' 
                payload={principle} 
                />
            <Card 
                key='2' 
                payload={rating} 
                />
        </Stack>
    );
}

function Card(props) {
    const payload = props.payload;

    return (
        <div style={{color: 'black'}} className='card'>
            {JSON.stringify(payload)}
        </div>
    )
}

export default Scenario;