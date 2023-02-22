export type CommonButton = {
  text?: string;
  className?: string;
  id?: string;
  color?:
    | 'primary'
    | 'inherit'
    | 'secondary'
    | 'success'
    | 'error'
    | 'info'
    | 'warning'
    | undefined;
  variant?: 'text' | 'contained' | 'outlined' | undefined;
  size?: 'small' | 'large' | 'medium' | undefined;
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void | undefined;
  startIcon?: any;
  endIcon?: any;
};
