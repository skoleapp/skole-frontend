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

  .MuiSelect-root {
    text-align: left;
  }
`;
