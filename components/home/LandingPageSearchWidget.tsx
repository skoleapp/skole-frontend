import { Box, Button, InputBase } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import React from 'react';
import styled from 'styled-components';
import { breakpoints } from '../../styles';
import { useSearch } from '../../utils';

export const LandingPageSearchWidget: React.FC = () => {
  const { searchValue, handleSubmit, handleChange, placeholder } = useSearch();

  return (
    <StyledSearchWidget onSubmit={handleSubmit}>
      <Box className="flex-flow" display="flex" justifyContent="center">
        <Box className="search-input">
          <Search />
          <InputBase placeholder={placeholder} onChange={handleChange} value={searchValue} />
        </Box>
        <Button type="submit" color="primary" variant="outlined" fullWidth>
          search
        </Button>
      </Box>
    </StyledSearchWidget>
  );
};

const StyledSearchWidget = styled.form`
  .search-input {
    border-radius: var(--border-radius);
    background-color: var(--white);
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 20rem;
    border: 0.05rem solid var(--primary);
    margin: 0.25rem;

    svg {
      align-self: center;
      color: var(--primary);
      margin-left: 0.5rem;
    }

    input {
      padding: 0.65rem;
    }
  }

  .MuiButton-root {
    margin: 0.25rem;
    max-width: 20rem;

    @media only screen and (min-width: ${breakpoints.SM}) {
      width: auto;
    }
  }
`;
