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
    display: flex !important;
    align-items: center;

    &:hover {
      background-color: rgba(255, 255, 255, 0.25);
    }

    .search-icon {
      width: 2rem;
      height: 100%;
      position: absolute;
      
      svg {
        width: 1.75rem;
        color: var(--secondary);
        margin-top: 0.25rem;
      }
    }

    .input-input {
      color: var(--white);
      width: 15rem;
      padding-left: 2rem;
      padding-top: 0.65rem;
      height 1rem;
    }

    .submit {
      display: none;
    }
`;
