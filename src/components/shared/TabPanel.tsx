import Box from '@material-ui/core/Box';
import React from 'react';
import { TabPanelProps } from 'types';

export const TabPanel: React.FC<TabPanelProps> = ({ value, index, children }) =>
  value === index ? (
    <Box flexGrow="1" display="flex" flexDirection="column">
      {children}
    </Box>
  ) : null;
