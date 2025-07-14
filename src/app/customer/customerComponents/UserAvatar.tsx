'use client';

import React from 'react';

type Props = {
  name: string;
  size?: number; // Optional prop for scaling avatar (default 40px)
};

export default function UserAvatar({ name, size = 40 }: Props) {
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase();

  return (
    <div
      style={{
        width: size,
        height: size,
      }}
      className="rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 p-0.5 shadow-lg"
    >
      <div
        className="rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-inner"
        style={{ width: '100%', height: '100%', fontSize: size / 2.2 }}
      >
        {initials}
      </div>
    </div>
  );
}
