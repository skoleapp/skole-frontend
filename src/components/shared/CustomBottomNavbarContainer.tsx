import Box from '@material-ui/core/Box';
import { useTheme } from '@material-ui/core/styles';
import React from 'react';

export const CustomBottomNavbarContainer: React.FC = ({ children }) => {
  const { spacing } = useTheme();

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      width="100%"
      padding={`0 ${spacing(2)}`}
    >
      {children}
    </Box>
  );
};
