import { Form } from 'formik';
import styled from 'styled-components';

export const StyledForm = styled(Form)`
  .MuiFormControl-root,
  .checkbox-section,
  .avatar-section {
    margin-top: 0.5rem;
  }

  .custom-label {
    text-align: left;
    font-size: 0.75rem;
    margin: 0.15rem 0;
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
    margin: 0.5rem 0;
  }

  .MuiSelect-root {
    text-align: left !important;
  }
`;
