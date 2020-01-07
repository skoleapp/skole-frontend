import * as R from 'ramda';

import { Avatar, Box, Button, ButtonProps } from '@material-ui/core';
import { ErrorMessage, Field, FieldAttributes, FormikProps } from 'formik';
import React, { ChangeEvent, useEffect, useState } from 'react';

import { FormErrorMessage } from '../shared';
import styled from 'styled-components';

interface Props {
    field: FieldAttributes<{}>;
    form: FormikProps<{}>;
    label: string;
}

export const ImagePreviewField: React.FC<Props & ButtonProps> = ({ form, field, label }) => {
    const [image, setImage] = useState();
    const [preview, setPreview] = useState();

    useEffect(() => {
        const objectUrl = image && URL.createObjectURL(image);
        setPreview(objectUrl);
        return (): void => URL.revokeObjectURL(objectUrl);
    }, [image]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const img = R.path(['currentTarget', 'files', '0'], e) as File;
        form.setFieldValue(field.name, img);
        img && setImage(img);
    };

    return (
        <StyledImagePreviewField display="flex" flexDirection="column" alignItems="center" marginY="0.5rem">
            <Avatar className="main-avatar" src={image ? preview : process.env.BACKEND_URL + field.value} />
            <Field
                value=""
                name={field.name}
                id="file-input"
                accept="image/*"
                type="file"
                component="input"
                onChange={handleChange}
            />
            <label htmlFor="file-input">
                <Button variant="outlined" color="primary" component="span">
                    {label}
                </Button>
            </label>
            <ErrorMessage name={field.name} component={FormErrorMessage} />
        </StyledImagePreviewField>
    );
};

const StyledImagePreviewField = styled(Box)`
    label {
        width: 100%;
    }

    input {
        display: none;
    }

    .MuiButton-root {
        margin-top: 0;
    }
`;
