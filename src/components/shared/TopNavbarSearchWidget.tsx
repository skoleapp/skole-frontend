import InputAdornment from '@material-ui/core/InputAdornment';
import InputBase from '@material-ui/core/InputBase';
import { makeStyles } from '@material-ui/core/styles';
import SearchOutlined from '@material-ui/icons/SearchOutlined';
import { useSearch } from 'hooks';
import React from 'react';
import { BORDER_RADIUS } from 'styles';

const useStyles = makeStyles(({ palette, spacing }) => ({
  inputBase: {
    width: '20rem',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: BORDER_RADIUS,
    color: palette.common.white,
    padding: `${spacing(1)} ${spacing(3)}`,
    marginRight: spacing(2),
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
    },
  },
}));

export const TopNavbarSearchWidget: React.FC = () => {
  const classes = useStyles();
  const { searchInputProps, handleSubmitSearch } = useSearch();

  return (
    <form onSubmit={handleSubmitSearch}>
      <InputBase
        {...searchInputProps}
        className={classes.inputBase}
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
