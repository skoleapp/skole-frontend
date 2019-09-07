import React, { ChangeEvent } from 'react';
import styled from 'styled-components';

interface TextAreaProps {
  placeholder: string;
  maxLength: number;
  cols: number;
  rows: number;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}

const StyledTextarea = styled.textarea`
  maxlength: ${(props): number | undefined => props.maxLength};
  cols: ${(props): number | undefined => props.cols};
  rows: ${(props): number | undefined => props.rows};
  resize: none;
`;

export const Textarea: React.FC<TextAreaProps> = ({
  placeholder,
  maxLength,
  rows,
  cols,
  onChange
}) => (
  <StyledTextarea
    placeholder={placeholder}
    maxLength={maxLength}
    rows={rows}
    cols={cols}
    onChange={onChange}
  />
);
