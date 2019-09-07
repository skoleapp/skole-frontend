import styled from 'styled-components';

interface Props extends React.HTMLProps<HTMLAnchorElement> {
  color?: string;
}

export const Anchor = styled.a<Props>`
  color: ${(props): string => (props.color ? props.color : 'var(--primary)')};
  text-decoration: none;
  margin: 0.5rem;

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;
