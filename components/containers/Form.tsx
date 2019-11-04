import { Form } from 'formik';
import styled from 'styled-components';

export const StyledForm = styled(Form)`
  .MuiFormControl-root,
  .checkbox-section,
  .avatar-section {
    margin-top: 0.5rem;
  }

  .avatar-section {
    .MuiAvatar-root {
      margin: 0 auto;
      height: 12rem;
      width: 12rem;
    }

    input {
      display: none;
    }

    .MuiButton-root {
      margin: 1rem 0;
    }
  }

  .MuiInput-inputMultiline {
    height: 8rem !important;
    display: flex;
    align-items: start;
    justify-content: start;
  }
`;
