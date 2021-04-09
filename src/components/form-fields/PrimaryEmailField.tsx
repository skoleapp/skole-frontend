import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import { TextFieldProps } from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import HelpOutlineOutlined from '@material-ui/icons/HelpOutlineOutlined';
import { Field, FormikProps, FormikValues } from 'formik';
import { useTranslation } from 'lib';
import React, { useCallback, useMemo, useState } from 'react';
import { ALLOWED_EMAIL_DOMAINS } from 'utils';

import { DialogHeader, SkoleDialog } from '../dialogs';
import { TextFormField } from './TextFormField';

export const PrimaryEmailField = <T extends FormikValues>(
  props: FormikProps<T> & TextFieldProps,
): JSX.Element => {
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCloseDialog = useCallback((): void => setDialogOpen(false), [setDialogOpen]);

  const inputProps = useMemo(
    () => ({
      endAdornment: (
        <InputAdornment position="end">
          <IconButton onClick={(): void => setDialogOpen(true)}>
            <HelpOutlineOutlined />
          </IconButton>
        </InputAdornment>
      ),
    }),
    [setDialogOpen],
  );

  const renderInput = useMemo(
    () => (
      <Field
        label={t('forms:email')}
        name="email"
        component={TextFormField}
        helperText={t('forms:primaryEmailHelperText')}
        type="email"
        InputProps={inputProps}
        {...props}
      />
    ),
    [inputProps, props, t],
  );

  const renderDialog = useMemo(
    () => (
      <SkoleDialog open={dialogOpen} fullScreen={false}>
        <DialogHeader onClose={handleCloseDialog} />
        <DialogContent>
          <DialogContentText color="textPrimary">
            <Typography variant="subtitle1">{t('common:primaryEmailDialogText')}</Typography>
          </DialogContentText>
          <DialogContentText>
            {ALLOWED_EMAIL_DOMAINS.map((e) => (
              <Typography variant="body2" component="li">
                {e}
              </Typography>
            ))}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCloseDialog} fullWidth>
            {t('common:gotIt')}
          </Button>
        </DialogActions>
      </SkoleDialog>
    ),
    [dialogOpen, handleCloseDialog, t],
  );

  return (
    <>
      {renderInput}
      {renderDialog}
    </>
  );
};
