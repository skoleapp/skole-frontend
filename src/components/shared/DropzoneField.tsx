import { ErrorMessage, FieldAttributes, FormikProps } from 'formik';

import { DropzoneArea } from 'material-ui-dropzone';
import { FormControl } from '@material-ui/core';
import { FormErrorMessage } from './FormErrorMessage';
import React from 'react';
import styled from 'styled-components';

interface Props {
    form: FormikProps<{}>;
    field: FieldAttributes<{}>;
    label?: string;
}

const acceptedFiles = ['image/*', 'text/*', 'application/*'];

export const DropzoneField: React.FC<Props> = ({ form, field, label }) => (
    <StyledDropzoneField fullWidth>
        <DropzoneArea
            onChange={(files: File[]): void => form.setFieldValue(field.name, files)}
            acceptedFiles={acceptedFiles}
            filesLimit={20}
            useChipsForPreview
            showAlerts={false}
            dropzoneText={label}
        />
        <ErrorMessage name="files" component={FormErrorMessage} />
    </StyledDropzoneField>
);

const StyledDropzoneField = styled(FormControl)`
    .MuiChip-root {
        margin: 0.25rem;
    }
`;
