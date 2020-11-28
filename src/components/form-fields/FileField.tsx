import { Box, Button, FormControl, FormHelperText, makeStyles } from '@material-ui/core';
import { useNotificationsContext } from 'context';
import { ErrorMessage, FieldAttributes, FormikProps, FormikValues } from 'formik';
import { useMediaQueries } from 'hooks';
import { useTranslation } from 'lib';
import * as R from 'ramda';
import React, { ChangeEvent, DragEvent, useRef } from 'react';
import { BORDER_RADIUS } from 'theme';
import {
  ACCEPTED_RESOURCE_FILES,
  IMAGE_TYPES,
  MAX_RESOURCE_FILE_SIZE,
  MAX_RESOURCE_IMAGE_WIDTH_HEIGHT,
  truncate,
} from 'utils';
import imageCompression from 'browser-image-compression';
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

export const FileField: React.FC<Props> = ({ form, field }) => {
  const classes = useStyles();
  const { isMobile, isTabletOrDesktop } = useMediaQueries();
  const { t } = useTranslation();
  const { toggleNotification } = useNotificationsContext();
  const _fileName = R.propOr('', 'name', field.value);
  const fileName = truncate(_fileName, 20);
  const maxFileSize = MAX_RESOURCE_FILE_SIZE / 1000000; // Convert to megabytes.
  const fileInputRef = useRef<HTMLInputElement>(null!);
  const handleFileInputClick = (): false | void => fileInputRef.current.click();
  const preventDefaultDragBehavior = (e: DragEvent<HTMLElement>): void => e.preventDefault();
  const fileSelectedText = t('upload-resource:fileSelected', { fileName });

  const validateAndSetFile = (file: File | Blob) => {
    if (file.size > MAX_RESOURCE_FILE_SIZE) {
      toggleNotification(t('validation:fileSizeError'));
    } else {
      form.setFieldValue(field.name, file);
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
    <input
      ref={fileInputRef}
      value=""
      type="file"
      accept={ACCEPTED_RESOURCE_FILES.toString()}
      capture="environment" // Outward-facing camera.
      onChange={handleFileInputChange}
    />
  );

  const renderMobileUploadFileButton = isMobile && (
    <Button onClick={handleFileInputClick} color="primary" variant="outlined" fullWidth>
      {t('upload-resource:uploadFileButtonText')}
    </Button>
  );

  const renderDropZone = isTabletOrDesktop && (
    <Box
      className={classes.dropZone}
      onDragOver={preventDefaultDragBehavior}
      onDragEnter={preventDefaultDragBehavior}
      onDragLeave={preventDefaultDragBehavior}
      onDrop={handleFileDrop}
      onClick={handleFileInputClick}
    >
      <FormHelperText>{t('upload-resource:dropZoneText')}</FormHelperText>
    </Box>
  );

  const renderFormHelperText = !fileName && (
    <FormHelperText>{t('upload-resource:fileHelpText', { maxFileSize })}</FormHelperText>
  );

  const renderFileSelectedText = !!fileName && <FormHelperText>{fileSelectedText}</FormHelperText>;
  const renderErrorMessage = <ErrorMessage name={field.name} component={FormErrorMessage} />;

  return (
    <FormControl>
      {renderFileInput}
      {renderMobileUploadFileButton}
      {renderDropZone}
      {renderFormHelperText}
      {renderFileSelectedText}
      {renderErrorMessage}
    </FormControl>
  );
};
