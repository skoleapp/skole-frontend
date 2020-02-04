import { Form } from 'formik';
import styled from 'styled-components';

export const StyledForm = styled(Form)`
    .MuiFormControl-root {
        margin-top: 0.75rem;
    }

    input[type='submit'] {
        display: none;
    }
`;
