import '../styles/Scenario.scss';
import PageContainer from './PageContainer';
import Header from './Header';
import TextAreaModule from './TextAreaModule';
import Stack from '@mui/material/Stack';
import { SocketService } from '../services/SocketService';
import { useEffect } from 'react';
import { GameInstructions } from '../constants/GameInstructions';

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
    const instructions = GameInstructions.REVIEW;

    return (
        <PageContainer>
            <Stack spacing={2} direction='column'>
                <Header title='REVIEW' />
                <div class='instruction-text'>{instructions}</div>
                <CardContainer cards={cards} />
                <TextAreaModule label='Write your review...' submitCallback={submitCallback} />
            </Stack>
        </PageContainer>
    );
}

function CardContainer(props) {
    const cards = props.cards;
    const stakeholder = cards.stakeholder;
    const principle = cards.principle;
    const rating = cards.rating;
    const scenario = cards.scenario;

    return (
        <Stack spacing={2} direction='row'>
            <Card 
                type='Stakeholder'
                key='0' 
                payload={stakeholder} 
                />
            <Card 
                type='Principle'
                key='1' 
                payload={principle} 
                />
            <Card 
                type='Rating'
                key='2' 
                payload={rating} 
                />
            <Card
                type='Scenario'
                key='3'
                payload={scenario}
                />
        </Stack>
    );
}

// TODO: Render card properly
function Card(props) {
    const key = props.key;
    const type = props.type;
    const name = props.payload.name;
    const description = props.payload.description;

    return (
        <div className='card' key={key}>
            <h1 className="card-type-text">{type}</h1>
            <h3>{name}</h3>
            <p>{description ? description : ''}</p>
        </div>

    )
}

export default Scenario;