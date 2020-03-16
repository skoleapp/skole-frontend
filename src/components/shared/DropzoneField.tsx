import { FormControl, FormHelperText } from '@material-ui/core';
import { ErrorMessage, FieldAttributes, FormikProps } from 'formik';
import { DropzoneArea, DropzoneAreaProps } from 'material-ui-dropzone';
import React from 'react';
import styled from 'styled-components';

import { useTranslation } from '../../i18n';
import { FormErrorMessage } from './FormErrorMessage';

interface Props extends DropzoneAreaProps {
    form: FormikProps<{}>;
    field: FieldAttributes<{}>;
}

const acceptedFiles = ['image/*', 'text/*', 'application/*'];

export const DropzoneField: React.FC<Props> = ({ form, field, initialFiles }) => {
    const { t } = useTranslation();

    const handleFileChange = (files: File[]): void => {
        form.setFieldValue(field.name, files[0]);
    };

    return (
        <StyledDropzoneField fullWidth>
            <DropzoneArea
                onChange={handleFileChange}
                acceptedFiles={acceptedFiles}
                filesLimit={1}
                useChipsForPreview
                showAlerts={false}
                dropzoneText={t('common:dropzoneText')}
                initialFiles={initialFiles}
                maxFileSize={5000000}
            />
            <FormHelperText>{t('common:maxFileSize')}: 5MB</FormHelperText>
            <ErrorMessage name={field.name} component={FormErrorMessage} />
        </StyledDropzoneField>
    );
};

const StyledDropzoneField = styled(FormControl)`
    > div:first-child {
        padding: 0.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .MuiChip-root {
        margin: 0.25rem;
        max-width: 16rem;
    }
`;
