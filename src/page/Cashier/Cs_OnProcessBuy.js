import React, { useState, useEffect } from 'react'
import { fetchPaymentMethod, fetchStatusBuyInvoice, fetchStatusInvoice } from '../../apis/jewelryService'
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
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
const FormatDate = ({ isoString }) => {
    // Cs_WaitingPayment
    const parsedDate = parseISO(isoString);
    const formattedDate = format(parsedDate, "HH:mm yyyy-MM-dd");
    return (
        <div>
            <p>{formattedDate}</p>
        </div>
    );
};
const Cs_OnProcessBuy = () => {
    const [currentTime, setCurrentTime] = useState(new Date().toISOString());
    const [listInvoice, setlistInvoice] = useState([]); // list full invoice
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [IdOrder, setIdOrder] = useState('')
    const [isPaymentCompleted, setIsPaymentCompleted] = useState(false);
    const [isPaymentCompletedDefault, setIsPaymentCompletedDefault] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState([]);
    const [ChosePayMethod, setChosePayMethod] = useState('Cash');
    const [ChosePayMethodID, setChosePayMethodID] = useState(3);
    const [PaymentID, setPaymentID] = useState();
    const [totalProduct, setTotalProduct] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);

    const handleChange = (event) => {
        const selectedMethod = paymentMethod.find(
            (method) => method.name === event.target.value
        );
        console.log(selectedMethod.id)
        if (selectedMethod) {
            setChosePayMethod(selectedMethod.name);
            setChosePayMethodID(selectedMethod.id);
        }
    };
    const closeModal = () => {
        setIsModalOpen(false);
    };
    const handlePageClick = event => {
        getInvoice(event.selected + 1);
    };
    const pollingInterval = 5000; // Thời gian polling, ví dụ mỗi 5 giây

    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        getInvoice(currentPage);
        const interval = setInterval(() => {
            getInvoice(currentPage);
        }, pollingInterval);

        // Cleanup function để clear interval khi component unmount
        return () => clearInterval(interval);
    }, [currentPage]);


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
                `https://jssatsproject.azurewebsites.net/api/buyorder/search?statusList=processing&customerPhone=${phone}&ascending=true&pageIndex=${page}&pageSize=10`
            );
            if (res.data && res.data.data) {
                setlistInvoice(res.data.data);
                setTotalProduct(res.data.totalElements);
                setTotalPage(res.data.totalPages);
            }
        } catch (error) {
            console.error('Error fetching customers:', error);
            toast.error('Failed to fetch customers');
        }
    };
    const getCompletedSearch = async (phone) => {
        try {
            const res = await axios.get(
                `https://jssatsproject.azurewebsites.net/api/Buyorder/search?statusList=completed&customerPhone=${phone}&ascending=true&pageIndex=1&pageSize=10`
            );
            console.log('search completed:', res.data.data)
            // if (res.data && res.data.data) {
            //   showBill(res.data.data[0]);
            // }
        } catch (error) {
            console.error('Error fetching customers:', error);
            toast.error('Failed to fetch customers');
        }
    };
    const getInvoice = async (page) => {
        try {
            let res = await fetchStatusBuyInvoice('processing', page);
            if (res?.data?.data) {
                setlistInvoice(res.data.data);
                setTotalProduct(res.data.totalElements);
                setTotalPage(res.data.totalPages);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };
    useEffect(() => {
        getPayMentMethod();
    }, []);
    const getPayMentMethod = async () => {
        let res = await fetchPaymentMethod();
        if (res && res.data && res.data.data) {
            setPaymentMethod(res.data.data)
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setcreateDate(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    function updateDisplay(value) {
        let currentValue = document.getElementById('display').value;

        // Check if the last character in the current value is an operator
        const lastCharIsOperator = ['+', '-', '*', '/', '.'].includes(currentValue.slice(-1));

        // Check if the current value is '0' and the entered value is an operator
        if (currentValue === '0') {
            if (['+', '-', '*', '/', '.'].includes(value)) {
                document.getElementById('display').value = '0' + value;
            } else {
                document.getElementById('display').value = value;
            }
        } else if (lastCharIsOperator && ['+', '-', '*', '/', '.'].includes(value)) {
            // If the last character is an operator and the entered value is an operator, do nothing
            return;
        } else {
            document.getElementById('display').value += value;
        }
    }

    function clearDisplay() {
        // Clear the input display and set it to '0'
        document.getElementById('display').value = '0';
    }

    function calculate() {
        try {
            // Get the current expression in the display
            let expression = document.getElementById('display').value;

            // Evaluate the expression using JavaScript eval function
            let result = eval(expression);

            // Update the display with the result
            document.getElementById('display').value = result;
        }
        catch (err) {
            document.getElementById('display').value = "Invalid Input";
        }
    }
    const formatPrice = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0
        }).format(value);
    };

    const [createDate, setcreateDate] = useState(new Date().toISOString())

    const handleSubmitOrder = async (item, event) => {
        event.preventDefault();

        let data = {
            sellOrderId: null,
            buyOrderId: item.id,
            customerId: item.customerId,
            createDate: currentTime,
            amount: item.totalAmount,
        };
        console.log("Submitting order with data:", data);
        try {
            // Simulate a possible error for testing
            if (!data.buyOrderId || !data.customerId || !data.createDate || !data.amount) {
                throw new Error("Missing required fields in order data");
            }
            let res = await axios.post('https://jssatsproject.azurewebsites.net/api/payment/createpayment', data);
            console.log("Response from payment API:", res);

            const paymentID = res.data.data.id;
            const item1 = res.data.data;
            console.log('item1', item1)
            console.log("Payment ID received:", paymentID);

            toast.success('Create Invoice Successful');
            setIsPaymentCompleted(true);
            setIsPaymentCompletedDefault(false);
            if (ChosePayMethodID === 3) {
                handleCompleteCash(item1, item.customerPhoneNumber);
            }
            // setPaymentID(paymentID);
        } catch (error) {
            toast.error('Fail');
            console.error('Error during payment process:', error);
            // Additional logging for detailed error information
            if (error.response) {
                // Server responded with a status other than 200 range
                console.error("Error response data:", error.response.data);
                console.error("Error response status:", error.response.status);
                console.error("Error response headers:", error.response.headers);
            } else if (error.request) {
                // Request was made but no response was received
                console.error("Error request data:", error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error("Error message:", error.message);
            }
            console.error("Error config:", error.config);
        }
    };

    const [externalTransactionCode, setexternalTransactionCode] = useState('')

    const handleCompleteCash = async (item, phone) => {
        // event.preventDefault();
        let data = {
            paymentId: item.id,
            paymentMethodId: ChosePayMethodID,
            amount: item.amount,
            externalTransactionCode: externalTransactionCode,
            status: 'completed',
        };
        try {
            let res = await axios.post('https://jssatsproject.azurewebsites.net/api/paymentdetail/createpaymentDetail', data);
            toast.success('Cash payment successful');
            getCompletedSearch(phone)
        } catch (error) {
            toast.error('Fail');
            console.error('Error invoice:', error);
        }
    };
    const showBill = (item) => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div>
                        <button onClick={onClose} className="btn btn-primary">Close</button>

                        <div className='col-start-2 my-auto mx-3 h-[100vh] overflow-y-auto'>
                            <div className="bg-white shadow-lg w-full border border-black rounded-lg">
                                <div className="pt-4 mb-4 grid grid-cols-3 rounded-t">
                                    <div className='h-auto mx-2 my-auto max-w-[64px] w-full'>
                                        <QRCode
                                            size={256}
                                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                            value={item.id}
                                            viewBox={`0 0 256 256`}
                                        />
                                    </div>
                                    <div className='flex flex-col items-center justify-center'>
                                        <h1 onClick={closeModal} className="cursor-pointer text-xl font-semibold text-gray-900">
                                            JEWELRY BILL OF SALE
                                        </h1>
                                        <h2 className='text-center text-gray-600'>
                                            {currentTime}
                                        </h2>
                                    </div>
                                    <div></div>
                                </div>
                                <div className='border border-black mx-4 my-2 p-4'>
                                    {/* Customer Information */}
                                    <div className='flex justify-between mb-4'>
                                        <div className='flex items-center'>
                                            <h1 className='font-semibold'>Customer Name:</h1>
                                            <h2 className='text-black ml-2'>{item.customerName}</h2>
                                        </div>
                                        <div className='flex items-center'>
                                            <h1 className='font-semibold'>Phoner Number:</h1>
                                            <h2 className='text-black ml-2'>
                                                {item.customerPhoneNumber}
                                            </h2>
                                        </div>
                                    </div>
                                    <div className='flex items-center mb-4'>
                                        <h1 className='font-semibold'>Address:</h1>
                                        <h2 className='text-black ml-2'>
                                            {[...Array(50)].map((_, index) => (
                                                <span key={index}>.</span>
                                            ))}
                                        </h2>
                                    </div>
                                    <div className='flex items-center mb-4'>
                                        <h1 className='font-semibold'>Payment methods:</h1>
                                        <h2 className='text-black ml-2'>
                                            {ChosePayMethod}
                                        </h2>
                                    </div>
                                    {/* Product Information */}
                                    <div className='border border-black mt-5 overflow-hidden'>
                                        <table className="min-w-full text-left text-sm font-light text-gray-900">
                                            <thead className="border-b bg-gray-100 font-medium">
                                                <tr>
                                                    <th scope="col" className="px-4 py-4 text-center">N.O</th>
                                                    <th scope="col" className="px-6 py-4 text-center">Name Product</th>
                                                    <th scope="col" className="px-4 py-4 text-center">Quantity</th>
                                                    <th scope="col" className="px-6 py-4 text-center">Cost</th>
                                                    <th scope="col" className="px-6 py-4 text-center">Value</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {item.sellOrderDetails && item.sellOrderDetails.length > 0 && item.sellOrderDetails.map((p) => {
                                                    return (
                                                        <tr className="border-b bg-gray-50">
                                                            <td className="whitespace-nowrap px-4 py-4 text-center font-medium">1</td>
                                                            <td className="whitespace-nowrap px-6 py-4">{p.productName}</td>
                                                            <td className="whitespace-nowrap px-4 py-4 text-center">{formatPrice(p.quantity)}</td>
                                                            <td className="whitespace-nowrap px-6 py-4 text-right">{formatPrice(p.unitPrice)}</td>
                                                            <td className="whitespace-nowrap px-6 py-4 text-right">{formatPrice(p.quantity * p.unitPrice)}</td>
                                                        </tr>)
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className='border border-black mt-2 p-4'>
                                        <div className='flex justify-between'>
                                            <h1 className='font-bold'>Total Value</h1>
                                            <h1>{formatPrice(item.finalAmount)}</h1>
                                        </div>
                                    </div>
                                    <div className='h-40 flex justify-around items-center'>
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
                                                        // border: '2px solid black', 
                                                        backgroundColor: '#f0f0f085'
                                                    }
                                                }} />
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                    </div>
                )
            },
        });
    };







    const handleCancle = async (id) => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className='fixed flex items-center justify-center top-0 bottom-0 left-0 right-0 bg-[#6f85ab61] overflow-y-auto'>
                        <div className="bg-[#fff] mx-auto rounded-md w-[23%] shadow-[#b6b0b0] shadow-md p-4">
                            <h1 className="text-lg font-semibold mb-4">Confirm to delete</h1>
                            <p className="mb-6 text-center">Are you sure you want to delete this invoice?</p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={async () => {
                                        try {
                                            const res = await axios.put(`https://jssatsproject.azurewebsites.net/api/BuyOrder/UpdateStatus?id=${id}`, {
                                                status: 'cancelled',
                                                createDate: currentTime,
                                            });
                                            console.log(res.data)
                                            toast.success('Success');
                                            getInvoice(1);
                                        } catch (error) {
                                            console.error('Error updating status:', error);
                                            toast.error('Failed to cancel order');
                                        }
                                        onClose();
                                    }}
                                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 m-0 ml-2 rounded"
                                >
                                    Yes
                                </button>
                                <button
                                    onClick={onClose}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded m-0"
                                >
                                    No
                                </button>
                            </div>
                        </div>
                    </div>
                )
            },
        });
    };
    return (<>
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
                    {listInvoice && listInvoice.length > 0 && listInvoice.map((item, index) => {
                        return (
                            <div className='shadow-md shadow-gray-600 pt-[10px] rounded-2xl w-[93%] h-[23em] bg-[#ffff] mb-[20px]'>
                                <div className='flex flex-col justify-between px-[15px] text-black font-thin'>
                                    <span className='flex justify-end font-thin italic'><FormatDate isoString={item.createDate} /></span>
                                </div>
                                <div className='text-[15px]'>
                                    <div className='flex px-[15px] gap-3 '>
                                        <span className='font-serif'>Code:</span>
                                        <span className='font-thin'>{item.code}</span>
                                        <span className='font-serif'>-</span>
                                        <span className='font-thin'>{item.id}</span>
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
                                    {item.buyOrderDetails.map((orderDetail, index) => (
                                        <div className='grid grid-cols-3 mx-[10px] border-b-black pb-[2px]'>
                                            <div className='col-start-1 col-span-2 flex pl-[5px] items-center text-[12px]'>{orderDetail.productName}</div>
                                            <div className='col-start-3 gap-1 flex justify-end text-[12px]'>
                                                <span>{formatPrice(orderDetail.unitPrice)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className='border border-x-0 border-b-0 mx-[15px] border-t-black pt-2 flex justify-between'>
                                    <div className='font-bold'>Total</div>
                                    <span className='font-semibold'>{formatPrice(item.totalAmount)}</span>
                                </div>



                                <div className=' flex justify-around'>
                                    <button onClick={() => handleCancle(item.id)} type='button' className="m-0 py-2 border border-[#ffffff] bg-[#c4472b] text-white px-10 rounded-md transition duration-200 ease-in-out hover:bg-[#bd5f4f7e] active:bg-[#ffff] focus:outline-none">Cancel</button>
                                    <Popup trigger={<button type='button' className=" m-0 py-2 border border-[#ffffff] bg-[#469086] text-white px-10 rounded-md transition duration-200 ease-in-out hover:bg-[#5fa39a7e] active:bg-[#ffff] focus:outline-none">Pay Bill</button>} position="right center">
                                        {close => (
                                            <div className='fixed top-0 bottom-0 left-0 right-0 flex justify-center bg-[#6f85ab61]'>
                                                <div className='flex justify-center items-center w-fit p-2'>
                                                    <div className='bg-[#fff] my-[70px] mx-auto rounded-md w-[100%] shadow-[#b6b0b0] shadow-md'>
                                                        <form className="p-4 md:p-5 relative">
                                                            <div className=" flex items-center justify-end md:p-0 rounded-t">
                                                                <a className='absolute right-0 cursor-pointer text-black text-[24px] py-0' onClick={close}>&times;</a>
                                                            </div>
                                                            <div className="grid gap-4 grid-cols-2">
                                                                <div className='row-start-1 col-start-1 h-[100px]'>
                                                                    <h5 className='font-bold '>Customer Info</h5>
                                                                    <div id='inforCustomer' className='text-[12px]'>
                                                                        <p className='bg-gray-100 px-2 py-1 rounded-md mb-1'>Name: {item.customerName}</p>
                                                                        <p className='bg-gray-100 px-2 py-1 rounded-md'>Code Invoice: {item.code}</p>
                                                                    </div>
                                                                </div>
                                                                <div className='row-start-1 col-start-2 h-[100px]'>
                                                                    <h5 className='font-bold'>Select a payment method</h5>
                                                                    <select value={ChosePayMethod} onChange={handleChange} class="mt-[10px] w-[100%] px-2 bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150">
                                                                        {paymentMethod && paymentMethod.length > 0 && paymentMethod.map((item) => {
                                                                            return (
                                                                                <option key={item.id} value={item.name} className='text-black text-center'>{item.name}</option>
                                                                            )
                                                                        })}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="grid gap-4 grid-cols-2">
                                                                <div className='col-start-1 rounded-md bg-gray-100 p-[10px] relative'>
                                                                    <h3 className='font-bold'>Transaction Details</h3>
                                                                    <div className='overflow-y-scroll'>
                                                                        <div className='grid grid-cols-3 border-x-0 border-t-0 border mx-[10px] border-b-black pb-[2px]'>
                                                                            <div className='col-start-1 col-span-2 flex pl-[5px]'>Item</div>
                                                                            <div className='col-start-3 ml-6 flex justify-start'>Price</div>
                                                                        </div>
                                                                        <div id='screenSeller' className='grid-cols-3 h-[45%] overflow-y-auto'>
                                                                            {item.buyOrderDetails.map((orderDetail, index) => (
                                                                                <div className='grid grid-cols-3 mx-[10px] border-b-black pb-[2px]'>
                                                                                    <div className='col-start-1 col-span-2 flex pl-[5px] items-center text-[12px]'>{orderDetail.productName}</div>
                                                                                    <div className='col-start-3 gap-1 flex justify-end text-[12px]'>
                                                                                        <span>{formatPrice(orderDetail.unitPrice)}</span>
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                    <div className='absolute bottom-5 w-[95%] border text-start border-x-0 border-b-0 border-black grid grid-cols-2 grid-rows-3'>
                                                                        <div className='font-bold'>Total</div>
                                                                        <span className='font-semibold'>{formatPrice(item.totalAmount)}</span>
                                                                    </div>
                                                                </div>

                                                                <div class="w-[22rem] h-[500px] bg-[#f6f8f9] rounded-3xl p-4 shadow-2xl dark:bg-[#17181a]">
                                                                    <div class="h-[100px]">
                                                                        <textarea type="text" id="display" class="h-full w-full text-3xl font-bold bg-transparent border border-none outline-none resize-none dark:text-white" disabled>0</textarea>
                                                                    </div>

                                                                    <div class="flex space-x-2 mt-3">
                                                                        <input type="button" onClick={() => clearDisplay()} class="w-20 h-14 text-black bg-[#e9f0f4] hover:bg-gray-200 shadow-md font-bold py-1 px-2 rounded-2xl dark:bg-[#2d191e] dark:text-red-500" value="C" />
                                                                        <input type="button" onClick={() => updateDisplay('(')} class="w-20 h-14 text-black bg-[#e9f0f4] hover:bg-gray-200 shadow-md font-bold py-1 px-2 rounded-2xl dark:bg-[#222427] dark:text-white" value="(" />
                                                                        <input type="button" onClick={() => updateDisplay(')')} class="w-20 h-14 text-black bg-[#e9f0f4] hover:bg-gray-200 shadow-md font-bold py-1 px-2 rounded-2xl dark:bg-[#222427] dark:text-white" value=")" />
                                                                        <input type="button" onClick={() => updateDisplay('/')} class="w-20 h-14 text-white bg-[#ff9500] hover:bg-[#e68600] shadow-md font-bold py-1 px-2 rounded-2xl" value="/" />
                                                                    </div>

                                                                    <div class="flex space-x-2 mt-3">
                                                                        <input type="button" onClick={() => updateDisplay('7')} class="w-20 h-14 text-black bg-[#e9f0f4] hover:bg-gray-200 shadow-md font-bold py-1 px-2 rounded-2xl dark:bg-[#222427] dark:text-white" value="7" />
                                                                        <input type="button" onClick={() => updateDisplay('8')} class="w-20 h-14 text-black bg-[#e9f0f4] hover:bg-gray-200 shadow-md font-bold py-1 px-2 rounded-2xl dark:bg-[#222427] dark:text-white" value="8" />
                                                                        <input type="button" onClick={() => updateDisplay('9')} class="w-20 h-14 text-black bg-[#e9f0f4] hover:bg-gray-200 shadow-md font-bold py-1 px-2 rounded-2xl dark:bg-[#222427] dark:text-white" value="9" />
                                                                        <input type="button" onClick={() => updateDisplay('+')} class="w-20 h-14 text-white bg-[#ff9500] hover:bg-[#e68600] shadow-md font-bold py-1 px-2 rounded-2xl" value="+" />
                                                                    </div>

                                                                    <div class="flex space-x-2 mt-3">
                                                                        <input type="button" onClick={() => updateDisplay('4')} class="w-20 h-14 text-black bg-[#e9f0f4] hover:bg-gray-200 shadow-md font-bold py-1 px-2 rounded-2xl dark:bg-[#222427] dark:text-white" value="4" />
                                                                        <input type="button" onClick={() => updateDisplay('5')} class="w-20 h-14 text-black bg-[#e9f0f4] hover:bg-gray-200 shadow-md font-bold py-1 px-2 rounded-2xl dark:bg-[#222427] dark:text-white" value="5" />
                                                                        <input type="button" onClick={() => updateDisplay('6')} class="w-20 h-14 text-black bg-[#e9f0f4] hover:bg-gray-200 shadow-md font-bold py-1 px-2 rounded-2xl dark:bg-[#222427] dark:text-white" value="6" />
                                                                        <input type="button" onClick={() => updateDisplay('*')} class="w-20 h-14 text-white bg-[#ff9500] hover:bg-[#e68600] shadow-md font-bold py-1 px-2 rounded-2xl" value="x" />
                                                                    </div>

                                                                    <div class="flex space-x-2 mt-3">
                                                                        <input type="button" onClick={() => updateDisplay('3')} class="w-20 h-14 text-black bg-[#e9f0f4] hover:bg-gray-200 shadow-md font-bold py-1 px-2 rounded-2xl dark:bg-[#222427] dark:text-white" value="3" />
                                                                        <input type="button" onClick={() => updateDisplay('2')} class="w-20 h-14 text-black bg-[#e9f0f4] hover:bg-gray-200 shadow-md font-bold py-1 px-2 rounded-2xl dark:bg-[#222427] dark:text-white" value="2" />
                                                                        <input type="button" onClick={() => updateDisplay('1')} class="w-20 h-14 text-black bg-[#e9f0f4] hover:bg-gray-200 shadow-md font-bold py-1 px-2 rounded-2xl dark:bg-[#222427] dark:text-white" value="1" />
                                                                        <input type="button" onClick={() => updateDisplay('-')} class="w-20 h-14 text-white bg-[#ff9500] hover:bg-[#e68600] shadow-md font-bold py-1 px-2 rounded-2xl" value="-" />
                                                                    </div>

                                                                    <div class="flex space-x-2 mt-3">
                                                                        <input type="button" onClick={() => updateDisplay('0')} class="w-20 h-14 text-black bg-[#e9f0f4] hover:bg-gray-200 shadow-md font-bold py-1 px-2 rounded-2xl dark:bg-[#222427] dark:text-white" value="" />
                                                                        <input type="button" onClick={() => updateDisplay('0')} class="w-20 h-14 text-black bg-[#e9f0f4] hover:bg-gray-200 shadow-md font-bold py-1 px-2 rounded-2xl dark:bg-[#222427] dark:text-white" value="0" />
                                                                        <input type="button" onClick={() => updateDisplay('.')} class="w-20 h-14 text-black bg-[#e9f0f4] hover:bg-gray-200 shadow-md font-bold py-1 px-2 rounded-2xl dark:bg-[#222427] dark:text-white" value="." />
                                                                        <input type="button" onClick={() => calculate()} class="w-20 h-14 text-white bg-green-500 hover:bg-green-600 shadow-md font-bold py-1 px-2 rounded-2xl" value="=" />
                                                                    </div>
                                                                </div>

                                                            </div>
                                                            <button type='submit' onClick={(event) => {
                                                                handleSubmitOrder(item, event);
                                                                setTimeout(() => {
                                                                    close();
                                                                }, 2000);
                                                            }} className="mb-0 text-white flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-10 py-4 text-center">
                                                                Pay Now
                                                            </button>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </Popup>
                                </div>
                                <div className='mt-2 bg-white rounded-md shadow-md w-full flex justify-center overflow-x-auto'>
                                    {item.description}
                                </div>
                            </div>
                        )
                    })}
                </div>

            </div>
            <ReactPaginate
                onPageChange={(e) => setCurrentPage(e.selected + 1)} pageRangeDisplayed={3}
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

    </>)
}
export default Cs_OnProcessBuy