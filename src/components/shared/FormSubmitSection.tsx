import { Box, Button, ButtonProps, CircularProgress, FormControl } from '@material-ui/core';
import { Send } from '@material-ui/icons';
import { ErrorMessage, FormikProps } from 'formik';
import React from 'react';

import { FormErrorMessage } from './FormErrorMessage';

interface FormSubmitSectionProps extends FormikProps<{}> {
    submitButtonText: string;
}

export const FormSubmitSection: React.FC<FormSubmitSectionProps & ButtonProps> = ({
    isSubmitting,
    submitButtonText,
    endIcon,
    variant,
    color,
}) => (
    <Box display="flex" flexDirection="column" alignItems="center">
        {isSubmitting ? (
            <Box>
                <CircularProgress color="primary" />
            </Box>
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
