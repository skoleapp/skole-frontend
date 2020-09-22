import { Button, ButtonProps, FormControl, Grid } from '@material-ui/core';
import { ArrowForwardOutlined } from '@material-ui/icons';
import { ErrorMessage, FormikProps } from 'formik';
import React from 'react';

import { LoadingBox } from '..';
import { FormErrorMessage } from './FormErrorMessage';

interface Props extends FormikProps<{}> {
    submitButtonText: string;
}

export const FormSubmitSection: React.FC<Props & Pick<ButtonProps, 'variant' | 'endIcon'>> = ({
    isSubmitting,
    submitButtonText,
    endIcon,
    variant,
    values,
}) => {
    const renderTextContent = isSubmitting ? (
        <LoadingBox text={(values as { general: string }).general} />
    ) : (
        <ErrorMessage name="general" component={FormErrorMessage} />
    );

    const renderSubmitButton = (
        <Button
            type="submit"
            disabled={isSubmitting}
            variant={variant || 'contained'}
            endIcon={endIcon || <ArrowForwardOutlined />}
            color="primary"
            fullWidth
        >
            {submitButtonText}
        </Button>
    );

    return (
        <Grid container direction="column" alignItems="center">
            <FormControl>
                <Grid container justify="center">
                    {renderTextContent}
                </Grid>
            </FormControl>
            <FormControl>{renderSubmitButton}</FormControl>
        </Grid>
    );
};
