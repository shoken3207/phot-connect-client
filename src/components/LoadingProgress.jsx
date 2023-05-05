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
          <CircularProgress style={{ height: 50, width: 50 }} color='primary' />
        </Backdrop>
      )}
    </>
  );
};

export default LoadingProgress;
