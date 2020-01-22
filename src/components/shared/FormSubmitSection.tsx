import { Box, Button, ButtonProps, CircularProgress, FormControl } from '@material-ui/core';
import { Send } from '@material-ui/icons';
import { ErrorMessage, FormikProps } from 'formik';
import React from 'react';

import { FormErrorMessage } from '.';

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
    <FormControl fullWidth>
        <Box display="flex" flexDirection="column" alignItems="center">
            {isSubmitting ? (
                <Box marginY="0.5rem">
                    <CircularProgress color="primary" />
                </Box>
            ) : (
                <ErrorMessage name="general" component={FormErrorMessage} />
            )}
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
        </Box>
    </FormControl>
);
