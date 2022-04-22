import '../styles/Judgement.scss';
import PageContainer from "./PageContainer"
import Header from "./Header"
import TextAreaModule from "./TextAreaModule";
import Stack from '@mui/material/Stack';

function Judgement(props) {
    const submitCallback = (data) => {
        console.log(data);
    }

    return (
        <PageContainer>
            <Stack spacing={2} direction='column'>
                <Header title='JUDGEMENT' />
                <h3>What would you do?</h3>
                <TextAreaModule submitCallback={submitCallback} label='Enter your thoughts...' />
            </Stack>
        </PageContainer>
    )
}

export default Judgement;