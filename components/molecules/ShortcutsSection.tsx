import React from 'react';
import styled from 'styled-components';
import shortcuts from '../../static/shortcuts.json';
import { H3, Shortcut } from '../atoms';

const StyledShortcutsContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
`;

const StyledShortcutsSection = styled.div`
  margin-top: 5rem;
`;

export const ShortcutsSection: React.FC = () => (
  <StyledShortcutsSection>
    <H3>Where do you study?</H3>
    <StyledShortcutsContainer>
      {shortcuts.map((s, i) => (
        <Shortcut key={i} text={s.text} iconName={s.iconName} href={s.href} />
      ))}
    </StyledShortcutsContainer>
  </StyledShortcutsSection>
);
