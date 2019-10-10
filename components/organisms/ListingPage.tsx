import React, { useState } from 'react';

interface Props {
  schoolType: string;
}
interface RowProps {
  index: number;
  school: any;
}

const schools = [
  'Turun yliopisto',
  'Åbo Akademi',
  'Aalto-yliopisto',
  'Helsingin yliopisto',
  'Tampereen teknillinen yliopisto',
  'Oulun yliopisto',
  'Vaasan yliopisto',
  'Lappeenrannan–Lahden teknillinen yliopisto'
];

const Row: React.FC<RowProps> = ({ school, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div
      onClick={() => setIsExpanded(!isExpanded)}
      style={{
        backgroundColor: '#f0f0f0',
        borderBottom: '2px solid #e0e0e0',
        borderRight: '2px solid #e0e0e0',
        display: 'flex',
        justifyContent: 'flex-start',
        padding: '20px 10px',
        alignItems: 'center',
        boxSizing: 'border-box'
      }}
    >
      {school}
      {isExpanded ? <div>hehe</div> : null}
    </div>
  );
};

export const ListingPage: React.FC<Props> = () => (
  <div style={{ border: '1px solid #e0e0e0', marginTop: '20px' }}>
    {schools.map((school, index) => (
      <Row school={school} index={index} />
    ))}
  </div>
);
