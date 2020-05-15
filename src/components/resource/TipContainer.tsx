import { CSSProperties } from '@material-ui/core/styles/withStyles';
import React, { Children, cloneElement, ReactElement, useEffect, useRef, useState } from 'react';
import { LTWH } from 'src/types';
import { usePrevious } from 'src/utils';

interface Props {
    children: ReactElement;
    style: { top: number; left: number; bottom: number };
    scrollTop: number;
    pageBoundingRect: LTWH;
}

const clamp = (value: number, left: number, right: number): number => Math.min(Math.max(value, left), right);

const TipContainer: React.FC<Props> = ({ children, style, scrollTop, pageBoundingRect }) => {
    const [state, setState] = useState({ height: 0, width: 0 });
    const prevChildren = usePrevious(children);
    const ref = useRef<HTMLDivElement>(null);

    const updatePosition = (): void => {
        if (!!ref.current) {
            const { offsetHeight, offsetWidth } = ref.current;
            setState({ height: offsetHeight, width: offsetWidth });
        }
    };

    useEffect(() => {
        if (prevChildren !== children) {
            updatePosition();
        }
    }, [prevChildren]);

    const { height, width } = state;
    const isStyleCalculationInProgress = width === 0 && height === 0;
    const visibility = isStyleCalculationInProgress ? 'hidden' : 'visible';
    const shouldMove = style.top - height - 5 < scrollTop;
    const top = shouldMove ? style.bottom + 5 : style.top - height - 5;
    const left = clamp(style.left - width / 2, 0, pageBoundingRect.width - width);

    const containerStyle: CSSProperties = {
        visibility,
        top,
        left,
    };

    const childrenWithProps = Children.map(children, child =>
        cloneElement(child, {
            onUpdate: () =>
                setState({
                    width: 0,
                    height: 0,
                }),
            popup: {
                position: shouldMove ? 'below' : 'above',
            },
        }),
    );

    return (
        <div style={containerStyle} ref={ref}>
            {childrenWithProps}
        </div>
    );
};
