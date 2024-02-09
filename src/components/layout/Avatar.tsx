import './Avatar.scss';
import React from 'react';

export default function Avatar(params: { chain?: string; children?: any }) {
  const initials =
    params.chain &&
    params.chain.split(' ')[0][0] + params.chain.split(' ')[1][0];
  return <div className='avatar'>{params.children || initials}</div>;
}
