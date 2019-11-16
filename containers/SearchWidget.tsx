import { Box, InputBase } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import Router from 'next/router';
import React, { ChangeEvent, SyntheticEvent, useState } from 'react';
import styled from 'styled-components';

export const SearchWidget: React.FC = () => {
  const [searchInputValue, setSearchInputValue] = useState('');

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    Router.push({ pathname: '/search', query: { searchInputValue } });
  };

  return (
    <StyledSearchWidget display="flex" alignItems="center">
      <form onSubmit={handleSubmit}>
        <Search />
        <InputBase
          placeholder="Search…"
          classes={{
            root: 'input-root',
            input: 'input-input'
          }}
          inputProps={{ 'aria-label': 'search' }}
          onChange={(e: ChangeEvent<HTMLInputElement>): void => setSearchInputValue(e.target.value)}
          value={searchInputValue}
        />
        <input className="submit" type="submit" value="Submit" />
      </form>
    </StyledSearchWidget>
  );
};

const StyledSearchWidget = styled(Box)`
  form {
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

    .input-input {
      color: var(--white);
      width: 15rem;
    }

    .submit {
      display: none;
    }
  }
`;
