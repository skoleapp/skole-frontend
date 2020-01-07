import * as R from 'ramda';

import { Avatar, Box, Button, ButtonProps, FormControl } from '@material-ui/core';
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
        <StyledImagePreviewField fullWidth>
            <Box display="flex" flexDirection="column" alignItems="center">
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
                <Box marginTop="0.5rem">
                    <label htmlFor="file-input">
                        <Button variant="outlined" color="primary" component="span">
                            {label}
                        </Button>
                    </label>
                </Box>
                <ErrorMessage name={field.name} component={FormErrorMessage} />
            </Box>
        </StyledImagePreviewField>
    );
};

const StyledImagePreviewField = styled(FormControl)`
    label {
        width: 100%;
    }

    input {
        display: none;
    }
`;
