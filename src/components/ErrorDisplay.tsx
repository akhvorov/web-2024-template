import React from 'react';

interface ErrorDisplayProps {
  error: Error | null;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  if (!error) return null;

  return (
    <div style={{ color: 'red', padding: '10px', border: '1px solid red', margin: '10px 0' }}>
      <h3>Ошибка:</h3>
      <p>{error.message}</p>
      <pre>{error.stack}</pre>
    </div>
  );
};

export default ErrorDisplay;