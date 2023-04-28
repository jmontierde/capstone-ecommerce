import { Link } from 'react-router-dom';
import Search from './Search';
import {BsPerson, BsCart3} from 'react-icons/bs';
const Header = (keyword) => {



  return (
    <>
        <nav className='flex container py-6 px-12 m-auto justify-between font-custom cursor-pointer'>
          <ul className='flex  space-x-6 space-y-auto uppercase fo'>
            <h2 className='mr-16 font-bold text-2xl uppercase'>Vape Hood</h2>


            <li><Link to="/">Home</Link></li>
            <li><Link to="/product">Product</Link></li>
            <li><Link to="/service">Service</Link></li>
            <li><Link to="/company">Company</Link></li>
            <li><Link to="/news">News</Link></li>
            <li><Link to="/contact">Contact</Link></li>
    
          </ul>
          <div className='flex text-[#525151] space-x-6 space-y-auto  '>
            
            <Search  keyword={keyword}/>
           
            
            <BsCart3 className='m-auto text-2xl'/>
            <BsPerson className='m-auto text-2xl'/>
          </div>
        </nav>
    </>
  )
}

export default Header