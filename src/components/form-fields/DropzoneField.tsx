import { Button, FormControl, FormHelperText } from '@material-ui/core';
import { useDeviceContext, useNotificationsContext } from 'context';
import { ErrorMessage, FieldAttributes, FormikProps } from 'formik';
import { useTranslation } from 'lib';
import { DropzoneArea, DropzoneAreaProps } from 'material-ui-dropzone';
import * as R from 'ramda';
import React, { ChangeEvent, useRef } from 'react';
import styled from 'styled-components';
import { DROPZONE_ACCEPTED_FILES as acceptedFiles, truncate } from 'utils';

import { FormErrorMessage } from './FormErrorMessage';

interface Props extends DropzoneAreaProps {
    form: FormikProps<{}>;
    field: FieldAttributes<{}>;
}

export const DropzoneField: React.FC<Props> = ({ form, field }) => {
    const { t } = useTranslation();
    const { toggleNotification } = useNotificationsContext();
    const maxFileSize = 5000000;
    const isMobile = useDeviceContext();
    const fileName: string = R.propOr('', 'name', field.value);

    const handleMobileFileInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const file = R.path(['currentTarget', 'files', '0'], e) as File;

        if (file.size > maxFileSize) {
            toggleNotification(t('validation:fileSizeError'));
        } else {
            form.setFieldValue(field.name, file);
        }
    };

    const handleFileChange = (files: File[]): void => {
        form.setFieldValue(field.name, files[0]);
    };

    const handleDropRejected = (files: File[]): void => {
        if (files[0].size > maxFileSize) {
            toggleNotification(t('validation:fileSizeError'));
        }
    };

    const mobileFileInputRef = useRef<HTMLInputElement | null>(null);
    const onClickMobileFileInput = (): false | void =>
        !!mobileFileInputRef.current && mobileFileInputRef.current.click();

    const renderMobileFileInput = isMobile && (
        <>
            <Button onClick={onClickMobileFileInput} color="primary" variant="outlined" fullWidth>
                {t('upload-resource:dropzoneTextMobile')}
            </Button>
            <input
                ref={mobileFileInputRef}
                value=""
                id="mobile-file-input"
                type="file"
                accept={acceptedFiles.toString + ';capture=camera'}
                onChange={handleMobileFileInputChange}
            />
        </>
    );

    const renderDesktopFileInput = !isMobile && (
        <DropzoneArea
            onChange={handleFileChange}
            acceptedFiles={acceptedFiles}
            filesLimit={1}
            useChipsForPreview
            showAlerts={false}
            dropzoneText={t('upload-resource:dropzoneTextDesktop')}
            maxFileSize={maxFileSize}
            onDropRejected={handleDropRejected}
        />
    );

    const renderFormHelperText = !fileName && (
        <FormHelperText>
            {t('upload-resource:maxFileSize')}: {maxFileSize / 1000000} MB
        </FormHelperText>
    );

    const renderFileSelectedText = !!fileName && (
        <FormHelperText>{t('upload-resource:fileSelected', { fileName: truncate(fileName, 20) })}</FormHelperText>
    );

    const renderErrorMessage = <ErrorMessage name={field.name} component={FormErrorMessage} />;

    return (
        <StyledDropzoneField fullWidth>
            {renderMobileFileInput}
            {renderDesktopFileInput}
            {renderFormHelperText}
            {renderFileSelectedText}
            {renderErrorMessage}
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
