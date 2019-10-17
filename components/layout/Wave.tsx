import React from 'react';
export const Wave: React.FC = () => (
  <svg
    style={{
      left: 0,
      bottom: 0,
      pointerEvents: 'none',
      fill: 'var(--primary)',
      margin: '-1rem'
    }}
    fillRule="evenodd"
    clipRule="evenodd"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1920 240"
  >
    <g>
      <path d="M1920,144.5l0,95.5l-1920,0l0,-65.5c196,-36 452.146,-15.726 657.5,8.5c229.698,27.098 870,57 1262.5,-38.5Z" />
    </g>
  </svg>
);
