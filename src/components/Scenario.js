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
    const instructions = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'; 

    // TODO: Get cards from server
    const cards = [
        {
            name: 'Card 1',
            description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'
        },
        {
            name: 'Card 2',
            description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'
        },
        {
            name: 'Card 3',
            description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'
        },
        {
            name: 'Card 4',
            description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'
        },
    ];

    return (
        <PageContainer>
            <Stack spacing={2} direction='column'>
                <Header title='REVIEW' />
                <div class='instruction-text'>{instructions}</div>
                <CardContainer cards={cards} />
                <TextAreaModule submitCallback={submitCallback} />
            </Stack>
        </PageContainer>
    );
}

function CardContainer(props) {
    console.log(props.cards);

    return (
        <Stack spacing={2} direction='row'>
            {props.cards.map((card, i) => {
                return <Card key={i} name={card.name} description={card.description} />
            })}
        </Stack>
    );
}

// TODO: Render card properly
function Card(props) {
    return (
        <div className='card' key={props.key}>
            <h3>{props.name}</h3>
            <p>{props.description}</p>
        </div>

    )
}

export default Scenario;