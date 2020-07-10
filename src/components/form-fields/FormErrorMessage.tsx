import { FormHelperText } from '@material-ui/core';
import React from 'react';

export const FormErrorMessage: React.FC = props => <FormHelperText error {...props} />;
