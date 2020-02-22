import { createGlobalStyle } from 'styled-components';

import { base } from './base';
import { muiOverrides } from './mui-overrrides';
import { nProgress } from './nprogress';

export const GlobalStyle = createGlobalStyle`
    ${base}
    ${nProgress}
    ${muiOverrides}
`;
