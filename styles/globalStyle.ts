import { createGlobalStyle } from 'styled-components';
import { breakpoints } from './breakpoints';
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
        --black: ${colors.black};
        --grey: ${colors.grey};

        --success: ${colors.success};
        --danger: ${colors.danger};

        --dark-opacity: rgba(0, 0, 0, 0.15);
        
        // Misc 
        --transition: all 0.15s ease-in;
        --border-radius: 0.5rem;
    }

    html,
    body {
        background: var(--secondary);
        font-family: 'Roboto', sans-serif;

        .desktop-only {
            @media only screen and (max-width: ${breakpoints.SM}) {
                display: none;
            }
        }

        .mobile-only {
            @media only screen and (min-width: ${breakpoints.SM}) {
                display: none;
            }
        }

        .flex-flow {
            flex-flow: row wrap;
        }
    }

    // NProgress
    #nprogress {
        .bar {
            height: 0.25rem;
            background: var(--white);
            top: 2.75rem;
            z-index: 1101;

            @media only screen and (min-width: ${breakpoints.MD}) {
                top: 3.75rem;
            }
        }

        .peg {
            box-shadow: none;
            transform: none;
        }

        .spinner-icon {
           display: none; 
        }
    }
`;
