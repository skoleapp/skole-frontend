import React from 'react';
import styled from 'styled-components';
import { ShortcutProps } from '../../interfaces';
import { Shortcut } from '../atoms';

const StyledShortcutsContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
  margin-top: 2rem;
`;

const StyledShortcutsSection = styled.div``;

interface Props {
  shortcuts: ShortcutProps[];
}

export const ShortcutsSection: React.FC<Props> = ({ shortcuts }) => (
  <StyledShortcutsSection>
    <StyledShortcutsContainer>
      {shortcuts.map((s, i) => (
        <Shortcut key={i} text={s.text} iconName={s.iconName} href={s.href} />
      ))}
    </StyledShortcutsContainer>
  </StyledShortcutsSection>
);
