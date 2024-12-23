import React from 'react';
import '../../app/globals.css';
import Link from 'next/link';
import Logout from './logout';


const Navbar = () => {
  return (
    <div className='font-["Poppins"]  flex items-center justify-between lg:px-52  py-5 text-pretty font-bold w-full  fixed top-0 bg-white z-50 shadow-md '>
      <div className='uppercase text-[30px] '>
        <Link href="/">
         Planio
        </Link>
      </div>
      <div className='lg:flex  items-center md:hidden hidden'>
        <ul className='flex gap-5'>
        <Link href="/">
        <li>Home</li>
        </Link>
         
          <li>
            <Link href="/task">Tasks</Link>
          </li>
          <li>Services</li>
          <li>How It Works</li>
          <li>
            <Logout />
          </li>
        </ul>
        <button className='border-solid border-black border-[2px] px-5 py-2 hover:bg-[#32aa27] hover:text-white ml-10 hover:border-white'>
          CONTACT
        </button>
        <div>
        <button aria-label="Show navigation" className="sb-mobile-nav-btn" id="sb-mobile-nav-btn" type="button">
{/* <span className="sb-mobile-nav-btn__line"></span> */}
</button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
