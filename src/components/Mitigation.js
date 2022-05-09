import '../styles/Mitigation.scss';
import PageContainer from './PageContainer';
import Header from './Header';
import TextAreaModule from './TextAreaModule';
import Stack from '@mui/material/Stack';
import { SocketService } from '../services/SocketService';
import { useEffect } from 'react';
import { GameInstructions } from '../constants/GameInstructions';
import { Button } from '@mui/material';

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

    props = {
        data: lobbyPlayers.map(player => {
                const cards = player.cards;
                const discussionData = player.data.discussion;

                return {
                    'name': cards.stakeholder.name,
                    'benefit': discussionData.benefits,
                    'harm': discussionData.harms,
                    'theme': discussionData.themes
                };
            })
    };

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
                <p>Choose one stakeholder, feature, harm, or theme that stood out
    in the discussion. </p>
                <Table data={props.data} />
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

// TODO: Figure out how to have table headers properly aligned
function Table(props) {
    let stakeholders = [];
    let benefits = [];
    let harms = [];
    let themes = [];

    props.data.forEach(p => {
        stakeholders.push(p.name);
        p.benefit.forEach(b => benefits.push(b));
        p.harm.forEach(h => harms.push(h));
        p.theme.forEach(t => themes.push(t));
    });

    return (
        <Stack spacing={2} direction='column'>
            <TableRow key={0} name='STAKEHOLDERS' payload={stakeholders} />
            <TableRow key={1} name='BENEFITS' payload={benefits} />
            <TableRow key={2} name='HARMS' payload={harms} />
            <TableRow key={3} name='THEMES' payload={themes} />
        </Stack>
    );
}

function TableRow(props) {
    const name = props.name;
    const payload = props.payload;
    const html = payload.map(data => <span>{data}</span>);
    return (
        <Stack spacing={2} direction='row' justifyContent='center'>
            <strong className='table-header'>{name}</strong>
            <Stack spacing={payload.length} direction='column' justifyContent='center'>
                {html}
            </Stack>
        </Stack>
    )
}

export default Mitigation;