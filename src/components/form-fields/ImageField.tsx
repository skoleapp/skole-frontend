import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import imageCompression from 'browser-image-compression';
import { ErrorMessage, FieldAttributes, FormikProps, FormikValues } from 'formik';
import { useTranslation } from 'lib';
import * as R from 'ramda';
import React, { ChangeEvent, useCallback, useMemo, useRef } from 'react';
import { IMAGE_TYPES, MAX_IMAGE_FILE_SIZE, MAX_IMAGE_WIDTH_HEIGHT, truncate } from 'utils';

import { FormErrorMessage } from './FormErrorMessage';

interface Props {
  form: FormikProps<FormikValues>;
  field: FieldAttributes<FormikValues>;
}

export const ImageField: React.FC<Props> = ({
  form: { setFieldValue, setFieldError },
  field: { name, value },
}) => {
  const { t } = useTranslation();
  const _fileName = R.propOr('', 'name', value);
  const fileName = truncate(_fileName, 20);
  const maxFileSize = MAX_IMAGE_FILE_SIZE / 1000000; // Convert to megabytes.
  const fileInputRef = useRef<HTMLInputElement>(null!);
  const handleFileInputClick = (): false | void => fileInputRef.current.click();

  const validateAndSetFile = useCallback(
    (file: File | Blob): void => {
      if (file.size > MAX_IMAGE_FILE_SIZE) {
        setFieldError(name, t('validation:fileSizeError'));
      } else {
        setFieldValue(name, file);
      }
    },
    [name, setFieldError, setFieldValue, t],
  );

  // If the file is an image, automatically resize it.
  // Otherwise, check if it's too large and update the field value.
  const processFile = useCallback(
    async (file: File): Promise<void> => {
      if (IMAGE_TYPES.includes(file.type)) {
        const options = {
          maxSizeMB: maxFileSize,
          maxWidthOrHeight: MAX_IMAGE_WIDTH_HEIGHT,
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
    },
    [maxFileSize, validateAndSetFile],
  );

  const handleFileInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>): void => {
      const file = R.path(['currentTarget', 'files', '0'], e);
      processFile(file);
    },
    [processFile],
  );

  const renderFileInput = useMemo(
    () => <input ref={fileInputRef} value="" type="file" onChange={handleFileInputChange} />,
    [handleFileInputChange],
  );

  const renderUploadButton = useMemo(
    () => (
      <FormControl>
        <Button onClick={handleFileInputClick} variant="outlined">
          {t('forms:uploadImage')}
        </Button>
      </FormControl>
    ),
    [t],
  );

  const renderFileSelectedText = useMemo(
    () => !!fileName && <FormHelperText>{t('forms:selected', { fileName })}</FormHelperText>,
    [fileName, t],
  );

  const renderErrorMessage = useMemo(
    () => <ErrorMessage name={name} component={FormErrorMessage} />,
    [name],
  );

  return (
    <FormControl>
      {renderFileInput}
      {renderUploadButton}
      {renderFileSelectedText}
      {renderErrorMessage}
    </FormControl>
  );
};
