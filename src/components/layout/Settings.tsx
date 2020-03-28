import { Fade, Paper } from '@material-ui/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';

import { toggleSettings } from '../../actions';
import { State } from '../../types';
import { useSettings } from '../../utils';
import { ModalHeader } from '../shared';
import { StyledModal } from '../shared/StyledModal';

export const Settings: React.FC = () => {
    const { settings } = useSelector((state: State) => state.ui);
    const { renderSettingsCardContent } = useSettings({ modal: true });
    const dispatch = useDispatch();
    const handleClose = (): AnyAction => dispatch((toggleSettings(false) as unknown) as AnyAction);

    return (
        <StyledModal open={!!settings} onClose={handleClose} autoHeight>
            <Fade in={!!settings}>
                <Paper>
                    <ModalHeader onCancel={handleClose} />
                    {renderSettingsCardContent}
                </Paper>
            </Fade>
        </StyledModal>
    );
};
