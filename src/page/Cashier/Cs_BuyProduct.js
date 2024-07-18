import React,{ useState } from 'react'
import {NavLink,Outlet } from 'react-router-dom'
import { menuOrder } from '../../ultis/menuForOrder'
import { menuOrderBuy } from '../../ultis/menuForBuy';

const notActive =
  // ' px-[25px] font-[300] font-sans italic flex items-center text-white text-[14px] border border-black';
  ' justify-center  w-[90%] ml-[10px] rounded-md font-thin font-serif italic flex items-center text-white text-[14px] bg-[#3f6d67e9]';

const activeStyle =
  ' justify-center  w-[90%] ml-[10px] rounded-md font-thin font-serif italic flex items-center text-white text-[14px] bg-[#3f6d676e] ';


const Cs_BuyProduct = () => {
    const [isOrderSubmenuOpen, setIsOrderSubmenuOpen] = useState(false);

    const handleOrderSubmenuToggle = () => {
      setIsOrderSubmenuOpen(!isOrderSubmenuOpen);
    };
    return (
  
      <div className='w-full mt-2'>
        <div className='flex w-[300px]'>
        {menuOrderBuy.map((item) => (
          <NavLink
          to={item.path}
          className={({ isActive }) =>`flex items-center w-[100px] p-0 text-white transition-colors ${isActive ? activeStyle: notActive}`}
          >
          <span className=' flex justify-center py-2 rounded-md'>{item.text}</span>
          </NavLink>
        ))}
        </div>
        <div className=''><Outlet /></div>
      </div>
  
    )
  }
  
export default Cs_BuyProduct