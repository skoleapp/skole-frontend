import 'styled-components';

declare module 'styled-components' {
    export interface AnimatedProps {
        launch: boolean;
        time?: number;
    }

    export interface TitleProps {
        font: string;
    }
}
