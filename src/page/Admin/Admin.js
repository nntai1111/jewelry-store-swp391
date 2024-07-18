import React, { useEffect } from 'react';
import Sildebar from '../../components/Admin/SildebarLeftMenu';
import { RiAccountCircleLine } from "react-icons/ri";
import { Outlet, useNavigate } from 'react-router-dom';

export default function Admin() {
    const navigate = useNavigate();

    useEffect(() => {
        const Authorization = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        if (!Authorization || role !== 'admin') {
            navigate('/login');
        }
    }, [navigate]);

    return (
        <>
            <div className='w-full flex h-[100vh] bg-gray-100'>
                <div className='w-[240px] h-[100vh] flex-none bg-white overflow-y-auto z-20 border border-gray-300'>
                    <Sildebar />
                </div>
                <div className='flex-auto border overflow-y-auto '>
                    <div className=''>
                        <div className='fixed top-0 left-0 w-full flex justify-end space-x-2 px-[30px] py-[5px] bg-white border border-gray-300 z-10'>
                            <RiAccountCircleLine className='text-2xl text-blue-800' />
                            <span className='text-blue-800 text-lg font-medium'>{localStorage.getItem('name')} (Admin)</span>
                        </div>
                        <div className='pt-[60px]'>
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
