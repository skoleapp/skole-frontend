import styled from 'styled-components';

const StyledHeader = styled.h1`
  margin: 0.5rem;
  font-family: 'Ubuntu Mono', monospace;
  color: var(--primary);
  font-size: 4.5rem;
  text-shadow: -0.05rem 0 var(--black), 0 0.05rem var(--black), 0.05rem 0 var(--black),
    0 -0.05rem var(--black);
  text-align: center;
`;

export const Header: React.FC = () => <StyledHeader>skole</StyledHeader>;
