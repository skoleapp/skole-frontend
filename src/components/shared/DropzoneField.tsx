import { FormControl } from '@material-ui/core';
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

    return (
        <StyledDropzoneField fullWidth>
            <DropzoneArea
                onChange={(files: File[]): void => form.setFieldValue(field.name, files)}
                acceptedFiles={acceptedFiles}
                filesLimit={20}
                useChipsForPreview
                showAlerts={false}
                dropzoneText={t('common:dropzoneText')}
                initialFiles={initialFiles}
            />
            <ErrorMessage name={field.name} component={FormErrorMessage} />
        </StyledDropzoneField>
    );
};

const StyledDropzoneField = styled(FormControl)`
    > div {
        padding: 0.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .MuiChip-root {
        margin: 0.25rem;
    }
`;
