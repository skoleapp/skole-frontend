import { createGlobalStyle } from 'styled-components';
import { colors } from './colors';

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
        --primary: ${colors.primary};
        --secondary: ${colors.secondary};
      
        --white: ${colors.white};
        --black: ${colors.white};

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
