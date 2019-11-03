import { Avatar, Button } from '@material-ui/core';
import { ErrorMessage, FieldProps, getIn } from 'formik';
import React from 'react';
import styled from 'styled-components';
import { FormErrorMessage } from './FormErrorMessage';

export const AvatarFormField: React.FC<FieldProps> = ({ field, form }) => {
  const errorText = getIn(form.touched, field.name) && getIn(form.errors, field.name);

  return (
    <StyledTextFormField>
      <Avatar src="https://myconstructor.gr/img/customers-imgs/avatar.png" />
      <input accept="image/*" id="upload-avatar" type="file" />
      <label htmlFor="upload-avatar">
        <Button variant="outlined" color="primary" component="span" fullWidth>
          upload new avatar
        </Button>
      </label>
      <ErrorMessage name={field.name} component={FormErrorMessage}>
        {errorText}
      </ErrorMessage>
    </StyledTextFormField>
  );
};

const StyledTextFormField = styled.div`
  margin: 1rem 0;

  .MuiAvatar-root {
    margin: 0 auto;
    height: 12rem;
    width: 12rem;
  }

  input {
    display: none;
  }

  .MuiButton-root {
    margin-top: 2rem;
  }
`;
