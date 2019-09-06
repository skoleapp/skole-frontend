import styled from 'styled-components';

interface AnchorProps {
  font?: string;
  size?: number;
  margin?: string;
  textAlign?: string;
}

export const Anchor = styled.a<AnchorProps>`
  color: #428bca;
  font-family: ${(props): string => (props.font ? props.font : 'Verdana')};
  font-size: ${(props): string => (props.size ? props.size + 'px' : '16px')};
  margin: ${(props): string => (props.margin ? props.margin : '22px')};
  text-align: ${(props): string => (props.textAlign ? props.textAlign : 'center')};
  text-decoration: none;
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;
