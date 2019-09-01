import styled from 'styled-components';

export const Input = styled.input.attrs(props => ({
  type: props.type,
  size: props.size || '1em'
}))`
  color: black;
  font-size: 1em;
  border: 2px solid white;
  border-radius: 3px;
  margin: 7px;
  width: 120px;
`;
