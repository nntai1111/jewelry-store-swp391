import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const PaymentResult = () => {
    const location = useLocation();
    const [message, setMessage] = useState('');
    const params = new URLSearchParams(location.search);
    const vnp_ResponseCode = params.get('vnp_ResponseCode');
    const orderId = params.get('vnp_OrderInfo')?.split(' ')[0];
    const paymentId = params.get('vnp_OrderInfo')?.split(' ')[2];
    const amount = params.get('vnp_Amount');
    const transactionStatus = params.get('vnp_TransactionStatus');
    const navigate = useNavigate();

    const CreatePaymentDetail  = async (status) => {
        let data = {
          paymentId: paymentId,
          paymentMethodId: 4,
          amount: amount/100,
          externalTransactionCode: '',
          status: status
        };
    
        try {
          let res = await axios.post('https://jssatsproject.azurewebsites.net/api/paymentdetail/createpaymentDetail', data);
        } catch (error) {
          toast.error('Fail');
          console.error('Error invoice:', error);
        }
      };
    const UpdatePayment = async (status) => {
        const res = await axios.put(`https://jssatsproject.azurewebsites.net/api/Payment/UpdatePayment?id=${paymentId}`, {
            status: status,
        });
    }
    const CreateGuarantee  = async () => {
        await axios.post('https://jssatsproject.azurewebsites.net/api/Guarantee/CreateGuarantee', orderId);
    }
    // const UpdateSpecialDiscount = async () => {
    //     await axios.put('https://jssatsproject.azurewebsites.net/api/SpecialDiscountRequest/UpdateBySellOrder', orderId);
    // }
    const UpdateSpecialDiscount = async () => {
        try {
            await axios.put('https://jssatsproject.azurewebsites.net/api/SpecialDiscountRequest/UpdateBySellOrder', {
                orderId: orderId
            });
        } catch (error) {
            console.error('Error updating special discount:', error);
        }
    }
    const UpdatePoint = async () => {
        try {
            await axios.put('https://jssatsproject.azurewebsites.net/api/Point/UpdatePoint', {
                orderId: orderId
            });
        } catch (error) {
            console.error('Error updating special discount:', error);
        }
    }
    useEffect(() => {

        if (vnp_ResponseCode === '00') {
            setMessage('Payment successful!');
            toast.success('Payment successful!');
            CreatePaymentDetail('completed')
            UpdatePayment('completed')
            CreateGuarantee()
            UpdateSpecialDiscount()
            UpdatePoint()

        } else {
            setMessage(`Payment failed. Error code: ${vnp_ResponseCode}`);
            toast.error(`Payment failed. Error code: ${vnp_ResponseCode}`);
            CreatePaymentDetail('failed')
            UpdatePayment('failed')
        }
    }, [location]);

    const handleBack = () => {
        navigate(-3);
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0
        }).format(value);
    };

    return (
        <div className='flex justify-center items-center w-full h-full'>
            {vnp_ResponseCode === '00' ? (
                <div className="h-[100vh] flex items-center w-full justify-center bg-gray-900 overflow-hidden">
                    <div className="w-full mx-auto pt-12 pb-14 px-5 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 mb-5 rounded-full">
                            <svg
                                viewBox="0 0 48 48"
                                height="100"
                                width="100"
                                y="0px"
                                x="0px"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <linearGradient
                                    gradientUnits="userSpaceOnUse"
                                    y2="37.081"
                                    y1="10.918"
                                    x2="10.918"
                                    x1="37.081"
                                    id="SVGID_1__8tZkVc2cOjdg_gr1"
                                >
                                    <stop stop-color="#60fea4" offset="0"></stop>
                                    <stop stop-color="#6afeaa" offset=".033"></stop>
                                    <stop stop-color="#97fec4" offset=".197"></stop>
                                    <stop stop-color="#bdffd9" offset=".362"></stop>
                                    <stop stop-color="#daffea" offset=".525"></stop>
                                    <stop stop-color="#eefff5" offset=".687"></stop>
                                    <stop stop-color="#fbfffd" offset=".846"></stop>
                                    <stop stop-color="#fff" offset="1"></stop>
                                </linearGradient>
                                <circle
                                    fill="url(#SVGID_1__8tZkVc2cOjdg_gr1)"
                                    r="18.5"
                                    cy="24"
                                    cx="24"
                                ></circle>
                                <path
                                    d="M35.401,38.773C32.248,41.21,28.293,42.66,24,42.66C13.695,42.66,5.34,34.305,5.34,24	c0-2.648,0.551-5.167,1.546-7.448"
                                    stroke-width="3"
                                    stroke-miterlimit="10"
                                    stroke-linejoin="round"
                                    stroke-linecap="round"
                                    stroke="#10e36c"
                                    fill="none"
                                ></path>
                                <path
                                    d="M12.077,9.646C15.31,6.957,19.466,5.34,24,5.34c10.305,0,18.66,8.354,18.66,18.66	c0,2.309-0.419,4.52-1.186,6.561"
                                    stroke-width="3"
                                    stroke-miterlimit="10"
                                    stroke-linejoin="round"
                                    stroke-linecap="round"
                                    stroke="#10e36c"
                                    fill="none"
                                ></path>
                                <polyline
                                    points="16.5,23.5 21.5,28.5 32,18"
                                    stroke-width="3"
                                    stroke-miterlimit="10"
                                    stroke-linejoin="round"
                                    stroke-linecap="round"
                                    stroke="#10e36c"
                                    fill="none"
                                ></polyline>
                            </svg>
                        </div>

                        <h1 className="text-5xl text-[#54c977] font-mono mb-5">
                            {message}
                        </h1>
                        <p className="text-white text-2xl mb-3">Payment amount</p>
                        <p className="text-white text-2xl mb-10">{formatCurrency(amount / 100)}</p>
                    </div>
                </div>
            ) : (
                <div className="h-[100vh] flex items-center w-full justify-center bg-gray-900 overflow-hidden">
                    <div className="w-full mx-auto pt-12 pb-14 px-5 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 mb-5 rounded-full">
                            <svg
                                viewBox="0 0 48 48"
                                height="100"
                                width="100"
                                y="0px"
                                x="0px"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <linearGradient
                                    gradientUnits="userSpaceOnUse"
                                    y2="37.081"
                                    y1="10.918"
                                    x2="10.918"
                                    x1="37.081"
                                    id="SVGID_1__8tZkVc2cOjdg_gr1"
                                >
                                    <stop stop-color="#ff6b6b" offset="0"></stop>
                                    <stop stop-color="#ff7f7f" offset=".033"></stop>
                                    <stop stop-color="#ffb1b1" offset=".197"></stop>
                                    <stop stop-color="#ffd9d9" offset=".362"></stop>
                                    <stop stop-color="#ffeaea" offset=".525"></stop>
                                    <stop stop-color="#fff5f5" offset=".687"></stop>
                                    <stop stop-color="#fffdfd" offset=".846"></stop>
                                    <stop stop-color="#fff" offset="1"></stop>
                                </linearGradient>
                                <circle
                                    fill="url(#SVGID_1__8tZkVc2cOjdg_gr1)"
                                    r="18.5"
                                    cy="24"
                                    cx="24"
                                ></circle>
                                <path
                                    d="M35.401,38.773C32.248,41.21,28.293,42.66,24,42.66C13.695,42.66,5.34,34.305,5.34,24	c0-2.648,0.551-5.167,1.546-7.448"
                                    stroke-width="3"
                                    stroke-miterlimit="10"
                                    stroke-linejoin="round"
                                    stroke-linecap="round"
                                    stroke="#ff3333"
                                    fill="none"
                                ></path>
                                <path
                                    d="M12.077,9.646C15.31,6.957,19.466,5.34,24,5.34c10.305,0,18.66,8.354,18.66,18.66	c0,2.309-0.419,4.52-1.186,6.561"
                                    stroke-width="3"
                                    stroke-miterlimit="10"
                                    stroke-linejoin="round"
                                    stroke-linecap="round"
                                    stroke="#ff3333"
                                    fill="none"
                                ></path>
                                <line
                                    x1="16"
                                    y1="16"
                                    x2="32"
                                    y2="32"
                                    stroke-width="3"
                                    stroke-miterlimit="10"
                                    stroke-linejoin="round"
                                    stroke-linecap="round"
                                    stroke="#ff3333"
                                    fill="none"
                                ></line>
                                <line
                                    x1="32"
                                    y1="16"
                                    x2="16"
                                    y2="32"
                                    stroke-width="3"
                                    stroke-miterlimit="10"
                                    stroke-linejoin="round"
                                    stroke-linecap="round"
                                    stroke="#ff3333"
                                    fill="none"
                                ></line>
                            </svg>
                        </div>

                        <h1 className="text-5xl text-[#eb3434] font-mono mb-5">
                            {message}
                        </h1>
                        <p className="text-white text-2xl mb-3">Payment amount</p>
                        <p className="text-white text-2xl mb-10">{formatCurrency(amount / 100)}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentResult;
