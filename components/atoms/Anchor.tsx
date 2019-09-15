import styled from 'styled-components';

const getColorForVariant = (variant: string): string => {
  switch (variant) {
    case 'black':
      return 'var(--black)';
    case 'red':
      return 'var(--primary)';
    case 'white':
      return 'var(--white)';
    default:
      return '';
  }
};

interface Props extends React.HTMLProps<HTMLAnchorElement> {
  variant?: string;
}

export const Anchor = styled.a<Props>`
  color: ${({ variant }): string => (variant ? getColorForVariant(variant) : 'var(--black)')};
  text-decoration: none;
  margin: 0.5rem;

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;
