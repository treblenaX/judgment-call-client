import '../styles/Mitigation.scss';
import PageContainer from './PageContainer';
import Header from './Header';
import TextAreaModule from './TextAreaModule';
import Stack from '@mui/material/Stack';

function Mitigation(props) {
    // TODO: Replace with real props
    props = {
        data: [
            {
                'name': 'stakeholder1',
                'benefit': ['benefit1', 'benefit2', 'benefit3'],
                'harm': ['harm1', 'harm2', 'harm3'],
                'principle': ['principle1', 'principle2', 'principle3'],
            },
            {
                'name': 'stakeholder2',
                'benefit': ['benefit1', 'benefit2', 'benefit3'],
                'harm': ['harm1', 'harm2', 'harm3'],
                'principle': ['principle1', 'principle2', 'principle3'],
            },
            {
                'name': 'stakeholder3',
                'benefit': ['benefit1', 'benefit2', 'benefit3'],
                'harm': ['harm1', 'harm2', 'harm3'],
                'principle': ['principle1', 'principle2', 'principle3'],
            },
            {
                'name': 'stakeholder4',
                'benefit': ['benefit1', 'benefit2', 'benefit3'],
                'harm': ['harm1', 'harm2', 'harm3'],
                'principle': ['principle1', 'principle2', 'principle3'],
            },
        ]
    }

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
    return (
        <Stack spacing={2} direction='column'>
            {/* <Stack spacing={4} direction='row' justifyContent='center'>
                <strong className='table-header'>STAKEHOLDER</strong>
                <strong className='table-header'>BENEFIT</strong>
                <strong className='table-header'>HARM</strong>
                <strong className='table-header'>PRINCIPLE</strong>
            </Stack> */}
            {props.data.map((stakeholder, index) => {
                return (
                    <TableRow key={index} stakeholder={stakeholder} />
                );
            })}
        </Stack>
    );
}

function TableRow(props) {
    return (
        <Stack spacing={4} direction='row' justifyContent='center'>
            <span>{props.stakeholder.name}</span>
            <span>{props.stakeholder.benefit.join('\n')}</span>
            <span>{props.stakeholder.harm.join('\n')}</span>
            <span>{props.stakeholder.principle.join('\n')}</span>
        </Stack>
    );
}

export default Mitigation;