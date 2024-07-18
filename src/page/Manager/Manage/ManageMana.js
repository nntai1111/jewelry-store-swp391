import React from 'react';
import { Outlet, useOutlet } from 'react-router-dom';
import ProductMana from './ProductMana';


export default function ManageMana() {
  const outlet = useOutlet();

  return (
    <div>
      {outlet ? outlet : <ProductMana />}

    </div>
  );
}
