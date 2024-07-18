
import React from 'react';
import logo from '../../assets/logo.png';
import { sidebarMenuAdmin } from '../../ultis/MenuOfAdmin/MenuAdmin';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';

import { toast } from 'react-toastify';
import { BiLogOut } from "react-icons/bi";

const Sildebar = () => {

    const [isReportOpen, setIsReportOpen] = useState(null);

    const handleReportOpenToggle = (menuItem) => {
        setIsReportOpen((prevState) => {
            if (prevState === menuItem) {
                return null;
            } else {
                return menuItem;
            }
        });
    };

    const handleLogOut = () => {
        localStorage.clear();
    };

    return (
        <div className="bg-white text-black flex flex-col w-60 h-full">
            <div className="w-full mb-14 h-20 py-12 flex flex-col gap-2 font-serif text-blue-800 text-2xl justify-center items-center ">
                <img className="mt-12 w-24 object-contain" src={logo} alt="Logo" />
                <span className='font-bold' >Jewelry Store</span>
            </div>
            <div className="flex flex-col">
                {sidebarMenuAdmin.map(item => (
                    <div key={item.path} className="my-4">
                        <NavLink
                            to={item.path}
                            end={item.end}
                            className={({ isActive }) => isActive && (item.text !== 'Report' && item.text !== 'Manage' && item.text !== 'Promotion') ? 'text-blue-600 font-bold' : 'text-black'}
                            onClick={
                                item.text === 'Report'
                                    ? () => handleReportOpenToggle('report')
                                    : item.text === 'Manage'
                                        ? () => handleReportOpenToggle('manage')
                                        : item.text === 'Promotion'
                                            ? () => handleReportOpenToggle('promotion')
                                            : () => handleReportOpenToggle('')
                            }
                        >
                            <div className="flex items-center w-full p-2 hover:bg-gray-100 rounded">
                                {item.iconAdmin}
                                <span className="ml-4 text-lg">{item.text}</span>
                                <span className='ml-auto'>
                                    {isReportOpen === 'report' && item.text === 'Report'
                                        ? item.iconAdmin3
                                        : isReportOpen === 'manage' && item.text === 'Manage'
                                            ? item.iconAdmin3
                                            : isReportOpen === 'promotion' && item.text === 'Promotion'
                                                ? item.iconAdmin3
                                                : item.iconAdmin2}</span>
                            </div>
                        </NavLink>

                        <div
                            className={`transition-all duration-1000 ease-in-out overflow-hidden
                                 ${isReportOpen === 'report' && item.text === 'Report' ? 'max-h-screen opacity-100 delay-2000' : 'max-h-0 opacity-0 delay-2000'}`}
                        >
                            {isReportOpen === 'report' && item.text === 'Report' && item.subMenu.length > 0 && (
                                <div className="pl-8">
                                    {item.subMenu.map(subItem => (
                                        <NavLink
                                            to={subItem.path}
                                            key={subItem.path}
                                            className={({ isActive }) => isActive ? 'text-blue-600 font-bold' : 'text-black'}
                                        >
                                            <div className="flex items-center my-4  px-2 hover:bg-gray-100 rounded">
                                                {subItem.iconAdmin}
                                                <span className="ml-4">{subItem.text}</span>
                                            </div>
                                        </NavLink>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div
                            className={`transition-all duration-1000 ease-in-out overflow-hidden
                                 ${isReportOpen === 'manage' && item.text === 'Manage' ? 'max-h-screen opacity-100 delay-2000' : 'max-h-0 opacity-0 delay-2000'}`}
                        >
                            {isReportOpen === 'manage' && item.text === 'Manage' && item.subMenu.length > 0 && (
                                <div className="pl-8">
                                    {item.subMenu.map(subItem => (
                                        <NavLink
                                            to={subItem.path}
                                            key={subItem.path}
                                            className={({ isActive }) => isActive ? 'text-blue-600 font-bold' : 'text-black'}
                                        >
                                            <div className="flex items-center my-4 px-2 hover:bg-gray-100 rounded">
                                                {subItem.iconAdmin}
                                                <span className="ml-4 ">{subItem.text}</span>
                                            </div>
                                        </NavLink>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div
                            className={`transition-all duration-1000 ease-in-out overflow-hidden
                                 ${isReportOpen === 'promotion' && item.text === 'Promotion' ? 'max-h-screen opacity-100 delay-2000' : 'max-h-0 opacity-0 delay-2000'}`}
                        >
                            {isReportOpen === 'promotion' && item.text === 'Promotion' && item.subMenu.length > 0 && (
                                <div className="pl-8">
                                    {item.subMenu.map(subItem => (
                                        <NavLink
                                            to={subItem.path}
                                            key={subItem.path}
                                            className={({ isActive }) => isActive ? 'text-blue-600 font-bold' : 'text-black'}
                                        >
                                            <div className="flex items-center my-4 px-2 hover:bg-gray-100 rounded">
                                                {subItem.iconAdmin}
                                                <span className="ml-4">{subItem.text}</span>
                                            </div>
                                        </NavLink>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>
                ))}
                <NavLink to="/login" onClick={handleLogOut} className={({ isActive }) => isActive ? 'text-blue-600 font-bold' : 'text-black'}>
                    <div className="flex items-center w-full p-2 hover:bg-gray-100 rounded">
                        <BiLogOut size={24} className="mr-2" color="#000055" />
                        <span className="ml-4 text-lg">Logout</span>
                    </div>
                </NavLink>

            </div>
        </div>
    );
};

export default Sildebar;

