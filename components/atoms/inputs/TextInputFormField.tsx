import { ErrorMessage } from 'formik';
import styled from 'styled-components';
import { FormFieldProps } from '../../../interfaces';
import { Column } from '../../containers';
import { FormErrorMessage } from '../FormErrorMessage';
import { Label } from './Label';

export const StyledTextInput = styled.input`
  border: 0.1rem solid var(--white);
  border-radius: 0.75rem;
  margin: 0.5rem;
  text-align: center;
  height: 2.5rem;
  width: 18rem;
  font-size: 1.05rem;
  box-shadow: var(--box-shadow);

  &:hover,
  &:focus {
    outline: none;
  }
`;

export const TextInputFormField: React.FC<FormFieldProps> = ({ field, label, ...props }) => (
  <Column>
    <Label>{label}</Label>
    <StyledTextInput {...field} {...props} />
    <ErrorMessage name={field.name} component={FormErrorMessage} />
  </Column>
);
