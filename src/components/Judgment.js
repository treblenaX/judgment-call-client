import '../styles/Judgment.scss';
import PageContainer from "./PageContainer"
import Header from "./Header"
import TextAreaModule from "./TextAreaModule";
import Stack from '@mui/material/Stack';
import { SocketService } from '../services/SocketService';
import { useEffect } from 'react';
import { GameInstructions } from '../constants/GameInstructions';
import { Button } from '@mui/material';

const instructionText = `
    You've considered a wide range of perspectives, surfaced potential harms, and 
    explored preventative design measures. Now it's time to make a judgment call.
`;

function Judgment(props) {
    const clientPlayer = props.clientPlayer;

    const lobbyStateCallbacks = props.lobbyStateCallbacks;
    const setClientPlayerCallback = props.setClientPlayerCallback;
    const setPageCallback = props.setPageCallback;
    const setErrorStateCallback = props.setErrorStateCallback;

    const onClickInstructions = () => {
        alert(GameInstructions.JUDGMENT_CALL);
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
            judgment: data,
            readyState: !clientPlayer.readyState
        };
        console.log('Judgment ready request.');

        SocketService.sendJudgmentCall(request);
    }

    useEffect(() => {
        // Listen for errors
        SocketService.errorListener(setErrorStateCallback);
        // Listen for refresh and next phase start
        SocketService.lobbyRefreshListener(lobbyStateCallbacks, setClientPlayerCallback);
        SocketService.startSummaryListener(lobbyStateCallbacks, setPageCallback, clientPlayer);
    }, []);

    return (
        <PageContainer>
            <Stack spacing={2} direction='column'>
                <Header title='JUDGMENT CALL' />
                <h3>What would you do?</h3>
                <TextAreaModule
                    readyState={clientPlayer.readyState}
                    submitCallback={submitCallback} 
                    label='Moving forward, what is the best solution for making a better product?' 
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

export default Judgment;