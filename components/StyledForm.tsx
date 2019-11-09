import { Form } from 'formik';
import styled from 'styled-components';

export const StyledForm = styled(Form)`
  .MuiFormControl-root,
  .checkbox-section,
  .avatar-section {
    margin-top: 0.5rem;
  }

  .MuiAvatar-root {
    margin: 0 auto;
    height: 12rem;
    width: 12rem;
  }

  .change-avatar {
    input {
      display: none;
    }
  }

  .MuiInput-inputMultiline {
    height: 8rem !important;
    display: flex;
    align-items: start;
    justify-content: start;
  }

  .MuiButton-root {
    margin: 1rem 0;
  }

  .MuiSelect-root {
    text-align: left !important;
  }
`;
