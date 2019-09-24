import React from 'react';
import styled from 'styled-components';
import { ShortcutProps } from '../../interfaces';
import { H3, Shortcut } from '../atoms';

const StyledShortcutsContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
  margin-top: 2rem;
`;

const StyledShortcutsSection = styled.div``;

interface Props {
  shortcuts: ShortcutProps[];
  title?: string;
}

export const ShortcutsSection: React.FC<Props> = ({ shortcuts, title }) => (
  <StyledShortcutsSection>
    <H3>{title}</H3>
    <StyledShortcutsContainer>
      {shortcuts.map((s, i) => (
        <Shortcut key={i} text={s.text} iconName={s.iconName} href={s.href} />
      ))}
    </StyledShortcutsContainer>
  </StyledShortcutsSection>
);
