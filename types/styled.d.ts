import "styled-components";

declare module "styled-components" {
  export interface AnimatedProps {
    launch: boolean;
    time?: number;
  }

  export interface TitleProps {
    font?: string;
    size?: number;
  }
  export interface FlexboxProps {
    justifyContent?: string;
    alignItems?: string;
    alignContent?: string;
  }
}
