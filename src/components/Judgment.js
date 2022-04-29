import '../styles/Judgment.scss';
import PageContainer from "./PageContainer"
import Header from "./Header"
import TextAreaModule from "./TextAreaModule";
import Stack from '@mui/material/Stack';

function Judgment(props) {
    const submitCallback = (data) => {
        console.log(data);
    }

    return (
        <PageContainer>
            <Stack spacing={2} direction='column'>
                <Header title='JUDGEMENT' />
                <h3>What would you do?</h3>
                <TextAreaModule submitCallback={submitCallback} label='Write your review...' />
            </Stack>
        </PageContainer>
    )
}

export default Judgment;