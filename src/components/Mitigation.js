import '../styles/Mitigation.scss';
import PageContainer from './PageContainer';
import Header from './Header';
import TextAreaModule from './TextAreaModule';
import Stack from '@mui/material/Stack';

function Mitigation(props) {
    const lobbyPlayers = props.lobbyPlayers;
    const lobbyStateCallbacks = props.lobbyStateCallbacks;
    const setPageCallback = props.setPageCallback;

    // TODO: Replace with real props
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

    return (
        <PageContainer>
            <Stack spacing={2} direction='column'>
                <Header title='MITIGATION' />
                <Table data={props.data} />
                <TextAreaModule />
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