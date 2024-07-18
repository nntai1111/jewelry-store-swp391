import React from 'react'
import { Outlet, useOutlet } from 'react-router-dom';
import PromotionListMana from './PromotionListMana';
export default function Promotion() {
    const outlet = useOutlet();
    return (

        <div>
            {outlet ? outlet : <PromotionListMana />}
        </div>
    )
}
