import { createGlobalStyle } from 'styled-components';

import { base } from './base';
import { nProgress } from './nprogress';

export const GlobalStyle = createGlobalStyle`
    ${base}
    ${nProgress}
`;
