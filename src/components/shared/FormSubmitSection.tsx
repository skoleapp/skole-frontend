import { Box, Button, ButtonProps, FormControl } from '@material-ui/core';
import { Send } from '@material-ui/icons';
import { ErrorMessage, FormikProps } from 'formik';
import React from 'react';
import styled from 'styled-components';

import { FormErrorMessage } from './FormErrorMessage';
import { LoadingBox } from './LoadingBox';

interface Props extends FormikProps<{}> {
    submitButtonText: string;
}

export const FormSubmitSection: React.FC<Props & Pick<ButtonProps, 'variant' | 'endIcon'>> = ({
    isSubmitting,
    submitButtonText,
    endIcon,
    variant,
    values,
}) => (
    <StyledFormSubmitSection display="flex" flexDirection="column" alignItems="center">
        {isSubmitting ? (
            <FormControl fullWidth>
                <LoadingBox text={(values as { general: string }).general} />
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
                fullWidth
            >
                {submitButtonText}
            </Button>
        </FormControl>
    </StyledFormSubmitSection>
);

const StyledFormSubmitSection = styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: center;

    button[type='submit'] {
        background-color: var(--contrast);
        color: var(--white);
    }
`;
