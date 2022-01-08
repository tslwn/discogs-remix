import React from 'react';

interface TopbarProps {
  left?: React.ReactNode;
  right?: React.ReactNode;
}

export default function TopBar({ left, right }: TopbarProps) {
  return (
    <div className="flex items-center justify-between p-4 top-bar">
      <div className="flex items-center">{left}</div>
      <div className="flex items-center">{right}</div>
    </div>
  );
}
