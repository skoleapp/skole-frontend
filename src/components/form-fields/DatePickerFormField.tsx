import {
  FormControl,
  FormHelperText,
  IconButtonProps,
  makeStyles,
  TextFieldProps,
} from '@material-ui/core';
import { FieldAttributes, FormikProps, FormikValues } from 'formik';
import { KeyboardDatePicker } from '@material-ui/pickers';
import React from 'react';

import { useTranslation } from 'lib';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { DATE_PICKER_FORMAT } from 'utils';

const useStyles = makeStyles(({ spacing, palette }) => ({
  arrowButton: {
    margin: spacing(3),
  },
  blackLabel: {
    color: palette.common.black,
  },
}));

interface Props {
  field: FieldAttributes<TextFieldProps>;
  form: FormikProps<FormikValues>;
  helperText: string;
}

// A wrapper around MUI's `TextField` to allow it's usage directly as form field components.
// Ignore: We are not using the `form` prop but be omit it from the rest of the props by destructuring it.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const DatePickerFormField: React.FC<Props> = ({
  field: { name, value },
  form: { setFieldValue },
  helperText,
  ...props
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const arrowButtonProps: Partial<IconButtonProps> = {
    size: 'small',
  };

  const handleChange = (value: MaterialUiPickersDate | null) => setFieldValue(name, value);
  const renderBlackLabel = (label: string) => <span className={classes.blackLabel}>{label}</span>;

  return (
    <FormControl>
      <KeyboardDatePicker
        value={value}
        onChange={handleChange}
        format={DATE_PICKER_FORMAT}
        leftArrowButtonProps={arrowButtonProps}
        rightArrowButtonProps={arrowButtonProps}
        invalidDateMessage={t('validation:invalidDate')}
        minDateMessage={t('validation:minDate')}
        maxDateMessage={t('validation:maxDate')}
        okLabel={t('common:confirm')}
        cancelLabel={renderBlackLabel(t('common:cancel'))}
        clearLabel={renderBlackLabel(t('common:clear'))}
        clearable
        {...props}
      />
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  );
};
