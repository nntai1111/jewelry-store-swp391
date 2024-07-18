import React from 'react';
import { Outlet, useOutlet } from 'react-router-dom';
import ProductAdmin from './ProductAdmin';


export default function Manage() {
  const outlet = useOutlet();

  return (
    <div>
      {outlet ? outlet : <ProductAdmin />}

    </div>
  );
}
