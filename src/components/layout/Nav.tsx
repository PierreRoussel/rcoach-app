'use client';
import './Nav.scss';

export default function Nav() {
  return (
    <nav className='nav d-flex'>
      <button onClick={() => history.back()} className='btn icon reverse'>
        <i className='iconoir-nav-arrow-left'></i>
      </button>
    </nav>
  );
}
