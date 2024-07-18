import React, { useState, useEffect } from 'react'

import { fetchStatusInvoice } from '../../apis/jewelryService'
import Popup from 'reactjs-popup';
import QRCode from "react-qr-code";
import SignatureCanvas from 'react-signature-canvas'
import axios from 'axios';
import { toast } from 'react-toastify';
import { current } from '@reduxjs/toolkit';
import { format, parseISO } from 'date-fns';
import ReactPaginate from 'react-paginate';
import { AiFillLeftCircle, AiFillRightCircle } from 'react-icons/ai';
import { IconContext } from 'react-icons';
import { Link, useNavigate } from 'react-router-dom';
const FormatDate = ({ isoString }) => {
  const parsedDate = parseISO(isoString);
  const formattedDate = format(parsedDate, 'HH:mm yyyy-MM-dd');
  return (
    <div>
      <p>{formattedDate}</p>
    </div>
  );
};

const Cs_Process = () => {
  const [currentTime, setCurrentTime] = useState(new Date().toISOString());
  const [listInvoice, setListInvoice] = useState([]); // list full invoice
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [IdOrder, setIdOrder] = useState('');
  const [ChosePayMethodID, setChosePayMethodID] = useState(3);
  const [PaymentID, setPaymentID] = useState();
  const [totalProduct, setTotalProduct] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const handlePageClick = (event) => {
    getInvoice(event.selected + 1);
  };

  useEffect(() => {
    getInvoice(1);
  }, []);

  const getInvoice = async (page) => {
    try {
      let res = await fetchStatusInvoice('processing', page);
      if (res?.data?.data) {
        setListInvoice(res.data.data);
        setTotalProduct(res.data.totalElements);
        setTotalPage(res.data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);

    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCreateDate(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  const [createDate, setCreateDate] = useState(new Date().toISOString());

  const handleComplete = async (id) => {
    await axios.put(`https://jssatsproject.azurewebsites.net/api/SellOrder/UpdateStatus?id=${id}`, {
      status: 'completed',
    });
  };


  const handleSearch = (event) => {
    const searchTerm = event.target.value.trim();
    setSearchTerm(searchTerm);
    if (searchTerm === '') {
      getInvoice(1);
    } else {
      getWaitingSearch(searchTerm, 1);
    }
  };

  const getWaitingSearch = async (phone, page) => {
    try {
      const res = await axios.get(
        `https://jssatsproject.azurewebsites.net/api/sellorder/search?statusList=processing&customerPhone=${phone}&ascending=true&pageIndex=${page}&pageSize=10`
      );
      if (res.data && res.data.data) {
        console.log('Search Results:', res.data.data); // Check the search results here
        setListInvoice(res.data.data);
        setTotalProduct(res.data.totalElements);
        setTotalPage(res.data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to fetch customers');
    }
  };

  function calculateTotalPromotionValue(item) {
    return item.sellOrderDetails.reduce((total, orderDetail) => {
      return total + (orderDetail.unitPrice * orderDetail.promotionRate);
    }, 0);
  }

  return (
    <div>
      <form className="max-w-md mx-auto">
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search Item, ID in here..."
            required
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </form>
      <div className='my-0 mx-auto mt-2'>
        <div className='grid grid-cols-4 w-full px-10 overflow-y-auto h-[78vh]'>
          {listInvoice && listInvoice.length > 0 && listInvoice.map((item, index) => (
            <div key={index} className='shadow-md shadow-gray-600 pt-[10px] rounded-2xl w-[93%] h-[29em] bg-[#ffff] mb-[20px]'>
              <div className='flex justify-between px-[15px] text-black font-thin'>
                <span className='px-2 bg-[#e7ac2c] rounded-md text-[#fff]'>{item.paymentMethod}</span>
                <span className='flex justify-end font-thin italic'><FormatDate isoString={item.createDate} /></span>
              </div>
              <div className='text-[15px]'>
                <div className='flex px-[15px] gap-3 '>
                  <span className='font-serif'>Code:</span>
                  <span className='font-thin'>{item.code}</span>
                  <span className='font-serif'>-</span>
                  <span className='font-thin'>{item.id}</span>
                  <div className="group relative w-fit">
                      <Link to={`/cs_bill/${item.id}`} className="m-0 p-0 w-fit bg-white text-black">
                        <svg
                          stroke-linejoin="round"
                          stroke-linecap="round"
                          stroke="currentColor"
                          stroke-width="2"
                          viewBox="0 0 24 24"
                          height="15"
                          width="15"
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-fit hover:scale-125 duration-200 hover:bg-white"
                          fill="none"
                        >
                          <path fill="none" d="M0 0h24v24H0z" stroke="none"></path>
                          <path d="M8 9h8"></path>
                          <path d="M8 13h6"></path>
                          <path
                            d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12z"
                          ></path>
                        </svg>
                      </Link>
                      <span
                        className="absolute -top-7 left-[95%] -translate-x-[1%] z-20 origin-left scale-0 px-3 rounded-lg border border-gray-300 bg-white py-2 text-sm font-bold shadow-md transition-all duration-300 ease-in-out group-hover:scale-100"
                      >
                        Bill
                      </span>
                    </div>
                </div>
                <div className='flex justify-start px-[15px] text-black'>
                  <input hidden className='bg-[#e9ddc200] text-center font-thin' value={item.customerId} readOnly />
                </div>
                <div className='flex justify-start px-[15px] text-black'>
                  <p className='font-serif w-full'>Customer Name: </p>
                  <span className='w-full flex justify-center font-thin'>{item.customerName}</span>
                </div>
                <div className='flex  px-[15px] text-black'>
                  <p className='w-[260px] font-serif '>Staff Name:</p>
                  <span className='w-full flex font-thin'>{item.staffName}</span>
                </div>
              </div>
              <div className='grid grid-cols-3 border-x-0 font-extralight italic border-t-0 border mx-[10px] border-b-black pb-[2px]'>
                <div className='col-start-1 col-span-2 flex pl-[5px]'>Item</div>
                <div className='col-start-3 ml-6 flex justify-start'>Price</div>
              </div>
              <div id='screenSeller' className='grid-cols-3 h-[45%] overflow-y-auto'>
                {item.sellOrderDetails.map((orderDetail, index) => (
                  <div key={index} className='grid grid-cols-3 mx-[10px] border-b-black pb-[2px]'>
                    <div className='col-start-1 col-span-2 flex pl-[5px] items-center text-[12px]'>{orderDetail.productName}</div>
                    <div className='col-start-3 gap-1 flex justify-end text-[12px]'>
                      <span>{formatPrice(orderDetail.unitPrice - orderDetail.unitPrice * orderDetail.promotionRate)}</span>
                      <span className='text-red-500 flex justify-center text-[12px]'>{' x '}{orderDetail.quantity}</span>
                    </div>
                    <span className='text-[12px]'>(-{formatPrice(orderDetail.unitPrice * orderDetail.promotionRate)})</span>
                  </div>
                ))}
              </div>
              <div className='mx-[15px] flex justify-between'>
                <div className='font-bold'>Total</div>
                <span className='font-semibold'>{formatPrice(item.finalAmount)}</span>
              </div>
              <div className='mx-[15px] border-t-black flex justify-between'>
                <div className='font-thin italic'>Discount Promotion</div>
                <span className='font-thin'>{formatPrice(calculateTotalPromotionValue(item))}</span>
              </div>
              <div className='mx-[15px] border-t-black flex justify-between pb-2'>
                <div className='font-thin italic'>Discount Rate</div>
                <span className='font-thin'>{item.specialDiscountRate}</span>
              </div>
              <div className=' flex justify-around'>
                <button type='button' className="m-0 py-2 border border-[#ffffff] bg-[#469086] text-white px-10 rounded-md  ">Pay Succsess</button>
              </div>
              <div className='mt-2 bg-white rounded-md shadow-md w-full flex justify-center overflow-x-auto'>
                {item.description}
              </div>
            </div>
          ))}
        </div>
      </div>
      <ReactPaginate
        onPageChange={handlePageClick}
         pageRangeDisplayed={3}
         marginPagesDisplayed={2}
         pageCount={totalPage}
         pageClassName="mx-1"
         pageLinkClassName="px-3 py-2 rounded hover:bg-gray-200 text-black"
         previousClassName="mx-1"
         previousLinkClassName="px-3 py-2 rounded hover:bg-gray-200"
         nextClassName="mx-1"
         nextLinkClassName="px-3 py-2 rounded hover:bg-gray-200"
         breakLabel="..."
         breakClassName="mx-1 "
         breakLinkClassName="px-3 py-2 text-black rounded hover:bg-gray-200"
         containerClassName="flex justify-center items-center space-x-4 h-[10px]"
         activeClassName="bg-blue-500 text-white rounded-xl"
        renderOnZeroPageCount={null}
        // className="bg-black flex justify-center items-center"
        previousLabel={
          <IconContext.Provider value={{ color: "#B8C1CC", size: "36px" }}>
            <AiFillLeftCircle />
          </IconContext.Provider>
        }
        nextLabel={
          <IconContext.Provider value={{ color: "#B8C1CC", size: "36px" }}>
            <AiFillRightCircle />
          </IconContext.Provider>
        }
      />
    </div>
  );
};

export default Cs_Process;
