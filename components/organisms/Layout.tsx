import React, { ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';
import styled from 'styled-components';
import { Background, Navbar } from '../molecules';
import { Head } from '../organisms';

interface Props {
  title?: string;
  children: ReactNode;
}

const StyledContainer = styled.div`
  max-height: 100vh;
  position: absolute;
  left: 0;
  width: 100%;
  overflow: hidden;
`;

const Container: React.FC = ({ children }) => <StyledContainer>{children}</StyledContainer>;

export const Layout: React.FC<Props> = ({ title, children }) => (
  <Container>
    <Head title={title} />
    <Navbar />
    <Background />
    {children}
    <ToastContainer />
  </Container>
);
