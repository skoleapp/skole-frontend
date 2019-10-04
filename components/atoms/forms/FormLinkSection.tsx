import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';
import { Anchor } from '../Anchor';

const StyledFormLinkSection = styled.div`
  margin: 1rem 0;
`;

interface Props {
  text: string;
  href: string;
}

export const FormLinkSection: React.FC<Props> = ({ text, href }) => (
  <StyledFormLinkSection>
    <Link href={href}>
      <Anchor variant="red">{text}</Anchor>
    </Link>
  </StyledFormLinkSection>
);
