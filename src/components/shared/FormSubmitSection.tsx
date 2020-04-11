import { Box, Button, ButtonProps, FormControl } from '@material-ui/core';
import { Send } from '@material-ui/icons';
import { ErrorMessage, FormikProps } from 'formik';
import React from 'react';

import { FormErrorMessage } from './FormErrorMessage';
import { Loading } from './Loading';

interface Props extends FormikProps<{}> {
    submitButtonText: string;
}

export const FormSubmitSection: React.FC<Props & ButtonProps> = ({
    isSubmitting,
    submitButtonText,
    endIcon,
    variant,
    color,
    values,
}) => (
    <Box display="flex" flexDirection="column" alignItems="center">
        {isSubmitting ? (
            <FormControl fullWidth>
                <Loading text={(values as { general: string }).general} />
            </FormControl>
        ) : (
            <FormControl fullWidth>
                <Box display="flex" justifyContent="center">
                    <ErrorMessage name="general" component={FormErrorMessage} />
                </Box>
            </FormControl>
        )}
        <FormControl fullWidth>
            <Button
                type="submit"
                disabled={isSubmitting}
                variant={variant || 'contained'}
                endIcon={endIcon || <Send />}
                color={color || 'primary'}
                fullWidth
            >
                {submitButtonText}
            </Button>
        </FormControl>
    </Box>
);
