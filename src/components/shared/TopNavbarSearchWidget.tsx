import InputAdornment from '@material-ui/core/InputAdornment';
import InputBase from '@material-ui/core/InputBase';
import { makeStyles } from '@material-ui/core/styles';
import SearchOutlined from '@material-ui/icons/SearchOutlined';
import { useTranslation } from 'lib';
import Router from 'next/router';
import React, { ChangeEvent, SyntheticEvent, useState } from 'react';
import { BORDER_RADIUS } from 'styles';
import { urls } from 'utils';

const useStyles = makeStyles(({ palette, spacing }) => ({
  inputBase: {
    width: '20rem',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: BORDER_RADIUS,
    color: palette.common.white,
    padding: `${spacing(1)} ${spacing(3)}`,
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
    },
  },
}));

export const TopNavbarSearchWidget: React.FC = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [value, setValue] = useState('');
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => setValue(e.target.value);

  const handleSubmitSearch = async (e: SyntheticEvent): Promise<void> => {
    e.preventDefault();
    setValue('');
    await Router.push({ pathname: urls.search, query: { searchTerm: value } });
    sa_event('submit_search');
  };

  return (
    <form onSubmit={handleSubmitSearch}>
      <InputBase
        value={value}
        placeholder={t('forms:threadSearch')}
        autoComplete="off"
        onChange={handleChange}
        className={classes.inputBase}
        fullWidth
        endAdornment={
          <InputAdornment position="end">
            <SearchOutlined />
          </InputAdornment>
        }
      />
      <input type="submit" value="Submit" />
    </form>
  );
};
