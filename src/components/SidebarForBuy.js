import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteProduct, deleteCustomer, deleteProductAll, addProduct, deleteProductBuy, deleteProductBuyAll} from '../store/slice/cardSilec';
import { MdDeleteOutline } from 'react-icons/md';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaFileInvoiceDollar } from "react-icons/fa6";
import 'react-confirm-alert/src/react-confirm-alert.css';


const SidebarForBuy = () => {
  const [currentTime, setCurrentTime] = useState(new Date().toISOString());
  const [customerPhoneNumber, setCustomerPhoneNumber] = useState('');
  const [description, setDescription] = useState('');
  const [productCodesAndQuantity, setProductCodesAndQuantity] = useState({});
  const [productCodesAndEstimatePrices, setProductCodesAndEstimatePrices] = useState({});
  const [productName, setProductName] = useState('');
  const [diamondGradingCode, setDiamondGradingCode] = useState('');
  const [materialId, setMaterialId] = useState(0);
  const [materialWeight, setMaterialWeight] = useState(0);
  const [categoryTypeId, setCategoryTypeId] = useState(0);
  const [buyPrice, setBuyPrice] = useState(0);

  const [total, setTotal] = useState(0);

  const dispatch = useDispatch();
  const CartProductBuy = useSelector(state => state.cart.CartProductBuy);
  const CusPoint = useSelector(state => state.cart.CusPoint);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toISOString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const calculateTotals = () => {
      let totalValue = 0;
      CartProductBuy.forEach(product => {
        totalValue += product.estimateBuyPrice * product.quantity;
      });
      setTotal(totalValue);
    };
    calculateTotals();

    const codesAndQuantity = CartProductBuy.reduce((acc, product) => {
      acc[product.code] = product.quantity;
      return acc;
    }, {});
    setProductCodesAndQuantity(codesAndQuantity);

    const codesAndEstimate = CartProductBuy.reduce((acc, product) => {
      acc[product.code] = product.estimateBuyPrice;
      return acc;
    }, {});
    setProductCodesAndEstimatePrices(codesAndEstimate);

    if (CusPoint?.phone) {
      setCustomerPhoneNumber(CusPoint.phone);
    }
  }, [CartProductBuy, CusPoint]);

  const formatPrice = price => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
 
  const handleSubmitOrder = async (isDraft = false) => {
    const data = {
      customerPhoneNumber,
      createDate: new Date().toISOString(),
      staffId: localStorage.getItem('staffId'), 
      description,
      productCodesAndQuantity,
      productCodesAndEstimatePrices,
    };

    console.log(data);
    if (!productCodesAndQuantity || Object.keys(productCodesAndQuantity).length === 0) {
      toast.error('No Product');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
    
      let res =  await axios.post('https://jssatsproject.azurewebsites.net/api/BuyOrder/CreateInCompanyOrder', 
         data, 
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (res.status === 201 || res.status === 200) {
        toast.success('Success');
        dispatch(deleteCustomer());
        dispatch(deleteProductAll());
        setDescription('');
      } else {
        toast.error('Add Fail');
        console.error('Unexpected response:', res);
      }
    } catch (error) {
      console.error('Error adding invoice:', error);
      if (error.response) {
        console.error('Error response:', error.response);
        toast.error(`Add Fail: ${error.response.data.message || 'Unknown error'}`);
      } else if (error.request) {
        console.error('Error request:', error.request);
        toast.error('Add Fail: No response received from server');
      } else {
        console.error('Error message:', error.message);
        toast.error(`Add Fail: ${error.message}`);
      }
    }
  };

  return (<>


    <div className='flex justify-center '>
      <div className='shadow-md shadow-gray-600 pt-[10px] rounded-2xl w-[90%] h-[34em] bg-[#f3f1ed] mt-[20px]'>
        <div className='flex justify-end'>
          <div className='flex justify-end px-[15px] text-black font-thin'>{currentTime}</div>
        </div>
        <div className='flex justify-start px-[15px] text-black'>
          <p className='font-light'>Address:</p>
          <span className='w-full flex justify-center font-serif'>Jewelry Store</span>
        </div>
        <div className='flex items-center px-[15px] text-[#000]'>
          <p className='w-[260px] font-light '>Customer Phone:</p>
          {CusPoint && (
            <>
              <span id="phone" className='w-full flex items-center justify-between'>
                {CusPoint.phone}
                <span onClick={() => dispatch(deleteCustomer())} className='cursor-pointer rounded-md bg-[#fff] px-1 py-1'>
                  <MdDeleteOutline size='17px' color='#ef4e4e' />
                </span>
              </span>
            </>
          )}
        </div>
        <div className='grid grid-cols-3 border border-x-0 border-t-0 mx-[10px] border-b-black pb-[2px] mb-2'>
          <div className='col-start-1 col-span-2 flex pl-[5px]'>Item</div>
          <div className='col-start-3 ml-6 flex justify-start'>Price</div>
        </div>
        <div id='screenSeller' className=' h-[40%] overflow-y-auto mb-2'>
          {CartProductBuy && CartProductBuy.map((item, index) => {
            return (
              <div className='grid grid-cols-6 '>
                <div className='col-start-1 col-span-4 flex px-[10px] text-sm'>{item.name}</div>
                <div className='col-start-5 flex ml-[65px] justify-end text-[#d48c20] px-[10px]'>{formatPrice(item.estimateBuyPrice * item.quantity)}</div>
                <span onClick={() => dispatch(deleteProductBuy(item))} className='col-start-6 ml-8 w-[20px] flex items-center cursor-pointer rounded-md'><MdDeleteOutline size='17px' color='#ef4e4e' /></span>
                {!item.startDate && (
                  <div className='col-start-1 col-span-6 flex px-[14px] text-xs text-red-600 mt-[-6px]'>x{item.quantity}</div>
                )}
              </div>
            )
          })}
        </div>
        <div className='border mx-[15px] border-x-0 border-b-0 border-t-black grid grid-cols-2 py-2'>
          <div className='font-bold'>PAYMENT</div>
          <input value={description} onChange={(even) => setDescription(even.target.value)} className="w-42 h-full border-none rounded-md outline-none text-sm bg-[#ffff] text-red font-semibold  pl-2" type="text" placeholder="Note" />
        </div>
        <div className='px-[15px] grid grid-cols-2 grid-rows-2'>
          <div className='row-start-1 font-thin'>Total:</div>
          <div className='col-start-2 flex justify-end'>{formatPrice(total.toFixed())}</div>
        </div>
        <div className='bg-[#87A89E] h-[50px] grid grid-cols-3 '>

          <div className='mx-[15px] flex items-center font-bold text-lg'>{formatPrice(total)}<span>.đ</span></div>
          <div className='col-start-3 flex gap-2 justify-end items-center mr-[15px]'>
            <span
              onClick={() => {
                dispatch(deleteCustomer());
                dispatch(deleteProductBuyAll());
              }} className='col-start-6 ml-8 w-[20px] flex items-center cursor-pointer rounded-md bg-[#fef7f7] py-1 hover:bg-[#ffffff]'><MdDeleteOutline size='20px' color='#ef4e4e' />
            </span>
          </div>

        </div>
      </div>
    </div>
    <div className='mt-2'>
      <div className='flex justify-center'>
        <button type='submit'
          onClick={() => {
            handleSubmitOrder();
            dispatch(deleteCustomer());
            dispatch(deleteProductBuyAll());
          }} class="m-0 relative cursor-pointer opacity-90 hover:opacity-100 transition-opacity p-[2px] bg-black rounded-[16px] bg-gradient-to-t from-[#5d5fef6b] to-[#7b7deb] active:scale-95">
          <span class="w-full h-full flex items-center gap-2 px-8 py-3 text-white rounded-[14px] bg-gradient-to-t from-[#5D5FEF] to-[#5D5FEF]">
            <FaFileInvoiceDollar /> Invoice
          </span>
        </button>
      </div>
    </div>
  </>
  )
}

export default SidebarForBuy