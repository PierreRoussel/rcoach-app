'use client';
import './Nav.scss';

export default function Nav({ title }: { title?: string }) {
  return (
    <nav className='nav d-flex flex-align-center'>
      <button onClick={() => history.back()} className='btn icon reverse'>
        <i className='iconoir-nav-arrow-left'></i>
      </button>
      {title && <h1>{title}</h1>}
    </nav>
  );
}
