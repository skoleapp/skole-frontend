import React, { ReactElement, useState, useEffect, useRef } from 'react';
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
    const [state, setState] = useState({ height: 0, width: 0 })
    const prevChildren = usePrevious(children);
    const ref = useRef()

    const updatePosition = () => {
        const { offsetHeight, offsetWidth } = ref.current;

        this.setState({
            height: offsetHeight,
            width: offsetWidth,
        });
    };

    useEffect(() => {
        if (prevChildren !== children) {
            updatePosition()
        }
    }, [prevChildren])

    componentDidUpdate(nextProps: Props) {
        if (this.props.children !== nextProps.children) {
            this.updatePosition();
        }
    }

    componentDidMount() {
        setTimeout(this.updatePosition, 0);
    }

    render() {
        const { children, style, scrollTop, pageBoundingRect } = this.props;

        const { height, width } = this.state;

        const isStyleCalculationInProgress = width === 0 && height === 0;

        const shouldMove = style.top - height - 5 < scrollTop;

        const top = shouldMove ? style.bottom + 5 : style.top - height - 5;

        const left = clamp(style.left - width / 2, 0, pageBoundingRect.width - width);

        const childrenWithProps = React.Children.map(children, child =>
            React.cloneElement(child, {
                onUpdate: () => {
                    this.setState(
                        {
                            width: 0,
                            height: 0,
                        },
                        () => {
                            setTimeout(this.updatePosition, 0);
                        },
                    );
                },
                popup: {
                    position: shouldMove ? 'below' : 'above',
                },
            }),
        );

        return (
            <div
                className="PdfHighlighter__tip-container"
                style={{
                    visibility: isStyleCalculationInProgress ? 'hidden' : 'visible',
                    top,
                    left,
                }}
                ref="container"
            >
                {childrenWithProps}
            </div>
        );
    }
}
