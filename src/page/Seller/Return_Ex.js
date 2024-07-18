import React,{ useState } from 'react'
import {NavLink, Outlet } from 'react-router-dom'
import { menuRE } from '../../ultis/menuForRE'

const notActive =
  // ' px-[25px] font-[300] font-sans italic flex items-center text-white text-[14px] border border-black';
  ' justify-center  w-[10%] ml-[10px] rounded-md font-thin font-serif italic flex items-center text-white text-[14px] bg-[#3f6d67e9]';

const activeStyle =
  ' justify-center  w-[10%] ml-[10px] rounded-md font-thin font-serif italic flex items-center text-white text-[14px] bg-[#3f6d676e] ';

const Return_Ex = () => {
  const [isOrderSubmenuOpen, setIsOrderSubmenuOpen] = useState(false);

  const handleOrderSubmenuToggle = () => {
    setIsOrderSubmenuOpen(!isOrderSubmenuOpen);
  };
  return (
    <div className='w-full bg-[#e8e1e1c4] h-[100vh] py-5'>
      <div className='flex mt-3 justify-start ml-3'>
      {menuRE.map((item) => (
        <NavLink
        to={item.path}
        className={({ isActive }) =>`flex items-center p-0 text-white transition-colors ${isActive ? activeStyle: notActive}`}
        >
        <span className='px-3 py-2 rounded-md'>{item.text}</span>
        </NavLink>
      ))}
      </div>
      <div className='flex justify-center p-4 h-[80vh]'><Outlet /></div>
    </div>

  )
}

export default Return_Ex