import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import { IconButtonProps } from '@material-ui/core/IconButton';
import { TextFieldProps } from '@material-ui/core/TextField';
import { KeyboardDatePicker } from '@material-ui/pickers/DatePicker';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'; // eslint-disable-line no-restricted-imports
import { FieldAttributes, FormikProps, FormikValues } from 'formik';
import { useTranslation } from 'lib';
import React from 'react';
import { DATE_PICKER_FORMAT } from 'utils';

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

  const arrowButtonProps: Partial<IconButtonProps> = {
    size: 'small',
  };

  const handleChange = (value: MaterialUiPickersDate | null): void => setFieldValue(name, value);

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
        cancelLabel={t('common:cancel')}
        clearLabel={t('common:clear')}
        disableFuture
        clearable
        {...props}
      />
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  );
};
