import React from 'react';
import { Typography } from '@mui/material';

interface ErrorDisplayProps {
  error: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  return (
    <Typography color="error">{error}</Typography>
  );
};

export default ErrorDisplay;