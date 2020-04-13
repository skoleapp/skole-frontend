import { FormControl, FormHelperText } from '@material-ui/core';
import { ErrorMessage, FieldAttributes, FormikProps } from 'formik';
import { DropzoneArea, DropzoneAreaProps } from 'material-ui-dropzone';
import React, { useEffect } from 'react';
import styled from 'styled-components';

import { useTranslation } from '../../i18n';
import { breakpointsNum } from '../../styles';
import { useBreakPoint, useNotificationsContext } from '../../utils';
import { FormErrorMessage } from './FormErrorMessage';

interface Props extends DropzoneAreaProps {
    form: FormikProps<{}>;
    field: FieldAttributes<{}>;
}

const acceptedFiles = ['image/*', 'text/*', 'application/*'];

export const DropzoneField: React.FC<Props> = ({ form, field }) => {
    const { t } = useTranslation();
    const { toggleNotification } = useNotificationsContext();
    const maxFileSize = 5000000;
    const isMobile = useBreakPoint(breakpointsNum.MD);

    const handleFileChange = (files: File[]): void => {
        form.setFieldValue(field.name, files[0]);
    };

    // TODO: Use form error here, now using notification temporarily as the form error does not work for some reason.
    const handleDropRejected = (files: File[]): void => {
        if (files[0].size > maxFileSize) {
            toggleNotification(t('forms:fileSizeError'));
        }
    };

    // Allow uploading files using camera.
    useEffect(() => {
        const dropzone = document.querySelectorAll('[type="file"]');
        dropzone[0].setAttribute('capture', 'camera');
    }, []);

    return (
        <StyledDropzoneField fullWidth>
            <DropzoneArea
                onChange={handleFileChange}
                acceptedFiles={acceptedFiles}
                filesLimit={1}
                useChipsForPreview
                showAlerts={false}
                dropzoneText={isMobile ? t('common:dropzoneTextMobile') : t('common:dropzoneTextDesktop')}
                maxFileSize={maxFileSize}
                onDropRejected={handleDropRejected}
            />
            <FormHelperText>
                {t('common:maxFileSize')}: {maxFileSize / 1000000} MB
            </FormHelperText>
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
        min-height: 200px;
    }

    .MuiChip-root {
        margin: 0.25rem;
        max-width: 16rem;
    }
`;
