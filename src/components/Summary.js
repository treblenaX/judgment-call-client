import '../styles/Summary.scss';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, Stack } from '@mui/material';
import Header from './Header';
import { FileDownloadService } from '../services/FileDownloadService';

function Summary(props) {
    const gameMaster = props.gameMaster;
    const lobbyPlayers = props.lobbyPlayers;
    const clientPlayer = props.clientPlayer;
    const endTimestamp = props.endTime;

    const title = 'SUMMARY FOR ' + clientPlayer.playerName;
    const scenario = lobbyPlayers[0].cards.scenario.name;
    const data = parseData(lobbyPlayers);

    const onClickFinish = (e) => {
        const payload = {
            players: lobbyPlayers,
            gameMaster: gameMaster,
            clientPlayer: clientPlayer,
            timestamp: endTimestamp
        };

        FileDownloadService.downloadFile(payload);
    }

    return (
        <div className='summary-wrapper'>
            <div className='summary-body'>
                <Stack spacing={2} direction='column'>
                    <Header title={title} />
                    <h3>Scenario: {scenario}</h3>
                    <h5>End Time: {endTimestamp}</h5>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Player</TableCell>
                                    <TableCell>Stakeholder</TableCell>
                                    <TableCell>Rating</TableCell>
                                    <TableCell>Principle</TableCell>
                                    <TableCell>Review</TableCell>
                                    <TableCell>Mitigation</TableCell>
                                    <TableCell>Judgment Call</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.map((player, index) => {
                                    return (<TableRow key={index}>
                                        <TableCell>{player.name}</TableCell>
                                        <TableCell>{player.stakeholder}</TableCell>
                                        <TableCell>{player.rating}</TableCell>
                                        <TableCell>{player.principle}</TableCell>
                                        <TableCell>{player.review}</TableCell>
                                        <TableCell>{player.mitigation}</TableCell>
                                        <TableCell>{player.judgment}</TableCell>
                                    </TableRow>)
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Button variant='contained' color='secondary' onClick={onClickFinish}>
                        Download Results
                    </Button>
                </Stack>
            </div>
        </div>
    );
}

const parseData = (lobbyPlayers) => {
    let playerData = [];

    lobbyPlayers.forEach(player => {
        const data = {
            name: player.playerName,
            stakeholder: player.cards.stakeholder.name,
            rating: player.cards.rating.name,
            principle: player.cards.principle.name,
            review: player.data.review,
            benefits: player.data.discussion.benefits,
            harms: player.data.discussion.harms,
            themes: player.data.discussion.themes,
            mitigation: player.data.mitigation,
            judgment: player.data.judgment
        };
        playerData.push(data);
    })

    return playerData;
}

export default Summary;