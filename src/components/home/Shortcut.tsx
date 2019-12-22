import { Card, CardContent, Typography } from '@material-ui/core';
import { SvgIconComponent } from '@material-ui/icons';
import React from 'react';
import styled from 'styled-components';
import { Link } from '../../i18n';

interface Props {
  text: string;
  icon: SvgIconComponent;
  href: string;
}

export const Shortcut: React.FC<Props> = ({ text, icon: Icon, href }) => (
  <Link href={href}>
    <StyledShortcut>
      <CardContent>
        <Icon color="primary" />
        <Typography variant="h6">{text}</Typography>
      </CardContent>
    </StyledShortcut>
  </Link>
);

const StyledShortcut = styled(Card)`
  height: 14rem;
  width: 14rem;
  margin: 0.5rem;
  cursor: pointer;

  .MuiCardContent-root {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;

    .MuiSvgIcon-root {
      height: 5rem;
      width: 5rem;
    }
  }

  &:hover {
    background-color: var(--primary-opacity);
  }
`;
