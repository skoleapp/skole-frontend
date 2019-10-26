import { createMuiTheme } from '@material-ui/core';
import { createGlobalStyle } from 'styled-components';

const primary = 'rgb(173, 54, 54)';
const white = '#ffffff';

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: primary
    },
    secondary: {
      main: white
    }
  },
  typography: {
    fontSize: 14
  }
});

export const GlobalStyle = createGlobalStyle`
    // Keyframes
    @keyframes fadeIn {
        from {
            opacity: 0;
            visibility: hidden;
        }
        to {
            opacity: 1;
            visibility: visible;
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
            visibility: visible;
        }
        to {
            opacity: 0;
            visibility: hidden;
        }
    }

    :root {
        /* Colors */
        --primary: ${primary};
        --secondary: rgba(250, 242, 222);
      
        --white: #ffffff;
        --black: #000000;

        --light-opacity: rgba(0, 0, 0, 0.15);
        
        // Misc 
        --transition: all 0.15s ease-in;
        --border-radius: 0.5rem;
    }

    html,
    body {
        background: var(--secondary);
        font-family: 'Roboto', sans-serif;
    }

    // NProgress
    #nprogress {
        .bar {
            height: 0.25rem;
            background: var(--white);
        }

        .peg {
            box-shadow: 0 0 10px var(--white), 0 0 5px var(--white);
        }

        .spinner-icon {
           display: none; 
        }
    }
`;
