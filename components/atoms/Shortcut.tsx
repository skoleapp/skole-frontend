import React, { useState } from 'react';
import styled from 'styled-components';
import { Column } from '../containers';
import { Redirect } from '../utils';
import { Icon } from './Icon';

const StyledShortcut = styled.div`
  margin: 0.5rem;
  padding: 0.5rem;
  height: 15rem;
  width: 15rem;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-radius: 0.75rem;
  border: 0.1rem solid var(--black);
  color: var(--black);
  font-size: 1.5rem;
  background: var(--primary);

  &:hover {
    transition: var(--transition);
    transform: var(--scale);
    background: var(--secondary);
    color: var(--primary);
    border-color: var(--primary);
    cursor: pointer;
  }
`;

interface Query {
  schoolType: string;
}

interface Href {
  pathname: string;
  query: Query;
}

interface Props {
  text: string;
  iconName: string;
  href: Href;
}

export const Shortcut: React.FC<Props> = ({ text, iconName, href }) => {
  const [redirecting, setRedirecting] = useState(false);

  if (redirecting) {
    return <Redirect to={href.pathname} />;
  }

  return (
    <StyledShortcut onClick={(): void => setRedirecting(true)}>
      <Column>
        <Icon iconName={iconName} />
        <p>{text}</p>
      </Column>
    </StyledShortcut>
  );
};
