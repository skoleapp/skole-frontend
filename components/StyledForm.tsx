import { Form } from 'formik';
import styled from 'styled-components';

export const StyledForm = styled(Form)`
  .MuiFormControl-root {
    margin-top: 0.5rem;
  }

  .file-input {
    label {
      width: 100%;
    }

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

  .MuiSelect-root {
    text-align: left;
  }
`;
