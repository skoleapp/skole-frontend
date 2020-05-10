import { Box, InputBase } from '@material-ui/core';
import { SearchOutlined } from '@material-ui/icons';
import React from 'react';
import styled from 'styled-components';

import { useSearch } from '../../utils';

export const TopNavbarSearchWidget: React.FC = () => {
    const { handleSubmit, inputProps } = useSearch();

    const handleSearchIconClick = (): void => {
        const input = document.getElementById('top-navbar-input-base');
        !!input && input.focus();
    };

    return (
        <StyledSearchWidget onSubmit={handleSubmit}>
            <Box id="top-navbar-search-input">
                <SearchOutlined onClick={handleSearchIconClick} />
                <InputBase id="top-navbar-input-base" {...inputProps} />
                <input type="submit" value="Submit" />
            </Box>
        </StyledSearchWidget>
    );
};

const StyledSearchWidget = styled.form`
    #top-navbar-search-input {
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
            cursor: pointer;
        }

        input {
            padding: 0.5rem;
            color: var(--white);
            width: 15rem;
        }
    }
`;
