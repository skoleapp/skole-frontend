import { Box, Button, FormControl, FormHelperText, makeStyles } from '@material-ui/core';
import { useNotificationsContext } from 'context';
import { ErrorMessage, FieldAttributes, FormikProps, FormikValues } from 'formik';
import { useMediaQueries } from 'hooks';
import { useTranslation } from 'lib';
import * as R from 'ramda';
import React, { ChangeEvent, DragEvent, useRef } from 'react';
import { BORDER_RADIUS } from 'theme';
import { ACCEPTED_FILES, MAX_FILE_SIZE, truncate } from 'utils';

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
  const fileName = R.propOr('', 'name', field.value);
  const fileInputRef = useRef<HTMLInputElement>(null!);
  const handleFileInputClick = (): false | void => fileInputRef.current.click();
  const preventDefaultDragBehavior = (e: DragEvent<HTMLElement>): void => e.preventDefault();

  const fileSelectedText = t('upload-resource:fileSelected', {
    fileName: truncate(fileName, 20),
  });

  const validateAndSetFile = (file: File): void => {
    if (file.size > MAX_FILE_SIZE) {
      toggleNotification(t('validation:fileSizeError'));
    } else {
      form.setFieldValue(field.name, file);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file: File = R.path(['currentTarget', 'files', '0'], e);
    validateAndSetFile(file);
  };

  const handleFileDrop = (e: DragEvent<HTMLElement>): void => {
    e.preventDefault();
    validateAndSetFile(!!e.dataTransfer && e.dataTransfer.files[0]);
  };

  const renderFileInput = (
    <input
      ref={fileInputRef}
      value=""
      type="file"
      accept={`${ACCEPTED_FILES.toString};capture=camera`}
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
    <FormHelperText>
      {t('upload-resource:maxFileSize')}: {MAX_FILE_SIZE / 1000000} MB
    </FormHelperText>
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
