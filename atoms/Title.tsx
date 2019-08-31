import styled, { TitleProps } from 'styled-components';

export const Title = styled.h1<TitleProps>`
    font-family: ${props => props.font};
    font-size: 50px;
    text-align: center;
`;
