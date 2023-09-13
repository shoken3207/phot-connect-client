import CircularProgress from '@mui/material/CircularProgress';
import styled from '@emotion/styled';
import { Backdrop } from '@mui/material';
import { useIsLoadingFlg } from '../provider/IsLoadingFlgProvider';

const LoadingProgress = () => {
  const { isLoading } = useIsLoadingFlg();

  return (
    <>
      {isLoading && (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}
        >
          <SProgressContaner>
            <CircularProgress
              style={{ height: 70, width: 70 }}
              color='primary'
            />
            <h2>Loading・・・</h2>
          </SProgressContaner>
        </Backdrop>
      )}
    </>
  );
};

export default LoadingProgress;

const SProgressContaner = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 1.8rem;
  align-items: center;

  > h2 {
    font-size: 1.4rem;
    color: white;
    text-align: center;
  }
`;
