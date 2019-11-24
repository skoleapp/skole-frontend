import { Box, InputBase } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import Router from 'next/router';
import React, { ChangeEvent, SyntheticEvent, useState } from 'react';
import styled from 'styled-components';

export const SearchWidget: React.FC = () => {
  const [search, setSearch] = useState('');

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    Router.push({ pathname: '/search', query: { search } });
  };

  return (
    <form onSubmit={handleSubmit}>
      <StyledSearchWidget display="flex" alignItems="center">
        <Search />
        <InputBase
          placeholder="Search…"
          onChange={(e: ChangeEvent<HTMLInputElement>): void => setSearch(e.target.value)}
          value={search}
        />
        <input type="submit" value="Submit" />
      </StyledSearchWidget>
    </form>
  );
};

const StyledSearchWidget = styled(Box)`
  border-radius: var(--border-radius);
  background-color: rgba(255, 255, 255, 0.15);
  margin: 0 0.5rem;
  display: flex;

  &:hover {
    background-color: rgba(255, 255, 255, 0.25);
  }

  svg {
    margin: 0.25rem;
    align-self: center;
    color: var(--secondary);
  }

  input {
    padding: 0.5rem;
    color: var(--white);
    width: 15rem;
  }

  input[type='submit'] {
    display: none;
  }
`;
