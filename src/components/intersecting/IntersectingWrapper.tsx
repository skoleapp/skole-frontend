import React, { useEffect, useRef, useState, ReactChild } from "react";
import { Animated } from "./styles";

type Props = {
  children: ReactChild;
  time?: number;
};

const IntersectingWrapper = (props: Props) => {
  const { children, time } = props;
  const element = useRef<HTMLInputElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    let node = element.current;
    const observer = new IntersectionObserver(entries => {
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
    return () => {
      if (node) {
        observer.unobserve(node);
      }
    };
  }, [element]);

  return (
    <Animated launch={isIntersecting} time={!!time ? time : 1} ref={element}>
      {children}
    </Animated>
  );
};
export default IntersectingWrapper;
