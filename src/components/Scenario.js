import '../styles/Scenario.scss';
import PageContainer from './PageContainer';
import Header from './Header';
import TextAreaModule from './TextAreaModule';
import Stack from '@mui/material/Stack';

function Scenario(props) {
    // TODO: Handle submit callback
    const submitCallback = (data) => {
        console.log(data);
    }

    // TODO: Get situation from server
    const situation = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'; 

    // TODO: Get cards from server
    const cards = [0, 1, 2];

    return (
        <PageContainer>
            <Stack spacing={2} direction='column'>
                <Header title='SCENARIO' />
                <div class='situation-text'>{situation}</div>
                <CardContainer cards={cards} />
                <TextAreaModule submitCallback={submitCallback} />
            </Stack>
        </PageContainer>
    );
}

function CardContainer(props) {
    const cards = props.cards;
    return (
        <Stack spacing={2} direction='row'>
            {cards.map((card) => {
                return <Card key={card} />
            })}
        </Stack>
    );
}

// TODO: Render card properly
function Card(key) {
    return (
        <div className='card' key={key} />
    )
}

export default Scenario;