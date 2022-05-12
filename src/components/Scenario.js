import '../styles/Scenario.scss';
import PageContainer from './PageContainer';
import Header from './Header';
import TextAreaModule from './TextAreaModule';
import Stack from '@mui/material/Stack';
import { SocketService } from '../services/SocketService';
import { useEffect } from 'react';
import { GameInstructions } from '../constants/GameInstructions';
import Button from '@mui/material/Button';
import { Rating } from '@mui/material';

function Scenario(props) {
    const clientPlayer = props.clientPlayer;
    const gameMaster = props.gameMaster;
    const gameState = props.gameState;

    const lobbyStateCallbacks = props.lobbyStateCallbacks;
    const setClientPlayerCallback = props.setClientPlayerCallback;
    const setPageCallback = props.setPageCallback;
    const setErrorStateCallback = props.setErrorStateCallback;

    // Callbacks
    const clickInstructions = () => {
        alert(GameInstructions.REVIEW);
    }

    const submitCallback = (data) => {
        // Build request
        const request = {
            lobbyCode: clientPlayer.lobbyCode,
            pId: clientPlayer.pId,
            review: data,
            readyState: !clientPlayer.readyState    // Player ready up
        };
        
        SocketService.sendReview(request);
    }

    useEffect(() => {
        // Listen for errors
        SocketService.errorListener(setErrorStateCallback);
        // Listen for lobby state refresh
        SocketService.lobbyRefreshListener(lobbyStateCallbacks, setClientPlayerCallback);
        SocketService.startDiscussionListener(lobbyStateCallbacks, setPageCallback, clientPlayer);
    }, [])

    const cards = clientPlayer.cards;

    return (
        <PageContainer>
            <Stack spacing={2} direction='column'>
                <Header title={'THE SCENARIO - ' + gameMaster.scenario.name} />
                <hr className="solid"></hr>
                <div className='instruction-text'>
                    {gameMaster.scenario.description}
                </div>
                <CardContainer cards={cards} />
                <TextAreaModule 
                    readyState={clientPlayer.readyState} 
                    label='Write your review...' 
                    submitCallback={submitCallback} 
                />
                <Button 
                    variant="outlined"
                    color="secondary"
                    onClick={clickInstructions}>
                    Instructions
                </Button>
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
        <Stack spacing={3} direction='row'>
            <Card 
                type='Stakeholder'
                id='0' 
                payload={stakeholder} 
                />
            <Card 
                type='Principle'
                id='1' 
                payload={principle} 
                />
            <Card 
                type='Rating'
                id='2' 
                payload={rating} 
                />
        </Stack>
    );
}

// TODO: Render card properly
function Card(props) {
    const type = props.type;
    const name = props.payload.name;
    const description = props.payload.description;

    return (
        <div className='card' key={props.id}>
            <h1 className="card-type-text">{type}</h1>
            {type === 'Rating' 
                    ? <div>
                        <Rating
                            name="rating"
                            value={props.payload.name}
                            readOnly
                        />
                        <p>(out of 5 stars)</p>
                        </div>  
                    : <h3>{name}</h3>}
            <p>{description ? description : ''}</p>
        </div>

    )
}

export default Scenario;