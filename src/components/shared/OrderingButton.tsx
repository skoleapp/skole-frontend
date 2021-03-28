import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Fade from '@material-ui/core/Fade';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import { makeStyles } from '@material-ui/core/styles';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import { useOrderingContext } from 'context';
import { useTranslation } from 'lib';
import React, { KeyboardEventHandler, MouseEvent, useCallback, useMemo, useState } from 'react';
import { Ordering } from 'types';

import { Emoji } from './Emoji';

const useStyles = makeStyles(({ spacing }) => ({
  button: {
    borderRadius: '0.25rem',
    padding: `${spacing(1)} ${spacing(2)}`,
  },
}));

export const OrderingButton: React.FC = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { ordering, setOrdering } = useOrderingContext();
  const [selectionOpen, setSelectionOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleCloseSelection = (): void => setSelectionOpen(false);

  const handleButtonClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>): void => {
      setAnchorEl(e.currentTarget);
      setSelectionOpen(!selectionOpen);
    },
    [selectionOpen],
  );

  const handleChangeSelection = useCallback(
    (ordering: Ordering) => async (): Promise<void> => {
      handleCloseSelection();
      setOrdering(ordering);
    },
    [setOrdering],
  );

  const handleSelectionListKeyDown: KeyboardEventHandler<HTMLUListElement> = useCallback(
    (e): void => {
      if (e.key === 'Tab') {
        e.preventDefault();
        handleCloseSelection();
      }
    },
    [],
  );

  const renderOrderingEmoji = useMemo(() => <Emoji emoji={ordering === 'newest' ? '🆕' : '🚀'} />, [
    ordering,
  ]);

  const renderButton = useMemo(
    () => (
      <Button
        onClick={handleButtonClick}
        endIcon={<KeyboardArrowDown color="disabled" />}
        className={classes.button}
      >
        {ordering}
        {renderOrderingEmoji}
      </Button>
    ),
    [classes.button, handleButtonClick, ordering, renderOrderingEmoji],
  );

  const renderPopper = useMemo(
    () => (
      <Popper open={selectionOpen} anchorEl={anchorEl} placement="bottom" transition>
        {({ TransitionProps }): JSX.Element => (
          <Fade {...TransitionProps} timeout={500}>
            <Paper>
              <ClickAwayListener onClickAway={handleCloseSelection}>
                <MenuList autoFocusItem={selectionOpen} onKeyDown={handleSelectionListKeyDown}>
                  <MenuItem onClick={handleChangeSelection('best')}>
                    {t('common:best')}
                    <Emoji emoji="🚀" />
                  </MenuItem>
                  <MenuItem onClick={handleChangeSelection('newest')}>
                    {t('common:newest')}
                    <Emoji emoji="🆕" />
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    ),
    [anchorEl, handleChangeSelection, handleSelectionListKeyDown, selectionOpen, t],
  );

  return (
    <>
      {renderButton}
      {renderPopper}
    </>
  );
};
