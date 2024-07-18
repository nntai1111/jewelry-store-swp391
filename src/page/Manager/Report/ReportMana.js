import React from 'react'
import { Outlet, useOutlet } from 'react-router-dom';
import InvoiceMana from './InvoiceMana';
export default function ReportMana() {
    const outlet = useOutlet();

    return (
        <div>
            {outlet ? outlet : <InvoiceMana />}
        </div>
    );
}
