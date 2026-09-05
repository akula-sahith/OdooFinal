import React from 'react';
import { ErrorState as UIErrorState } from './ErrorState/ErrorState';

export const ErrorState = ({
  title = 'Something went wrong',
  message = "We couldn't load this section. Please check your connection and try again.",
  onRetry,
  className = '',
  ...props
}) => {
  return (
    <UIErrorState
      title={title}
      description={message}
      message={message}
      onRetry={onRetry}
      className={className}
      {...props}
    />
  );
};

export default ErrorState;
