import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import { makeStyles } from '@material-ui/core/styles';
import imageCompression from 'browser-image-compression';
import { useNotificationsContext } from 'context';
import { ErrorMessage, FieldAttributes, FormikProps, FormikValues } from 'formik';
import { useMediaQueries } from 'hooks';
import { useTranslation } from 'lib';
import * as R from 'ramda';
import React, { ChangeEvent, DragEvent, useRef } from 'react';
import { BORDER_RADIUS } from 'theme';
import {
  IMAGE_TYPES,
  MAX_RESOURCE_FILE_SIZE,
  MAX_RESOURCE_IMAGE_WIDTH_HEIGHT,
  truncate,
  urls,
} from 'utils';

import { TextLink } from '../shared';
import { FormErrorMessage } from './FormErrorMessage';

const useStyles = makeStyles(({ palette, spacing }) => ({
  dropZone: {
    border: `0.15rem dashed ${palette.primary.main}`,
    padding: spacing(2),
    minHeight: '15rem',
    textAlign: 'center',
    borderRadius: BORDER_RADIUS,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

interface Props {
  form: FormikProps<FormikValues>;
  field: FieldAttributes<FormikValues>;
}

export const FileField: React.FC<Props> = ({ form: { setFieldValue }, field: { name, value } }) => {
  const classes = useStyles();
  const { isMobile, isTabletOrDesktop } = useMediaQueries();
  const { t } = useTranslation();
  const { toggleNotification } = useNotificationsContext();
  const _fileName = R.propOr('', 'name', value);
  const fileName = truncate(_fileName, 20);
  const maxFileSize = MAX_RESOURCE_FILE_SIZE / 1000000; // Convert to megabytes.
  const fileInputRef = useRef<HTMLInputElement>(null!);
  const handleFileInputClick = (): false | void => fileInputRef.current.click();
  const preventDefaultDragBehavior = (e: DragEvent<HTMLElement>): void => e.preventDefault();

  const validateAndSetFile = (file: File | Blob) => {
    if (file.size > MAX_RESOURCE_FILE_SIZE) {
      toggleNotification(t('validation:fileSizeError'));
    } else {
      setFieldValue(name, file);
    }
  };

  // If the file is an image, automatically resize it.
  // Otherwise, check if it's too large and update the field value.
  const processFile = async (file: File): Promise<void> => {
    if (IMAGE_TYPES.includes(file.type)) {
      const options = {
        maxSizeMB: maxFileSize,
        maxWidthOrHeight: MAX_RESOURCE_IMAGE_WIDTH_HEIGHT,
      };

      try {
        const compressedFile = await imageCompression(file, options);
        validateAndSetFile(compressedFile);
      } catch {
        // Compression failed. Try to set the field value still if the image is small enough.
        validateAndSetFile(file);
      }
    } else {
      validateAndSetFile(file);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = R.path(['currentTarget', 'files', '0'], e);
    processFile(file);
  };

  const handleFileDrop = (e: DragEvent<HTMLElement>): void => {
    e.preventDefault();
    processFile(!!e.dataTransfer && e.dataTransfer.files[0]);
  };

  const renderFileInput = (
    <input ref={fileInputRef} value="" type="file" onChange={handleFileInputChange} />
  );

  const renderFileSelectedText = t('upload-resource:fileSelected', { fileName });

  const renderMobileFileUploadButtonText = fileName
    ? renderFileSelectedText
    : t('upload-resource:uploadFileButtonText');

  const renderMobileUploadFileButton = isMobile && (
    <Button onClick={handleFileInputClick} color="primary" variant="outlined" fullWidth>
      {renderMobileFileUploadButtonText}
    </Button>
  );

  const renderDropZoneText = fileName ? renderFileSelectedText : t('upload-resource:dropZoneText');

  const renderDropZone = isTabletOrDesktop && (
    <Box
      className={classes.dropZone}
      onDragOver={preventDefaultDragBehavior}
      onDragEnter={preventDefaultDragBehavior}
      onDragLeave={preventDefaultDragBehavior}
      onDrop={handleFileDrop}
      onClick={handleFileInputClick}
    >
      <FormHelperText>{renderDropZoneText}</FormHelperText>
    </Box>
  );

  const renderFormHelperText = (
    <FormHelperText>
      {t('upload-resource:fileHelpText', { maxFileSize })} {t('upload-resource:guidelinesInfo')}{' '}
      <TextLink href={urls.guidelines} target="_blank">
        {t('common:guidelinesLink')}
      </TextLink>
      .
    </FormHelperText>
  );

  const renderErrorMessage = <ErrorMessage name={name} component={FormErrorMessage} />;

  return (
    <FormControl>
      {renderFileInput}
      {renderMobileUploadFileButton}
      {renderDropZone}
      {renderFormHelperText}
      {renderErrorMessage}
    </FormControl>
  );
};
