import React from 'react';
import ReactQuill from 'react-quill';
import styled from 'styled-components';

const TextEditor: React.FC = (props: any) => <StyledTextEditor {...props} />;

const StyledTextEditor = styled(ReactQuill)`
    .ql-editor {
        max-height: 10rem;
    }
`;

export default TextEditor;
