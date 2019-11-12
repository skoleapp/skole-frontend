import { InputBase } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
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
    <StyledSearchWidget className="search-widget">
      <form onSubmit={handleSubmit}>
        <SearchIcon className="search-icon" />
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

const StyledSearchWidget = styled.div`
  form {
    border-radius: var(--border-radius);
    background-color: rgba(255, 255, 255, 0.15);
    display: flex;
    align-items: center;
    margin: 0 0.5rem;

    &:hover {
      background-color: rgba(255, 255, 255, 0.25);
    }

    .search-icon {
      margin: 0 0.25rem;
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
