import React from 'react';

export const ErrorBoundary: React.FC = ({ children }) => {
  // const { error } = useSelector((state: State) => state.errors);

  // if (error) {
  //   return <ErrorPage />;
  // }

  return <>{children}</>;
};
