import React from 'react'
import { Outlet, useOutlet } from 'react-router-dom';
import Invoice from './Invoice';
export default function Report() {
    const outlet = useOutlet();

    return (
        <div>
            {outlet ? outlet : <Invoice />}
        </div>
    );
}
