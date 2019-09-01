import 'styled-components';

declare module 'styled-components' {
  declare interface AnimatedProps {
    launch: boolean;
    time?: number;
  }

  declare interface TitleProps {
    font?: string;
    size?: number;
  }
  declare interface FlexBoxProps {
    justifyContent?: string;
    alignItems?: string;
    alignContent?: string;
    width?: string;
    flexDirection?: string;
  }
  declare interface ButtonProps {
    width?: string;
  }
}
