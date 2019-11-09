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
    <StyledSearchWidget className="search">
      <form onSubmit={handleSubmit}>
        <div className="search-icon">
          <SearchIcon />
        </div>
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
  position: relative;
  border-radius: var(--border-radius);
  background-color: rgba(255, 255, 255, 0.15);
  width: 100%;
  display: flex;
  align-items: center;
  width: auto;

  &:hover {
    background-color: rgba(255, 255, 255, 0.25);
  }

  .search-icon {
    width: 2.25rem;
    height: 100%;
    position: absolute;
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--secondary);
  }

  .input-input {
    padding-left: 2.25rem;
    width: 100%;
    color: var(--white);
    margin-top: 0.25rem;
    width: 15rem;
  }

  .submit {
    display: none;
  }
`;
