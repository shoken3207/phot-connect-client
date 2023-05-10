import React, { memo } from 'react';
import Button from '@mui/material/Button';

const CommonButton = memo((props) => {
  const {
    text = '',
    className = '',
    id = '',
    color = 'primary',
    variant = 'contained',
    size = 'medium',
    disabled = false,
    fullWidth = false,
    startIcon,
    endIcon,
    onClick,
  } = props;
  return (
    <Button
      className={className}
      id={id}
      color={color}
      variant={variant}
      size={size}
      disabled={disabled}
      fullWidth={fullWidth}
      startIcon={startIcon}
      endIcon={endIcon}
      onClick={(event) => onClick(event)}
    >
      {text}
    </Button>
  );
});

export default CommonButton;
CommonButton.displayName = 'CommonButton';
