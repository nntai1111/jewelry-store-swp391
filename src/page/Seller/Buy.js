
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { MdDeleteOutline } from "react-icons/md";
import { useDispatch } from 'react-redux';
import { addCodeOrder, addCustomer, addProductBuy } from '../../store/slice/cardSilec';


const Buy = () => {
  const dispatch = useDispatch()
  const [InvoiceCode, setInvoiceCode] = useState('');
  const [ListInvoice, setListInvoice] = useState(null); // Initialize as null
  const [selectedProduct, setSelectedProduct] = useState(null); // State to store selected product


  const getInvoiceCode = async () => {
    try {
      console.log(`Fetching invoice for code: ${InvoiceCode}`); // Add logging
      const res = await axios.get(`https://jssatsproject.azurewebsites.net/api/BuyOrder/CheckOrder?orderCode=${InvoiceCode}`);
      dispatch(addCodeOrder(InvoiceCode))
      console.log('API response:', res); // Add logging

      if (res && res.data) {
        const Invoice = res.data;
        console.log('Invoice data:', Invoice); // Add logging

        if (Invoice && typeof Invoice === 'object') {
          setListInvoice(Invoice);
          console.log('ListInvoice state set:', Invoice); // Add logging
        } else {
          toast.error('Invalid invoice data');
        }
      } else {
        toast.error('Invalid response structure');
      }
    } catch (error) {
      console.error('Error fetching invoice:', error); // Add logging

      toast.error('Error fetching invoice');
    }
  };

  useEffect(() => {
    console.log('ListInvoice state updated:', ListInvoice); // Add logging
  }, [ListInvoice]);

  function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  const getProductBuy = async (product,phone) => {
    // event.preventDefault();
    try {
      const res = await axios.get(
        `https://jssatsproject.azurewebsites.net/api/Customer/Search?searchTerm=${phone}&pageIndex=1&pageSize=10`
      );
      const item = res.data.data[0];
      dispatch(addCustomer(item));
      dispatch(addProductBuy(product))
    } catch (error) {
      console.error('Error fetching customer or products:', error);
    }
  }
  return (
    <div className='w-full'>
      <div className='w-full h-fit flex justify-evenly'>
        <div className="max-w-full w-full rounded-3xl flex flex-col py-6 pl-6 bg-[#fefffe] bg-clip-padding backdrop-filter backdrop-blur-lg border border-gray-100 text-gray-100 drop-shadow-lg">

          <div className="flex justify-between items-center gap-2">
            <h2 className="text-xl text-black">Check Information Product</h2>
            <p className='cursor-pointer mr-3 p-2 rounded bg-[#edebeb]' onClick={() => { setListInvoice(null); setInvoiceCode(''); }}>
              <MdDeleteOutline size='17px' color='#ef4e4e' />
            </p>
          </div>

          <div className="flex py-4 gap-2.5">
            <div className="w-12/12 h-14 flex rounded-lg border-2 border-solid border-gray-100 items-center">
              <input
                value={InvoiceCode}
                onChange={(event) => setInvoiceCode(event.target.value)}
                placeholder="Invoice Code / Warranty"
                type="text"
                className="w-9/12 h-14 px-4 bg-transparent focus:outline-none text-black"
              />
              <div className="text-gray-600 cursor-pointer flex items-center w-3/12 px-4 bg-transparent appearance-none border-l-2 border-gray-500 h-5/6 focus:outline-none text-lg">
                <span onClick={getInvoiceCode} className='hover:scale-75 duration-500'>Check</span>
              </div>
            </div>

            {ListInvoice && (
              <>
                <div className="w-12/12 h-14 flex rounded-lg border-2 border-solid border-gray-100 items-center">
                  <input
                    value={ListInvoice.customerName}
                    placeholder="Customer Name"
                    className="w-9/12 h-14 px-4 bg-transparent focus:outline-none text-black"
                    readOnly
                  />
                </div>
                <div className="w-12/12 h-14 flex rounded-lg border-2 border-solid border-gray-100 items-center">
                  <input
                    value={ListInvoice.customerPhoneNumber}
                    // onChange={(event) => setCustomerPhoneNumber(event.target.value)}
                    placeholder="Phone Number"
                    className="w-9/12 h-14 px-4 bg-transparent focus:outline-none text-black"
                    readOnly
                  />
                </div>
              </>
            )}
          </div>
          <div class="inline-block min-w-full p-0">
            <div class="overflow-hidden">
              <table
                class="min-w-full text-left text-black text-sm font-light text-surface dark:text-white">
                <thead
                  class="border-b border-neutral-200 font-medium dark:border-white/10">
                  <tr className='text-center'>
                    <th scope="col" class="px-0 py-4">Name</th>
                    <th scope="col" className="pl-6-0 py-4">Price</th>
                    <th scope="col" class="px-6 py-4">Price Order</th>
                    <th scope="col" class="px-0 py-4">Quantity</th>
                    <th scope="col" class="px-6 py-4">Estimate</th>
                    <th scope="col" class="px-0 py-4">Reason</th>
                    <th scope="col" class="px-6 py-4">Apply</th>
                  </tr>
                </thead>
                <tbody>
                  {ListInvoice && ListInvoice.products && ListInvoice.products.map((product, index) => (
                    <tr class="border-b border-neutral-200 transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-white/10 dark:hover:bg-neutral-600">
                      <td class="whitespace-nowrap px-0 py-4 font-medium">{product.code}</td>
                      <td class="whitespace-nowrap pl-6 py-4">{product.name}</td>
                      <td scope="col" class="px-6 py-4">{formatPrice(product.priceInOrder)}</td>
                      <td class="whitespace-nowrap px-0 py-4 text-center">{product.quantity}</td>
                      <td class="whitespace-nowrap px-6 py-4">{formatPrice(product.estimateBuyPrice)}</td>
                      <td scope="col" class="px-0 py-4 text-center">{product.reasonForEstimateBuyPrice}</td>
                      <td scope="col" class="px-6 py-4"><button onClick={()=>getProductBuy(product,ListInvoice.customerPhoneNumber)}>Apply</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Buy;
