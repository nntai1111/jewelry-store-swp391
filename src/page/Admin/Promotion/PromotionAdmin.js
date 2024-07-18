import React from 'react'
import { Outlet, useOutlet } from 'react-router-dom';
import PromotionList from './PromotionList';
export default function Promotion() {
    const outlet = useOutlet();
    return (

        <div>
            {outlet ? outlet : <PromotionList />}
        </div>
    )
}
