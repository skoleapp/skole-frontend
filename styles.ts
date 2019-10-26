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
        /* Backgrounds */
        --background: var(--secondary);
      
        /* Colors */
        --primary: ${primary};
        --secondary: rgba(250, 242, 222);
      
        --white: #ffffff;
        --black: #000000;
      
        --success: lightgreen;
        --warning: yellow;
        --danger: red;
        
        // Animations
        --scale: scale(1.04);
        --transition: all 0.15s ease-in;
        --menu-speed: 0.3s;
        --fade-in: fadeIn 0.25s forwards;
        --fade-out: fadeOut 0.25s forwards;
      
        // Shadows
        --text-shadow: 0 0 0.05rem var(--black);
        --box-shadow: 0 0 0.25rem 0.01rem var(--black);
      
        // Borders
        --primary-border: 0.1rem solid var(--primary);
        --secondary-border: 0.1rem solid var(--secondary);
        --black-border: 0.1rem solid var(--black);
        --white-border: 0.1rem solid var(--white);
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
