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

/* export const Background = styled.div`
  height: 100%;
  width: 100%;
  background-color: tan;
  background: url('https://www.fftelecoms.org/app/uploads/2014/02/portable_addiction_nouvelles_technologies.jpg')
    no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  opacity: 0.3;
  position: absolute;
  left: 0px;
  top: 0px;
  z-index: -1;
`;
 */
