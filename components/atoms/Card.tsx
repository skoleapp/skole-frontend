import styled from 'styled-components';

interface CardProps {
  width?: string;
  height?: string;
  margin?: string;
}

export const Card = styled.div<CardProps>`
  width: ${(props): string | undefined => (props.width ? props.width : '250px')};
  height: ${(props): string | undefined => (props.height ? props.height : '350px')};
  border-radius: 6px;
  -webkit-box-shadow: 0px 0px 17px 1px rgba(0, 0, 0, 0.5);
  -moz-box-shadow: 0px 0px 17px 1px rgba(0, 0, 0, 0.5);
  box-shadow: 0px 0px 17px 1px rgba(0, 0, 0, 0.5);
  background-color: whitesmoke;
  overflow: hidden;
  margin: ${(props): string | undefined => props.margin};
`;
