import { Link } from 'react-router-dom';
import './Home.scss';
export default function Header() {
  return (
    <Link to='/seance' className='mon-planning d-flex w-100 flex-justify-between'>
      <span className='color-black'>Commencer à m'entrainer</span>
      <i className='iconoir-nav-arrow-right'></i>
    </Link>
  );
}
