import React from 'react';
import './Bento.scss';

export default function Bento(params: { children: any; className?: string }) {
  return (
    <div className={`bento ${params.className || ''}`}>
      {params.children}
    </div>
  );
}
