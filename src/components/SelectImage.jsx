import React from 'react';
import { memo } from 'react';
import styled from 'styled-components';
import { Button } from '@mui/material';
import { uploadLimitFileSize } from '../const';
import { useSnackbarInfo } from '../provider/SnackbarInfoProvider';
import { useSnackbarShowFlg } from '../provider/SnackbarShowFlgProvider';

const StyledButton = styled(Button)`
  position: relative;

  input {
    width: 100%;
    height: 100%;
    position: absolute;
    opacity: 0;
    cursor: pointer;
    top: 0;
    left: 0;
  }
`;

const SelectImage = memo(function SelectImage({
  text = '',
  id = '',
  color = 'primary',
  variant = 'contained',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  startIcon,
  endIcon,
  multiple = false,
  accept = '.png, .jpeg, .jpg',
  setImage,
}) {
  const { setSnackbarInfo } = useSnackbarInfo();
  const { setSnackbarIsShow } = useSnackbarShowFlg();
  const setImageFunc = (e) => {
    e.preventDefault();
    let fileSize = 0;
    for (let i = 0; i < e.target.files.length; i++) {
      fileSize += e.target.files[i].size;
    }
    if (fileSize > uploadLimitFileSize) {
      setSnackbarInfo({
        text: 'ファイルアップロードサイズの上限を超えています。',
        severity: 'warning',
      });
      setSnackbarIsShow(true);
      return;
    }

    console.log('fileSize: ', fileSize);
    if (multiple) {
      const images = [];
      console.log(e.target.files.length);
      for (let i = 0; i < e.target.files.length; i++) {
        images.push(e.target.files[i]);
      }

      setImage(images);
    } else {
      setImage(e.target.files[0]);
    }
  };
  return (
    <>
      <StyledButton
        id={id}
        fullWidth={fullWidth}
        className='upload-img'
        variant={variant}
        color={color}
        startIcon={startIcon}
        endIcon={endIcon}
        size={size}
        disabled={disabled}
      >
        {text}
        <input
          className='select-image'
          type='file'
          multiple={multiple}
          accept={accept}
          // onChange={(e) => console.log(e.target.files)}
          onChange={(e) => setImageFunc(e)}
        />
      </StyledButton>
    </>
  );
});

export default SelectImage;
