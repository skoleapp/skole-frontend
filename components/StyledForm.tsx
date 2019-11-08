import { Form } from 'formik';
import styled from 'styled-components';

export const StyledForm = styled(Form)`
  .MuiFormControl-root,
  .checkbox-section,
  .avatar-section {
    margin-top: 0.5rem;
  }

  .MuiAvatar-root {
    margin: 1rem auto;
    height: 12rem;
    width: 12rem;
  }

  .change-avatar {
    input {
      display: none;
    }

    .MuiButton-root {
      margin: 0.5rem 0;
    }
  }

  .MuiInput-inputMultiline {
    height: 8rem !important;
    display: flex;
    align-items: start;
    justify-content: start;
  }
`;
