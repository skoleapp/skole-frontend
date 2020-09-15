import { Button, FormControl, FormHelperText } from '@material-ui/core';
import { useNotificationsContext } from 'context';
import { ErrorMessage, FieldAttributes, FormikProps } from 'formik';
import { useTranslation } from 'lib';
import * as R from 'ramda';
import React, { ChangeEvent, useRef } from 'react';
import { ACCEPTED_FILES, MAX_FILE_SIZE, truncate } from 'utils';

import { FormErrorMessage } from './FormErrorMessage';

interface Props {
    form: FormikProps<{}>;
    field: FieldAttributes<{}>;
}

export const FileField: React.FC<Props> = ({ form, field }) => {
    const { t } = useTranslation();
    const { toggleNotification } = useNotificationsContext();
    const fileName: string = R.propOr('', 'name', field.value);

    const handleMobileFileInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const file = R.path(['currentTarget', 'files', '0'], e) as File;

        if (file.size > MAX_FILE_SIZE) {
            toggleNotification(t('validation:fileSizeError'));
        } else {
            form.setFieldValue(field.name, file);
        }
    };

    const mobileFileInputRef = useRef<HTMLInputElement | null>(null);
    const onClickMobileFileInput = (): false | void =>
        !!mobileFileInputRef.current && mobileFileInputRef.current.click();

    const renderFileInput = (
        <>
            <Button onClick={onClickMobileFileInput} color="primary" variant="outlined" fullWidth>
                {t('upload-resource:uploadFileButtonText')}
            </Button>
            <input
                ref={mobileFileInputRef}
                value=""
                id="mobile-file-input"
                type="file"
                accept={ACCEPTED_FILES.toString + ';capture=camera'}
                onChange={handleMobileFileInputChange}
            />
        </>
    );

    const renderFormHelperText = !fileName && (
        <FormHelperText>
            {t('upload-resource:maxFileSize')}: {MAX_FILE_SIZE / 1000000} MB
        </FormHelperText>
    );

    const renderFileSelectedText = !!fileName && (
        <FormHelperText>{t('upload-resource:fileSelected', { fileName: truncate(fileName, 20) })}</FormHelperText>
    );

    const renderErrorMessage = <ErrorMessage name={field.name} component={FormErrorMessage} />;

    return (
        <FormControl>
            {renderFileInput}
            {renderFormHelperText}
            {renderFileSelectedText}
            {renderErrorMessage}
        </FormControl>
    );
};
