import { createGlobalStyle } from 'styled-components';

interface GlobalStyleProps {
  color?: string;
}

export const Background = createGlobalStyle<GlobalStyleProps>`
  body {
    background-color: ${(props: GlobalStyleProps): string =>
      props.color ? props.color : 'var(--secondary)'};
  }
`;
