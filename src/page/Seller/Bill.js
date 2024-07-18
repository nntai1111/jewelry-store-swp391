import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import QRCode from "react-qr-code";
import SignatureCanvas from 'react-signature-canvas'
import abc from '../../assets/logo.png'
import logo_v2_seller from '../../assets/logo-Photoroom-removebg-preview.png'
import { Link, useParams } from 'react-router-dom';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { IoCameraOutline } from "react-icons/io5";
import emailjs from '@emailjs/browser'
import { saveAs } from 'file-saver';
import Modal from 'react-modal';
import { MdEmail } from 'react-icons/md';
import { CiLogout } from "react-icons/ci";
const Bill = () => {
  const { id } = useParams();
  const [Bill, setBill] = useState({});
  const [Cus, setCus] = useState('');
  const [email, setEmail] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);

  function formatDate(dateString) {
    const date = new Date(dateString);

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `Day ${day} Month ${month} Years ${year}`;
  }

  useEffect(() => {
    getRing(id);
  }, [id]);

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
      setCus(cus.data.data[0]);
      if (res && res.data && res.data.data) {
        setBill(res.data.data[0]);
      }
    } catch (error) {
      console.error('Error fetching rings:', error);
      toast.error('Failed to fetch rings');
    }
  };
  const captureAndSendEmail = async (event) => {
    event.preventDefault();
    console.log("Starting captureAndSendEmail function");
    console.log("Email to send to:", email);
  
    try {
      const node = document.getElementById('bill-content');
      if (!node) {
        throw new Error('Bill content element not found');
      }
      console.log('Bill content element found');
  
      // Generate HTML content
      const htmlContent = `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
              }
            </style>
          </head>
          <body>
            <h2>Dear valued customer {{email_from}},</h2>
            <p>We would like to express our heartfelt gratitude for your recent purchase at FPT Gold and Jewelry Store. It's an honor to have you as our customer, and we're thrilled that you've chosen to shop with us.</p>
            <p>Thank you for trusting us with your jewelry needs. We hope you're enjoying your new purchase and that it brings you joy and happiness.</p>
            <p>Best regards, FPT Gold and Jewelry Store team</p>
            <br />
            <h2>Bill Details:</h2>
            <table border="1" cellpadding="5" cellspacing="0">
              <tr>
                <th>N.O</th>
                <th>Product Code</th>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Promotion (%)</th>
                <th>Unit Price</th>
                <th>Value</th>
              </tr>
              ${Bill.sellOrderDetails.map((item, index) => {
                return `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${item.productCode}</td>
                    <td>${item.productName}</td>
                    <td>${item.quantity}</td>
                    <td>${formatPrice(item.unitPrice * item.promotionRate)}</td>
                    <td>${formatPrice(item.unitPrice)}</td>
                    <td>${formatPrice(item.unitPrice * item.quantity * (1 - item.promotionRate))}</td>
                  </tr>
                `;
              }).join('')}
            </table>
            <p>Total Value: ${formatPrice(Bill.finalAmount)}</p>
            <p>Discount Promotion: ${formatPrice(totalPromotionValue)}</p>
            <p>Discount Rate: ${Bill.specialDiscountRate}</p>
          </body>
        </html>
      `;
  
      // Create a template parameter object
      const templateParams = {
        email_from: email,
        message: htmlContent,
      };
  
      // Send email using EmailJS
      const emailResponse = await emailjs.send(
        "service_ruiy2f7",
        "template_7lu84zn",
        templateParams,
        '4y4GyC3_JZ8nJa4RU',
        {
          contentType: 'text/html', // Add this line
        }
      );
  
      console.log('EmailJS response:', emailResponse);
  
      if (emailResponse.status === 200 || emailResponse.text === 'OK') {
        toast.success('Email sent successfully!');
      } else {
        console.log('Failed to send email, EmailJS response:', emailResponse);
        toast.error('Failed to send email');
      }
    } catch (error) {
      console.error('Error capturing and sending email:', error);
      toast.error('Failed to capture and send email');
    }
  };
  
  const calculateTotalPromotionValue = () => {
    if (Bill && Bill.sellOrderDetails) {
      return Bill.sellOrderDetails.reduce((total, item) => {
        return total + (item.unitPrice * item.promotionRate);
      }, 0);
    }
    return 0;
  };
  const totalPromotionValue = calculateTotalPromotionValue();

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  return (
    <>
      {Bill && (
        <div className='relative grid grid-cols-10 p-4'>
          <div id="bill-content" className="col-span-6 mx-auto pt-3 p-3 border border-black bg-white w-[100%] flex flex-col ">
            <div className=" text-center mb-3 flex items-center gap-3 border border-black">
              <div className='w-[200px] h-[200px]'>
                <img src={abc} alt="PNJ logo" className="w-fit object-cover h-fit mx-auto p-2" />
              </div>
              <div className='text-start'>
                <h1 className="text-xl font-bold mb-2">FPT GOLD, SILVER AND GEMSTONE JOINT STOCK COMPANY</h1>
                <p className="text-sm mb-1">Address: Lot E2a-7, Street D1, D. D1, Long Thanh My, Thu Duc City, Ho Chi Minh 700000</p>
                <p className="text-sm mb-1">Sales unit: BUSINESS LOCATION FPT GEMSTONE JOINT STOCK COMPANY - JEWELRY CENTER SWP391</p>
                <p className="text-sm mb-1">Address: Luu Huu Phuoc, Dong Hoa, Di An, Binh Duong</p>
                <p className="text-sm mb-1">Tax code: <span className='font-bold ml-2'>0101248141</span></p>
                <p className="text-sm mb-1">PhoneNumber:<span className='font-bold ml-2'>028.35118006</span></p>
              </div>
              <IoCameraOutline onClick={openModal} className='cursor-pointer absolute top-5 right-16 bg-black text-white w-10 h-10 p-3 rounded-[50%]' />
             <Link to='/public/searchInvoice/onprocessSeller'><CiLogout className='cursor-pointer absolute top-5 right-3 bg-[#264e93] text-white w-10 h-10 p-3 rounded-[50%]' /></Link> 
            </div>
            <div className="bill border border-black p-4 ">
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
                    <p className="text-sm mb-1">Buyer's name: <span className='font-bold'>{Bill.customerName} - {Bill.customerPhoneNumber}</span></p>
                    <p className="text-sm mb-1">Unit name: {''}
                      {[...Array(100)].map((_, index) => (
                        <span key={index}>.</span>
                      ))}
                    </p>
                  </div>
                  <p className="text-sm mb-1">
                    <span>Address: {' '}</span>
                    {Cus && (
                      <span className='text-black'>{Cus.address}</span>
                    )}
                  </p>
                  <p className="text-sm mb-1">Form of payment: <span className='font-bold'>{Bill.paymentMethod}</span></p>
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
                        <th className="text-sm p-2 border">Promotion (%)</th>
                        <th className="text-sm p-2 border">Unit Price</th>
                        <th className="text-sm p-2 border">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Bill && Bill.sellOrderDetails && Bill.sellOrderDetails.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td className="text-sm p-2 border">{index + 1}</td>
                            <td className="text-sm p-2 border">{item.productCode}</td>
                            <td className="text-sm p-2 border">{item.productName}</td>
                            <td className="text-sm p-2 border">{item.quantity}</td>
                            <td className="text-sm p-2 border">{formatPrice(item.unitPrice * item.promotionRate)}</td>
                            <td className="text-sm p-2 border">{formatPrice(item.unitPrice)}</td>
                            <td className="text-sm p-2 border">{formatPrice(item.unitPrice * item.quantity * (1 - item.promotionRate))}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="bill-total border border-t-black">
                  <div className='flex px-2 pt-2 justify-between'>
                    <p className="text-sm mb-1">Total Value:</p>
                    <p className="text-sm mb-1 font-bold">{formatPrice(Bill.finalAmount)}</p>
                  </div>

                  <div className='px-2 border-t-black flex justify-between'>
                    <div className='font-thin italic'>Discount Promotion</div>
                    <span className='font-thin'>{formatPrice(totalPromotionValue)}</span>
                  </div>
                  <div className='px-2 border-t-black flex justify-between pb-2'>
                    <div className='font-thin italic'>Discount Rate</div>
                    <span className='font-thin'>{Bill.specialDiscountRate}</span>
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
                <p className="text-sm">Code Invoice: {Bill.code}</p>
              </div>
            </div>
          </div>
          <div id='policy' className=' col-span-4 flex flex-col gap-3 items-center justify-center'>
            <div className=' w-[70%] h-[225x] bg-[#211758] p-2'>
              <div className='border border-[#f2f2f2] '>
                <div className='relative w-[full] flex flex-col justify-center items-center p-3'>
                  <img className='w-[30%] object-cover' src={logo_v2_seller} />
                  <span className='absolute bottom-[-5px] font-dancing text-3xl text-[#e8cd45]'>Jewelry Store</span>
                </div>
                <h1 className='text-center font-thin text-2xl  text-[#fff] py-5 '> WARRANTY CARD </h1>
              </div>
            </div>
            {Bill && Bill.sellOrderDetails && Bill.sellOrderDetails.map((item, index) => {
                        return (
            <div className=' w-[70%] h-[225px] bg-[#211758] p-2'>
              <div className=' h-[210px] '>
                <h1 className='text-center font-thin text-xl  text-[#e8cd45] py-2 '>  PUBLISHING POLICY </h1>
                <p className='text-white px-3 text-[10px]' >- FPT products are guaranteed genuine according to FPT standards nationwide. Including products ordered online or purchased directly at FPT Authorized Stores/Agents.</p>
                <p className='text-white px-3 text-[10px]' >- The product is warranted for 36 months from the date the customer pays for the product.</p>
                <p className='text-white px-3 text-[10px]' >- Free polishing and lifetime color warranty.</p>
                <p className='text-white px-3 text-[10px]' >- Completely free of other costs during product warranty</p>
                <p className='text-[#e8cd45] px-3 text-[10px] text-end pb-1' >Thank you very much</p>
                <div  className='h-[20%] bg-white flex items-center justify-between px-3'>
                  <div><span>CODE: </span><span className='font-medium'>{item.guaranteeCode}</span></div>
                  <div>
                  <QRCode
                    size={30}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    value={item.guaranteeCode || ""}
                    viewBox={`0 0 256 256`}
                  />
                  </div>
                </div>
              </div>
            </div>
             )
            })}
          </div>
        </div>

      )}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Subscribe Modal"
        className="flex flex-col items-center justify-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Subscribe to Our Newsletter
          </h2>
          <form className="flex flex-col">
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              name='email_from'
              id='emailFrom'
              className="bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
              placeholder="Enter your email address"
            />
            <textarea
              name='message'
              id='message'
              className="bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
              placeholder=""
            />
            <button
              onClick={(event) => {
                captureAndSendEmail(event);
                closeModal();
              }}
              type="button"
              className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-indigo-600 hover:to-blue-600 transition ease-in-out duration-150"
            >
              Subscribe
            </button>
          </form>

        </div>
      </Modal>
    </>
  );
};

export default Bill;
