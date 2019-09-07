import styled from 'styled-components';

export const StyledTitle = styled.h1`
  font-size: 2rem;
  color: var(--primary);
  text-shadow: 0.05rem 0.05rem var(--black);
`;

interface Props extends React.HTMLProps<HTMLHeadingElement> {
  text: string;
}

export const Title: React.FC<Props> = ({ text }) => <StyledTitle>{text}</StyledTitle>;
