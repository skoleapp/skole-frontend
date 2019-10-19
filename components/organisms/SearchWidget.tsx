import { Formik } from 'formik';
import Router from 'next/router';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { closeWidgets, toggleSearchInput } from '../../actions';
import { SearchFormProps, State, WidgetOpenProps } from '../../interfaces';
import { NavbarIcon } from '../atoms';
import { useHandleClickOutside } from '../hooks';
import { SearchInputSection } from '../molecules';

export const initialValues = {
  search: ''
};

const StyledSearchWidget = styled.div`
  display: flex;
  justify-content: center;
`;

const SearchInput = styled.div<WidgetOpenProps>`
  position: absolute;
  height: auto;
  width: auto;
  top: 5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: var(--white);
  visibility: ${({ open }): string => (open ? 'visible' : 'hidden')};
  border-radius: 0 0 var(--border-radius) var(--border-radius);
  padding: 1rem 0.5rem;
  border: var(--black-border);
  border-style: none solid solid solid;
`;

// TODO: Implement a proper search widget
export const SearchWidget: React.FC = () => {
  const { searchInputOpen } = useSelector((state: State) => state.ui);
  const dispatch = useDispatch();
  const { node, toggleSelf } = useHandleClickOutside(toggleSearchInput, searchInputOpen);

  const onSubmit = (values: SearchFormProps): void => {
    const { search } = values;
    Router.push({ pathname: '/search', query: { search } });
    dispatch(closeWidgets());
  };

  return (
    <StyledSearchWidget ref={node}>
      <NavbarIcon onClick={toggleSelf} iconName="search" />
      <SearchInput open={searchInputOpen}>
        <Formik component={SearchInputSection} onSubmit={onSubmit} initialValues={initialValues} />
      </SearchInput>
    </StyledSearchWidget>
  );
};
