import { FormControl } from '@material-ui/core';
import { ErrorMessage, FieldAttributes, FormikProps } from 'formik';
import { DropzoneArea, DropzoneAreaProps } from 'material-ui-dropzone';
import React, { useState } from 'react';
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

    const [errorMessage, setErrorMessage]: any = useState(null);

    const handleOnChange = (field: any, files: File[]) => {
        const isPDF = (file: any) => !!file && file.type === 'application/pdf';

        const isImage = (file: any) =>
            !!file &&
            file.type.startsWith('image/') &&
            (file.name.endsWith('.jpg') || file.name.endsWith('.jpeg') || file.name.endsWith('.png'));

        const isDocx = (file: any) => file.type.startsWith('application/') && file.name.endsWith('.docx');

        const firstPDF = files.find((file: any) => isPDF(file));
        const allPDFs = files.filter((file: any) => isPDF(file));
        const onlyPDFs = files.every(file => isPDF(file));

        const onlyImages = files.every(file => isImage(file));

        const firstDocx = files.find((file: any) => isDocx(file));
        const allDocx = files.filter((file: any) => isDocx(file));
        const onlyDocx = files.every(file => isDocx(file));

        if (files.length === 0) {
            setErrorMessage(t('common:empty'));
            form.setFieldValue(field.name, []);
        } else if (!!firstPDF && allPDFs.length === 1 && !!onlyPDFs) {
            const acceptedFile = [];
            acceptedFile.push(firstPDF);
            setErrorMessage(null);
            form.setFieldValue(field.name, acceptedFile);
        } else if (allPDFs.length > 1 && !!onlyPDFs) {
            setErrorMessage(t('common:onePdfAllowed'));
            form.setFieldValue(field.name, []);
        } else if (!!firstDocx && allDocx.length === 1) {
            const acceptedFile = [];
            acceptedFile.push(firstDocx);
            setErrorMessage(null);
            form.setFieldValue(field.name, acceptedFile);
        } else if (allDocx.length > 1 && !!onlyDocx) {
            setErrorMessage(t('common:oneDocxAllowed'));
            form.setFieldValue(field.name, []);
        } else if (!!onlyImages) {
            setErrorMessage(null);
            form.setFieldValue(field.name, files);
        } else {
            setErrorMessage(t('common:tooManyFiletypes'));
            form.setFieldValue(field.name, []);
        }
    };

    return (
        <StyledDropzoneField fullWidth>
            <DropzoneArea
                onChange={(files: File[]): void => handleOnChange(field, files)}
                acceptedFiles={acceptedFiles}
                filesLimit={10}
                useChipsForPreview
                showAlerts={false}
                dropzoneText={t('common:dropzoneText')}
                initialFiles={initialFiles}
            />
            <ErrorMessage name={field.name} component={FormErrorMessage} />
            <FormErrorMessage>{errorMessage}</FormErrorMessage>
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
