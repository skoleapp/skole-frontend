import { Grid } from '@material-ui/core';
import React from 'react';

// A container for keeping common grid props on all pages that use the form layout.
export const FormGridContainer: React.FC = ({ children }) => (
    <Grid container justify="center">
        <Grid item xs={12} sm={6} md={5} lg={4}>
            {children}
        </Grid>
    </Grid>
);
