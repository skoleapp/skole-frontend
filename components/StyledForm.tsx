import { Form } from 'formik';
import styled from 'styled-components';

export const StyledForm = styled(Form)`
  .MuiFormControl-root {
    margin-top: 0.5rem;
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
    text-align: left;
  }
`;
