import { InputAdornment, InputBase, makeStyles } from '@material-ui/core';
import { SearchOutlined } from '@material-ui/icons';
import { useSearch } from 'hooks';
import React from 'react';
import { BORDER_RADIUS } from 'theme';

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
  const { handleSubmit, inputProps } = useSearch();

  return (
    <form onSubmit={handleSubmit}>
      <InputBase
        {...inputProps}
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
