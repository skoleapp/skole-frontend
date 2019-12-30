import { Box, Button, InputBase } from '@material-ui/core';

import React from 'react';
import { Search } from '@material-ui/icons';
import styled from 'styled-components';
import { useSearch } from '../../utils';

export const LandingPageSearchWidget: React.FC = () => {
    const { searchValue, handleSubmit, handleChange, placeholder } = useSearch();

    return (
        <StyledSearchWidget onSubmit={handleSubmit}>
            <Box display="flex" justifyContent="center">
                <Box className="search-input">
                    <InputBase placeholder={placeholder} onChange={handleChange} value={searchValue} />
                </Box>
                <Button type="submit" color="primary" variant="contained">
                    <Search />
                </Button>
            </Box>
        </StyledSearchWidget>
    );
};

const StyledSearchWidget = styled.form`
    .search-input {
        border-radius: var(--border-radius) 0 0 var(--border-radius);
        background-color: var(--white);
        display: flex;
        width: 100%;
        max-width: 20rem;
        border: 0.05rem solid var(--primary);

        input {
            padding: 0.75rem;
        }
    }

    .MuiButton-root {
        border-radius: 0 var(--border-radius) var(--border-radius) 0;
    }
`;
