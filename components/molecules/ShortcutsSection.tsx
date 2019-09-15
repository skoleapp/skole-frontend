import React from 'react';
import styled from 'styled-components';
import { shortcuts } from '../../static';
import { H2, Shortcut } from '../atoms';

const StyledShortcutsContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
`;

const StyledShortcutsSection = styled.div``;

export const ShortcutsSection: React.FC = () => (
  <StyledShortcutsSection>
    <H2>Where do you study?</H2>
    <StyledShortcutsContainer>
      {shortcuts.map((s, i) => (
        <Shortcut key={i} text={s.text} iconName={s.iconName} href={s.href} />
      ))}
    </StyledShortcutsContainer>
  </StyledShortcutsSection>
);
