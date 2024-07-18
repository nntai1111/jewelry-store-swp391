import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import QRCode from "react-qr-code";
import SignatureCanvas from 'react-signature-canvas'
import abc from '../../assets/logo.png'
import { Link, useParams } from 'react-router-dom';
const Cs_Bill = () => {
  const { id } = useParams();
  const [ListRing, setListRing] = useState({});
  const [Cus, setCus] = useState('');
  function formatDate(dateString) {
    const date = new Date(dateString);

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `Day ${day} Month ${month} Years ${year}`;
  }
  useEffect(() => {
    getRing(id);
    console.log(ListRing)
    console.log(Cus)
  }, []);
  const formatPrice = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(value);
  };
  const getRing = async (id) => {
    try {
      const res = await axios.get(
        `https://jssatsproject.azurewebsites.net/api/sellorder/getbyid?id=${id}`
      );
      const cus = await axios.get(
        `https://jssatsproject.azurewebsites.net/api/Customer/Search?searchTerm=${res.data.data[0].customerPhoneNumber}&pageIndex=1&pageSize=10`
      );
      setCus(cus.data.data[0])
      console.log(res.data.data[0])
      if (res && res.data && res.data.data) {
        setListRing(res.data.data[0]);
      }
    } catch (error) {
      console.error('Error fetching rings:', error);
      toast.error('Failed to fetch rings');
    }
  };
  
  return (<>
    {ListRing &&
      (
        <div className='flex justify-center'>
        <div className=' h-[100vh] bg-white flex w-[60%] border border-black justify-center items-center overflow-y-auto my-3'>
          <div className="mx-auto pt-3 p-3 bg-white w-[100%] h-[100%] flex flex-col">
            <div className="header text-center mb-3 flex items-center gap-3 border border-black">
              <Link to = '/cs_public/cs_order/cs_waitingPayment' className='w-[200px] h-[200px]'>
                <img src={abc} alt="PNJ logo" className="w-fit object-cover h-fit mx-auto p-2" />
              </Link>
              <div className='text-start'>
                <h1 className="text-xl font-bold mb-2">FPT GOLD, SILVER AND GEMSTONE JOINT STOCK COMPANY</h1>
                <p className="text-sm mb-1">Address: Lot E2a-7, Street D1, D. D1, Long Thanh My, Thu Duc City, Ho Chi Minh 700000</p>
                <p className="text-sm mb-1">Sales unit: BUSINESS LOCATION FPT GEMSTONE JOINT STOCK COMPANY - JEWELRY CENTER SWP391</p>
                <p className="text-sm mb-1">Address: Luu Huu Phuoc, Dong Hoa, Di An, Binh Duong</p>
                <p className="text-sm mb-1">Tax code: <span className='font-bold ml-2'>0101248141</span></p>
                <p className="text-sm mb-1">PhoneNumber:<span className='font-bold ml-2'>028.35118006</span></p>
              </div>
            </div>
            <div className="bill border border-black p-4 mb-3">
              <div className="flex mb-4">
                <div className='h-auto ml-4 mr-6 my-auto max-w-[100px] w-full'>
                  <QRCode
                    size={256}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    value='https://www.youtube.com/watch?v=lLAlq8VLjig'
                    viewBox={`0 0 256 256`}
                  />
                </div>
                <div className='w-[70%] text-center'>
                  <h2 className="text-2xl font-semibold mb-2 text-center">BILL OF SALE</h2>
                  <p className="text-sm mb-1 text-center">{formatDate(new Date().toISOString())}</p>
                  <p className="text-sm mb-1">CQT Code: 00CBDDC17977BD4DB2932E9A9B3896237B</p>
                  <div className='flex justify-center gap-4'>
                    <p className="text-sm mb-1">Symbol: 2C23TAA</p>
                    <p className="text-sm mb-1">Number: 621565</p>
                  </div>
                </div>
              </div>
              <div className='border border-black'>
                <div className="bill-info mb-6 p-2">
                  <div className='flex gap-16'>
                    <p className="text-sm mb-1">Buyer's name: <span className='font-bold'>{ListRing.customerName} - {ListRing.customerPhoneNumber}</span></p>
                    <p className="text-sm mb-1">Unit name: {''}
                      {[...Array(100)].map((_, index) => (
                        <span key={index}>.</span>
                      ))}
                    </p>
                  </div>
                  <p className="text-sm mb-1">
                    <span>Address: {' '}</span>

                    {Cus &&
                      (
                        <span className='text-black'>{Cus.address}</span>

                      )}
                  </p>
                  <p className="text-sm mb-1">Form of payment: <span className='font-bold'>{ListRing.paymentMethod}</span></p>
                  <div className='flex gap-[20px]'>
                    <p className="text-sm mb-1">Account number:  {[...Array(100)].map((_, index) => (
                      <span key={index}>.</span>
                    ))}</p>
                    <p className="text-sm mb-1">Tax code:   {[...Array(100)].map((_, index) => (
                      <span key={index}>.</span>
                    ))}</p>
                  </div>
                </div>
                <div className="bill-table mb-6">
                  <table className="w-full border-collapse border text-center">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="text-sm p-2 border">N.O</th>
                        <th className="text-sm p-2 border">Product Code</th>
                        <th className="text-sm p-2 border">Product Name</th>

                        <th className="text-sm p-2 border">Quantity</th>
                        <th className="text-sm p-2 border">Unit Price</th>
                        <th className="text-sm p-2 border">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ListRing && ListRing.sellOrderDetails && ListRing.sellOrderDetails.map((item, index) => {
                        return (
                          <tr>
                            <td className="text-sm p-2 border">{index}</td>
                            <td className="text-sm p-2 border">{item.productCode}</td>
                            <td className="text-sm p-2 border">{item.productName}</td>
                            <td className="text-sm p-2 border">{item.quantity}</td>
                            <td className="text-sm p-2 border">{formatPrice(item.unitPrice * (1-item.promotionRate))}</td>
                            <td className="text-sm p-2 border">{formatPrice(item.unitPrice * item.quantity * (1-item.promotionRate))}</td>
                          </tr>
                        )
                      })}


                    </tbody>
                  </table>
                </div>
                <div className="bill-total border border-t-black">
                  <div className='flex px-2 pt-2 justify-between'>
                    <p className="text-sm mb-1">Total Value:</p>
                    <p className="text-sm mb-1 font-bold">{formatPrice(ListRing.finalAmount)}</p>
                  </div>

                </div>
              </div>
              <div className="bill-signature flex justify-around my-16">
                <div className='text-center '>
                  <h1 className='font-bold'>Customer</h1>
                  <h1 className='pb-2'>(Sign, write full name)</h1>
                  <SignatureCanvas penColor='black'
                    canvasProps={{
                      width: 300, height: 100, className: 'sigCanvas', style: {
                        // border: '1px solid black', 
                        backgroundColor: '#f0f0f085'
                      }
                    }} />
                </div>
                <div className='text-center '>
                  <h1 className='font-bold'>Staff</h1>
                  <h1 className='pb-2'>(Sign, write full name)</h1>
                  <SignatureCanvas penColor='black'
                    canvasProps={{
                      width: 300, height: 100, className: 'sigCanvas', style: {
                        // border: '1px solid black', 
                        backgroundColor: '#f0f0f085'
                      }
                    }} />
                </div>
              </div>
              <div className='text-center '>
              <p className="text-sm mb-1">(Need to check and compare when making, delivering, and receiving invoices)</p>
              <p className="text-sm">Code Invoice: {ListRing.code}</p>
              </div>
            </div>
          </div>
        </div>
        </div>
      )
    }
  </>);
}

export default Cs_Bill;
