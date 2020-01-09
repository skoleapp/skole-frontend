import { Box, Button, ButtonProps, CircularProgress, FormControl } from '@material-ui/core';
import { ErrorMessage, FormikProps } from 'formik';

import { FormErrorMessage } from '.';
import React from 'react';
import { Send } from '@material-ui/icons';

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
                <CircularProgress color="primary" />
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
