import React, { ReactChild, useEffect, useRef, useState } from 'react';
import { Animated } from '../atoms';
interface Props {
  children: ReactChild;
  time?: number;
}

export const IntersectingWrapper: React.FC<Props> = ({ children, time }) => {
  const element = useRef<HTMLInputElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const node = element.current;
    const observer = new IntersectionObserver((entries): void => {
      entries.forEach(entry => {
        const { isIntersecting } = entry;
        if (!!element && !!element.current) {
          if (isIntersecting) {
            setIsIntersecting(true);
            observer.unobserve(element.current);
          }
        }
      });
    });
    if (node) {
      observer.observe(node);
    }
    return (): void => {
      if (node) {
        observer.unobserve(node);
      }
    };
  }, [element]);

  return (
    <Animated launch={isIntersecting} time={time ? time : 1} ref={element}>
      {children}
    </Animated>
  );
};
