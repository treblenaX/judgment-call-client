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

function Summary(props) {
    // TODO: Replace with real props
    props = {
        data: {
            situation: 'situation',
            gameStart: '0:00',
            gameEnd: '0:00',
            players: ['player1', 'player2', 'player3', 'player4'],
            benefits: ['benefit1', 'benefit2', 'benefit3', 'benefit4'],
            harms: ['harm1', 'harm2', 'harm3', 'harm4'],
            themes: ['theme1', 'theme2', 'theme3', 'theme4'],
            responses: ['response1', 'response2', 'response3', 'response4'],
        }
    };

    // TODO: Handle click
    const onClickFinish = (e) => {
        console.log('finish');
    }

    return (
        <div className='summary-wrapper'>
            <div className='summary-body'>
                <Stack spacing={2} direction='column'>
                    <Header title='SUMMARY' />
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Situation</TableCell>
                                    <TableCell>Game Start</TableCell>
                                    <TableCell>Game End</TableCell>
                                    <TableCell>Players</TableCell>
                                    <TableCell>Benefits</TableCell>
                                    <TableCell>Harms</TableCell>
                                    <TableCell>Themes</TableCell>
                                    <TableCell>Responses</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {props.data.players.map((player, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{props.data.situation}</TableCell>
                                        <TableCell>{props.data.gameStart}</TableCell>
                                        <TableCell>{props.data.gameEnd}</TableCell>
                                        <TableCell>{player}</TableCell>
                                        <TableCell>{props.data.benefits[index]}</TableCell>
                                        <TableCell>{props.data.harms[index]}</TableCell>
                                        <TableCell>{props.data.themes[index]}</TableCell>
                                        <TableCell>{props.data.responses[index]}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Button variant='contained' color='secondary' onClick={onClickFinish}>
                        Finish
                    </Button>
                </Stack>
            </div>
        </div>
    );
}

export default Summary;