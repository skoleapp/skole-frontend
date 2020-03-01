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
        console.log('hmm: ', form);
        console.log('Field: ', field);
        console.log('files: ', files);

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

        console.log('allImages: ', onlyImages);
        console.log('onlyPDFs: ', onlyPDFs);

        const firstDocx = files.find((file: any) => isDocx(file));
        const allDocx = files.filter((file: any) => isDocx(file));
        const onlyDocx = files.every(file => isDocx(file));

        if (files.length === 0) {
            setErrorMessage('Empty...');
            form.setFieldValue(field.name, []);
        } else if (!!firstPDF && allPDFs.length === 1 && !!onlyPDFs) {
            console.log('1');

            setErrorMessage(null);
            const acceptedFile = [];
            acceptedFile.push(firstPDF);
            form.setFieldValue(field.name, acceptedFile);
        } else if (allPDFs.length > 1 && !!onlyPDFs) {
            console.log('2');

            form.setFieldValue(field.name, []);
            setErrorMessage('Only one PDF is allowed!');
        } else if (!!firstDocx && allDocx.length === 1) {
            console.log('3');

            setErrorMessage(null);
            const acceptedFile = [];
            acceptedFile.push(firstDocx);
            form.setFieldValue(field.name, acceptedFile);
        } else if (allDocx.length > 1 && !!onlyDocx) {
            console.log('4');

            form.setFieldValue(field.name, []);
            setErrorMessage('Only one Docx is allowed!');
        } else if (!!onlyImages) {
            console.log('5');

            setErrorMessage(null);
            form.setFieldValue(field.name, files);
        } else {
            console.log('6');

            form.setFieldValue(field.name, []);
            setErrorMessage('Not allowed...');
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
            {errorMessage}
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
