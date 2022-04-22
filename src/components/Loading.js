import '../styles/Loading.scss';
import PageContainer from './PageContainer';
import Stack from '@mui/material/Stack';
import { ThreeDots } from 'react-loading-icons';

function Loading(props) {
    return (
        <PageContainer>
            <Stack spacing={2} direction='column' alignItems={'center'}>
                <ThreeDots />
            </Stack>
        </PageContainer>
    );
}

export default Loading;