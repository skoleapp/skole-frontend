import { Box, InputBase } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import React from 'react';
import styled from 'styled-components';

import { useSearch } from '../../utils';

export const TopNavbarSearchWidget: React.FC = () => {
    const { searchValue, handleSubmit, handleChange, placeholder } = useSearch();

    const handleSearchIconClick = (): void => {
        document.getElementById('myInput')?.focus();
    };

    return (
        <StyledSearchWidget onSubmit={handleSubmit}>
            <Box className="search-input">
                <Search onClick={handleSearchIconClick} />
                <InputBase placeholder={placeholder} onChange={handleChange} value={searchValue} id="myInput" />
                <input type="submit" value="Submit" />
            </Box>
        </StyledSearchWidget>
    );
};

const StyledSearchWidget = styled.form`
    .search-input {
        border-radius: var(--border-radius);
        background-color: rgba(255, 255, 255, 0.15);
        margin: 0 0.5rem;
        display: flex;
        align-items: center;

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
    }
`;
