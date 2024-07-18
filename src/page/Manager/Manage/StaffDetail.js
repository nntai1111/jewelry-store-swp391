
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import clsx from 'clsx'
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { CiViewList } from "react-icons/ci";
import { FaPhoneVolume } from "react-icons/fa6";
import { BsGenderFemale } from "react-icons/bs"; // female
import { BsGenderMale } from "react-icons/bs";//male
// import { MdPlace } from "react-icons/md";//address
import { MdContactMail } from "react-icons/md";//mail
import { RiAwardLine } from "react-icons/ri";//point
import { IoIosSearch } from "react-icons/io";
import { MdFace, MdFace4, MdPlace } from 'react-icons/md';
import { PiGenderFemaleBold, PiGenderMaleBold } from "react-icons/pi";
import { FaMoneyBillWave } from "react-icons/fa"; // cash
import vnPayLogo from '../../../assets/vnpay.jpg'
import { LiaBusinessTimeSolid } from "react-icons/lia";

const StaffDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('Id');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const [selectedSellOrder, setSelectedSellOrder] = useState([]);
    const [selectedBuyOrder, setSelectedBuyOrder] = useState([]);
    const [selectedPaymentOrder, setSelectedPaymentOrder] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [staffData, setStaffData] = useState(null);
    const [sellOrderData, setSellOrderData] = useState(null);
    const [buyOrderData, setBuyOrderData] = useState(null);
    const [paymentData, setPaymentData] = useState(null);

    const [totalPagesSell, setTotalPagesSell] = useState(1);
    const [totalPagesBuy, setTotalPagesBuy] = useState(1);
    const [totalPagesPayment, setTotalPagesPayment] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const sellOrderPerPageOptions = [10, 15, 20, 25, 30, 35, 40, 45, 50];
    const [searchQuery, setSearchQuery] = useState('');
    const [searchQuery1, setSearchQuery1] = useState(''); // when click icon => search, if not click => not search
    const [activeTab, setActiveTab] = useState('sellOrder');

    useEffect(() => {
        switch (activeTab) {
            case 'sellOrder':
                setTotalPages(totalPagesSell);
                break;
            case 'buyOrder':
                setTotalPages(totalPagesBuy);
                break;
            default:
                setTotalPages(0);
        }
    }, [activeTab, totalPagesSell, totalPagesBuy, pageSize]);


    useEffect(() => {
        const fetchStaffData = async () => {
            try {
                const staffRes = await axios.get(`https://jssatsproject.azurewebsites.net/api/staff/getStaffSymmary?id=${id}&startDate=${startDate}&endDate=${endDate}`);
                console.log('checkkkkkkkkkkkkkkkk', staffRes.data.data)
                if (staffRes && staffRes.data) {
                    setStaffData(staffRes.data.data);
                }
            } catch (error) {
                console.error('Error fetching staff details:', error);
            }
        };

        const fetchSellOrderData = async () => {
            try {
                const sellOrderRes = await axios.get(`https://jssatsproject.azurewebsites.net/api/staff/getSellOrderByStaffId?id=${id}&pageSize=${pageSize}&pageIndex=${currentPage}&startDate=${startDate}&endDate=${endDate}`);
                // console.log('>>>>>>chekc', sellOrderRes.data.data)
                if (sellOrderRes && sellOrderRes.data && sellOrderRes.data.data) {
                    setSellOrderData(sellOrderRes.data.data);
                    setTotalPagesSell(sellOrderRes.data.totalPages);
                    // setTotalPages(sellOrderRes.data.totalPages);
                }
            } catch (error) {
                console.error('Error fetching sell orders:', error);
            }
        };
        const fetchBuyOrderData = async () => {
            try {
                const buyOrderRes = await axios.get(`https://jssatsproject.azurewebsites.net/api/staff/getBuyOrdersStaffId?id=${id}&pageSize=${pageSize}&pageIndex=${currentPage}&startDate=${startDate}&endDate=${endDate}`);
                if (buyOrderRes && buyOrderRes.data && buyOrderRes.data.data) {
                    setBuyOrderData(buyOrderRes.data.data);
                    setTotalPagesBuy(buyOrderRes.data.totalPages);
                    // setTotalPages(buyOrderRes.data.totalPages);
                }
            } catch (error) {
                console.error('Error fetching sell orders:', error);
            }
        };

        if (id) {
            if (searchQuery) {
                handleSearchSell(searchQuery);
                handleSearchBuy(searchQuery);
            } else {
                fetchStaffData();
                fetchSellOrderData();
                fetchBuyOrderData();
            }
            // console.log('>>>> gtessttt', totalPages)
        }
    }, [id, currentPage, pageSize, activeTab, searchQuery]);
    // 'sellOrder', 'buyOrder', 'payment'
    const handleDetailClick = async (id, activeList) => {
        if (activeList === 'sellOrder') {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error("No token found");
                }
                const res = await axios.get(`https://jssatsproject.azurewebsites.net/api/sellorder/getbyid?id=${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                // console.log('check detail click', res.data.data[0])
                if (res && res.data) {
                    const details = res.data.data[0];
                    // console.log('check detail click', res.data.data[0].sellOrderDetails)
                    setSelectedSellOrder(details);
                    setIsModalOpen(true); // Open modal when staff details are fetched
                }
            } catch (error) {
                console.error('Error fetching staff details:', error);
            }
        }
        else if (activeList === 'buyOrder') {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error("No token found");
                }
                const res = await axios.get(`https://jssatsproject.azurewebsites.net/api/buyorder/getbyid?id=${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                // console.log('check detail click', res.data.data[0])
                if (res && res.data) {
                    const details = res.data.data;
                    console.log('check detail click', res)
                    setSelectedBuyOrder(details);
                    setIsModalOpen(true); // Open modal when staff details are fetched
                }
            } catch (error) {
                console.error('Error fetching staff details:', error);
            }
        }

    };

    if (!staffData || !sellOrderData || !buyOrderData) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 backdrop-blur-sm">
                <FontAwesomeIcon
                    icon={faSpinner}
                    className="fa-spin fa-2x text-white"
                />
            </div>
        );
    }

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0
        }).format(value);
    };
    const formatPoint = (value) => {
        return new Intl.NumberFormat('de-DE', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
            useGrouping: true,
        }).format(value);
    };

    const formatDateTime = (isoString) => {
        const date = new Date(isoString);

        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
    };

    const handleBack = () => {
        navigate(-1); // Quay lại trang trước đó
    };
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSearchChange = (e) => {
        setSearchQuery1(e.target.value);
    };
    const handleSetQuery = async () => {
        setSearchQuery(searchQuery1)
        setCurrentPage(1);
    }

    const handleSearchSell = async (code) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }
            const res = await axios.get(
                `https://jssatsproject.azurewebsites.net/api/staff/searchSellOrders?id=${id}&OrderCode=${code}&pageSize=${pageSize}&pageIndex=${currentPage}&startDate=${startDate}&endDate=${endDate}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (res && res.data && res.data.data) {
                // console.log('>>>> checkkk search', res)
                const searched = res.data.data;
                setSellOrderData(searched);
                setTotalPages(res.data.totalPages);
                setTotalPagesSell(res.data.totalPages);
                // console.log('>>> check search', res)
            }
            else {
                setSellOrderData([]);
                setTotalPages(0);
                setTotalPagesSell(0);
            }
        } catch (error) {
            console.error('Error fetching search results:', error);
            if (error.response) {
                console.error('Error response:', error.response.data);
            } else if (error.request) {
                console.error('Error request:', error.request);
            } else {
                console.error('Error message:', error.message);
            }
        }
        // setSearchQuery1('');
    };
    const handleSearchBuy = async (code) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }
            const res = await axios.get(
                `https://jssatsproject.azurewebsites.net/api/staff/searchBuyOrders?id=${id}&OrderCode=${code}&pageSize=${pageSize}&pageIndex=${currentPage}&startDate=${startDate}&endDate=${endDate}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (res && res.data && res.data.data) {
                // console.log('>>>> checkkk search', res)
                const searched = res.data.data;
                setBuyOrderData(searched);
                setTotalPages(res.data.totalPages);
                setTotalPagesBuy(res.data.totalPages);
                // console.log('>>> check search', res)
            }
            else {
                setBuyOrderData([]);
                setTotalPages(0);
                setTotalPagesBuy(0);
            }
        } catch (error) {
            console.error('Error fetching search results:', error);
            if (error.response) {
                console.error('Error response:', error.response.data);
            } else if (error.request) {
                console.error('Error request:', error.request);
            } else {
                console.error('Error message:', error.message);
            }
        }
        // setSearchQuery1('');
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedSellOrder(null);
        setSelectedBuyOrder(null);

    };

    const placeholders = sellOrderData && sellOrderData.length !== 0
        ? Array.from({ length: pageSize - sellOrderData.length })
        : Array.from({ length: pageSize });
    const placeholdersBuy = buyOrderData && buyOrderData.length !== 0
        ? Array.from({ length: pageSize - buyOrderData.length })
        : Array.from({ length: pageSize });


    return (
        <>
            <div className='min-h-screen bg-white mx-8 pt-2 rounded relative'>
                <div className="grid grid-cols-10 gap-4">
                    {/* Sell Order List */}
                    <div className="col-span-7 ml-4">
                        <div className="grid grid-cols-2 gap-4 pb-8">
                            {['sellOrder', 'buyOrder'].map(tab => (
                                <div
                                    key={tab}
                                    onClick={() => {
                                        setActiveTab(tab);
                                        setSearchQuery('');
                                        setSearchQuery1('');
                                        setCurrentPage(1);

                                    }}
                                    className={`text-center border-b-2 cursor-pointer ${activeTab === tab ? 'font-bold border-black' : 'border-gray-300'
                                        } cursor-pointer hover:font-bold hover:border-black`}
                                >
                                    {tab === 'sellOrder'
                                        ? 'Sell Order'
                                        : tab === 'buyOrder'
                                            ? 'Buy Order'
                                            : ''
                                    }
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mb-4">
                            <div className="flex items-center ml-2">
                                <label className="block mb-1 mr-2">Page Size:</label>
                                <select
                                    value={pageSize}
                                    onChange={(e) => {
                                        setPageSize(parseInt(e.target.value));
                                        setCurrentPage(1); // Reset to first page when page size changes
                                    }}
                                    className="px-3 py-2 border border-gray-300 rounded-md"
                                >
                                    {sellOrderPerPageOptions.map((size) => (
                                        <option key={size} value={size}>{size}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="relative w-[400px]">
                                <input
                                    type="text"
                                    placeholder="Search by code"
                                    value={searchQuery1}
                                    onChange={handleSearchChange}
                                    className="px-3 py-2 border border-gray-300 rounded-md w-full"
                                />
                                <IoIosSearch className="absolute top-0 right-0 mr-3 mt-3 cursor-pointer text-gray-500" onClick={handleSetQuery} />
                            </div>
                        </div>
                        {activeTab === 'sellOrder' && (
                            <table className="font-inter w-full table-auto text-left">
                                <thead className="w-full rounded-lg bg-blue-900 text-base font-semibold text-white  sticky top-0">
                                    <tr className="whitespace-nowrap text-xl font-bold">
                                        <th className="rounded-l-lg"></th>
                                        <th className="py-3 pl-3">Create Date</th>
                                        <th>Order Code</th>
                                        <th className='text-center'>Value</th>
                                        <th className='pl-6'>Status</th>
                                        <th className="rounded-r-lg">Detail</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {sellOrderData.map((item, index) => (
                                        <tr key={index} className="cursor-pointer font-normal text-black bg-white shadow-md rounded font-bold text-base hover:shadow-2xl">
                                            <td className="rounded-l-lg pr-3 pl-5 py-4 text-black ">{index + (currentPage - 1) * pageSize + 1}</td>
                                            <td className=''>{formatDateTime(item.createDate)}</td>
                                            <td className=''>{item.code}</td>
                                            <td className='text-right pr-8 '>{formatCurrency(item.finalAmount)}</td>
                                            <td>
                                                {item.status === 'completed' ? (
                                                    <span className="text-green-500 bg-green-100 font-bold p-1 px-2 rounded-xl">COMPLETED</span>
                                                ) : item.status === 'cancelled' ? (
                                                    <span className="text-red-500 bg-red-100 font-bold p-1 px-2 rounded-xl">CANCELLED</span>
                                                ) : item.status === 'processing' ? (
                                                    <span className="text-yellow-600 bg-yellow-100 font-bold p-1 px-2 rounded-xl">PROCESSING</span>
                                                ) : item.status === 'draft' ? (
                                                    <span className="text-black bg-gray-100 font-bold p-1 px-7 rounded-xl">DRAFT</span>
                                                ) : (
                                                    <span className="relative group text-blue-500 bg-blue-100 font-bold p-1 px-2 rounded-xl">
                                                        WAITING...
                                                        <span className="absolute left-0 bottom-full mb-1 w-max px-2 py-1 text-sm text-blue-500 bg-blue-100 border border-md border-blue-50 rounded-md opacity-0 group-hover:opacity-100 z-45">
                                                            {item.status}
                                                        </span>
                                                    </span>
                                                )}
                                            </td>
                                            <td className="text-3xl text-[#000099] pl-2 rounded-r-lg">
                                                <CiViewList onClick={() => handleDetailClick(item.id, activeTab)} />
                                            </td>

                                        </tr>
                                    ))}
                                    {placeholders.map((_, index) => (
                                        <tr key={`placeholder-${index}`} className="cursor-pointer font-normal text-black bg-white shadow-md rounded font-bold text-base hover:shadow-2xl">
                                            <td className="rounded-l-lg pr-3 pl-5 py-4 text-black ">-</td>
                                            <td className="">-</td>
                                            <td className="">-</td>
                                            <td className="">-</td>
                                            <td className="">-</td>
                                            <td className="rounded-r-lg">-</td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        {activeTab === 'buyOrder' && (
                            <table className="font-inter w-full table-auto text-left">
                                <thead className="w-full rounded-lg bg-blue-900 text-base font-semibold text-white  sticky top-0">
                                    <tr className="whitespace-nowrap text-xl font-bold">
                                        <th className="rounded-l-lg"></th>
                                        <th className="py-3 pl-3">Create Date</th>
                                        <th>Order Code</th>
                                        <th className='text-center'>Value</th>
                                        <th className='pl-6'>Status</th>
                                        <th className="rounded-r-lg">Detail</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {buyOrderData.map((item, index) => (
                                        <tr key={index} className="cursor-pointer font-normal text-black bg-white shadow-md rounded font-bold text-base hover:shadow-2xl">
                                            <td className="rounded-l-lg pr-3 pl-5 py-4 text-black ">{index + (currentPage - 1) * pageSize + 1}</td>
                                            <td className=''>{formatDateTime(item.createDate)}</td>
                                            <td className=''>{item.code}</td>
                                            <td className='text-right pr-8 '>{formatCurrency(item.totalAmount)}</td>
                                            <td>
                                                {item.status === 'completed' ? (
                                                    <span className="text-green-500 bg-green-100 font-bold p-1 px-2 rounded-xl">COMPLETED</span>
                                                ) : item.status === 'cancelled' ? (
                                                    <span className="text-red-500 bg-red-100 font-bold p-1 px-2 rounded-xl">CANCELLED</span>
                                                ) : item.status === 'processing' ? (
                                                    <span className="text-yellow-600 bg-yellow-100 font-bold p-1 px-2 rounded-xl">PROCESSING</span>
                                                ) : item.status === 'draft' ? (
                                                    <span className="text-black bg-gray-100 font-bold p-1 px-7 rounded-xl">DRAFT</span>
                                                ) : (
                                                    <span className="relative group text-blue-500 bg-blue-100 font-bold p-1 px-2 rounded-xl">
                                                        WAITING...
                                                        <span className="absolute left-0 bottom-full mb-1 w-max px-2 py-1 text-sm text-blue-500 bg-blue-100 border border-md border-blue-50 rounded-md opacity-0 group-hover:opacity-100 z-50">
                                                            {item.status}
                                                        </span>
                                                    </span>
                                                )}
                                            </td>
                                            <td className="text-3xl text-[#000099] pl-2 rounded-r-lg">
                                                <CiViewList onClick={() => handleDetailClick(item.id, activeTab)} />
                                            </td>

                                        </tr>
                                    ))}
                                    {placeholdersBuy.map((_, index) => (
                                        <tr key={`placeholder-${index}`} className="cursor-pointer font-normal text-black bg-white shadow-md rounded font-bold text-base hover:shadow-2xl">
                                            <td className="rounded-l-lg pr-3 pl-5 py-4 text-black ">-</td>
                                            <td className="">-</td>
                                            <td className="">-</td>
                                            <td className="">-</td>
                                            <td className="">-</td>
                                            <td className="rounded-r-lg">-</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                    {/* Staff Details */}
                    <div className="col-span-3 bg-white shadow-md rounded border border-gray-300 px-4 pt-6 pb-8 mr-4">
                        <div className="flex items-center justify-center mb-2">
                            {staffData.gender === 'Male' ? (
                                <MdFace className="text-4xl font-bold text-blue-800 mr-2" />
                            ) : (
                                <MdFace4 className="text-4xl font-bold text-pink-500 mr-2" />
                            )}
                            <h2 className="text-2xl font-bold text-blue-800">
                                {staffData.firstname} {staffData.lastname}
                            </h2>
                        </div>

                        <p className="flex items-center py-3">
                            <FaPhoneVolume className="mr-3 text-green-500 text-2xl font-bold" />
                            <strong className="mr-2">Phone:</strong> {staffData.phone}
                        </p>
                        <p className="flex items-center py-3">
                            <MdContactMail className="mr-3 text-red-500 text-2xl font-bold" />
                            <strong className="mr-2">Email:</strong> {staffData.email}
                        </p>
                        <p className="flex items-center py-3">
                            {staffData.gender === "Male" ? (
                                <PiGenderMaleBold className="text-blue-500 mr-3 text-2xl font-bold" />
                            ) : (
                                <PiGenderFemaleBold className="text-pink-500 mr-3 text-2xl font-bold" />
                            )}
                            <strong className="mr-2">Gender:</strong> {staffData.gender}
                        </p>
                        <p className="flex items-center py-3">
                            <MdPlace className="mr-3 text-red-500 text-2xl font-bold" />
                            <strong className="mr-2">Address:</strong> {staffData.address}
                        </p>
                        <div className="flex flex-col py-3 space-y-3">
                            <div className="flex items-center">
                                <RiAwardLine className="mr-3 text-yellow-500 text-2xl font-bold" />
                                <strong className="mr-2">Revenue:</strong> {formatCurrency(staffData.totalRevenue)}
                            </div>
                            <div className="flex items-center ml-8 ">
                                <strong className="mr-2 ">• Total Sell Order:</strong> {formatPoint(staffData.totalSellOrder)}
                            </div>
                            <div className="flex items-center ml-8 ">
                                <strong className="mr-2">• Total Buy Order:</strong> {formatPoint(staffData.totalBuyOrder)}
                            </div>
                        </div>
                    </div>

                </div>
                <div className="flex justify-left w-5/7 ml-10 ">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => handlePageChange(i + 1)}
                            className={clsx(
                                "mx-1 px-3 py-1 rounded",
                                { "bg-blue-500 text-white": currentPage === i + 1 },
                                { "bg-gray-200": currentPage !== i + 1 }
                            )}
                        >
                            {i + 1}
                        </button>
                    ))}

                </div>
                <button
                    onClick={handleBack}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                    Back
                </button>
            </div >
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Product Details"
                className="bg-white p-6 rounded-lg shadow-lg w-full max-w-[1000px] mx-auto"
                overlayClassName="fixed inset-0 z-30 bg-black bg-opacity-50 flex justify-center items-center"
            >
                {selectedSellOrder
                    ? (
                        <div className="fixed inset-0 flex items-center justify-center z-10 bg-gray-800 bg-opacity-50">
                            <div className="bg-white rounded-lg p-8 w-full max-w-[1000px]">
                                <h1 className='text-blue-800 text-center font-bold text-3xl mb-4'>Sell Order Detail ({selectedSellOrder.sellOrderDetails ? selectedSellOrder.sellOrderDetails.length : 0})</h1>
                                <div className="grid grid-cols-2 gap-4 ml-4 mb-4 mx-6">
                                    <div className="shadow-xl p-4 rounded-lg">
                                        <p className="mb-4">
                                            <strong>Code:</strong> {selectedSellOrder.code}
                                        </p>
                                        <p className="mb-4">
                                            <strong>Total Value:</strong> {formatCurrency(selectedSellOrder.finalAmount)}
                                        </p>
                                        <p className="mb-4">
                                            <strong>Time:</strong> {formatDateTime(selectedSellOrder.createDate)}
                                        </p>
                                        <p className="mb-4">
                                            <strong>Special Discount Rate:</strong> {selectedSellOrder.specialDiscountRate}
                                        </p>
                                        <p className="mb-4">
                                            <strong>Special Discount Status:</strong> {selectedSellOrder.specialDiscountStatus || 'null'}
                                        </p>
                                        <p className="mb-4 flex items-center">
                                            <strong className="mr-2">Payment Method:</strong>{selectedSellOrder.paymentMethod}
                                            {selectedSellOrder.paymentMethod === 'VnPay' ? (
                                                <img src={vnPayLogo} alt="VNPay Logo" className="w-5 h-auto mx-2" />
                                            ) : selectedSellOrder.paymentMethod === 'Cash' ? (
                                                <FaMoneyBillWave className="text-green-500 text-2xl mx-2" />
                                            ) : (
                                                'null'
                                            )}
                                        </p>

                                    </div>
                                    <div className="shadow-xl p-4 rounded-lg">
                                        <p className="mb-4">
                                            <strong>Customer:</strong> {selectedSellOrder.customerName}
                                        </p>
                                        <p className="mb-4">
                                            <strong>Phone:</strong> {selectedSellOrder.customerPhoneNumber}
                                        </p>
                                        <p className="mb-4">
                                            <strong>Seller:</strong> {selectedSellOrder.staffName}
                                        </p>
                                        <p className="mb-4 mr-4">
                                            <strong>Description:</strong> {selectedSellOrder.description || 'null'}
                                        </p>
                                        <p className="mb-4">
                                            <strong>Status:</strong>
                                            {selectedSellOrder.status === 'completed' ? (
                                                <span className="text-green-500 bg-green-100 font-bold p-1 px-2 mx-2 rounded-xl">COMPLETED</span>
                                            ) : selectedSellOrder.status === 'cancelled' ? (
                                                <span className="text-red-500 bg-red-100 font-bold p-1 px-2 mx-2 rounded-xl">CANCELLED</span>
                                            ) : selectedSellOrder.status === 'processing' ? (
                                                <span className="text-yellow-600 bg-yellow-100 font-bold p-1 px-2 mx-2 rounded-xl">PROCESSING</span>
                                            ) : selectedSellOrder.status === 'draft' ? (
                                                <span className="text-black bg-gray-100 font-bold p-1 px-7 mx-2 rounded-xl">DRAFT</span>
                                            ) : (
                                                <span className="relative group text-blue-500 bg-blue-100 font-bold p-1 px-2 mx-2 rounded-xl">
                                                    {selectedSellOrder.status}
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <div className="overflow-x-auto overflow-y-auto max-h-52">
                                    <table className="font-inter w-full table-auto text-left">
                                        <thead className="w-full rounded-lg bg-blue-900 text-base font-semibold text-white sticky top-0">
                                            <tr className="whitespace-nowrap text-xl font-bold">
                                                <th className="py-3 pl-3 rounded-l-lg"></th>
                                                <th className="py-3">Code</th>
                                                <th>Name</th>
                                                <th className='text-center'>Quantity</th>
                                                <th className='text-center'>Promotion</th>
                                                <th>Unit Price</th>
                                                <th className="rounded-r-lg">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedSellOrder.sellOrderDetails && selectedSellOrder.sellOrderDetails.map((item, index) => (
                                                <tr key={index} className="cursor-pointer font-normal text-black bg-white shadow-md rounded font-bold text-base hover:shadow-2xl">
                                                    <td className="rounded-l-lg pr-3 pl-5 py-4 text-black font-bold">{index + 1}</td>
                                                    <td>{item.productCode}</td>
                                                    <td>{item.productName}</td>
                                                    <td className='text-center'>{item.quantity}</td>
                                                    <td className='text-center'>{item.promotionRate || 0}</td>
                                                    <td>{formatCurrency(item.unitPrice)}</td>
                                                    <td className="rounded-r-lg">
                                                        {item.status === 'delivered' ? (
                                                            <span className="text-green-500 bg-green-100 font-bold p-1 px-2 rounded-xl">Delivered</span>
                                                        ) : item.status === 'cancelled' ? (
                                                            <span className="text-red-500 bg-red-100 font-bold p-1 px-2 rounded-xl">Cancelled</span>
                                                        ) : item.status === 'awaiting' ? (
                                                            <span className="text-yellow-600 bg-yellow-100 font-bold p-1 px-2 rounded-xl">Awaiting</span>
                                                        ) : <span className="font-bold p-1 px-2 rounded-xl">{item.status}</span>
                                                        }
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <button
                                    onClick={closeModal}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md mr-2"
                                    style={{ width: '5rem' }}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )
                    : selectedBuyOrder
                        ? (
                            <div className="fixed inset-0 flex items-center justify-center z-10 bg-gray-800 bg-opacity-50">
                                <div className="bg-white rounded-lg p-8 w-full max-w-[1000px]">
                                    <h1 className='text-blue-800 text-center font-bold text-3xl mb-4'>Buy Order Detail ({selectedBuyOrder.buyOrderDetails ? selectedBuyOrder.buyOrderDetails.length : 0})</h1>
                                    <div className="grid grid-cols-2 gap-4 ml-4 mb-4 mx-6">
                                        <div className="shadow-xl p-4 rounded-lg">
                                            <p className="mb-4">
                                                <strong>Code:</strong> {selectedBuyOrder.code}
                                            </p>
                                            <p className="mb-4">
                                                <strong>Total Value:</strong> {formatCurrency(selectedBuyOrder.totalAmount)}
                                            </p>
                                            <p className="mb-4">
                                                <strong>Time:</strong> {formatDateTime(selectedBuyOrder.createDate)}
                                            </p>
                                            <p className="mb-4 flex items-center">
                                                <strong className="mr-2">Payment Method:</strong>{selectedBuyOrder.paymentMethod}
                                                {selectedBuyOrder.paymentMethod === 'VnPay' ? (
                                                    <img src={vnPayLogo} alt="VNPay Logo" className="w-5 h-auto mx-2" />
                                                ) : selectedBuyOrder.paymentMethod === 'Cash' ? (
                                                    <FaMoneyBillWave className="text-green-500 text-2xl mx-2" />
                                                ) : (
                                                    'null'
                                                )}
                                            </p>
                                        </div>
                                        <div className="shadow-xl p-4 rounded-lg">
                                            <p className="mb-4">
                                                <strong>Staff:</strong> {selectedBuyOrder.staffName}
                                            </p>
                                            <p className="mb-4">
                                                <strong>Phone:</strong> {selectedBuyOrder.staffPhoneNumber}
                                            </p>
                                            <p className="mb-4">
                                                <strong>Seller:</strong> {selectedBuyOrder.staffName}
                                            </p>
                                            <p className="mb-4 mr-4">
                                                <strong>Description:</strong> {selectedBuyOrder.description || 'null'}
                                            </p>
                                            <p className="mb-4">
                                                <strong>Status:</strong>
                                                {selectedBuyOrder.status === 'completed' ? (
                                                    <span className="text-green-500 bg-green-100 font-bold p-1 px-2 mx-2 rounded-xl">COMPLETED</span>
                                                ) : selectedBuyOrder.status === 'cancelled' ? (
                                                    <span className="text-red-500 bg-red-100 font-bold p-1 px-2 mx-2 rounded-xl">CANCELLED</span>
                                                ) : selectedBuyOrder.status === 'processing' ? (
                                                    <span className="text-yellow-600 bg-yellow-100 font-bold p-1 px-2 mx-2 rounded-xl">PROCESSING</span>
                                                ) : selectedBuyOrder.status === 'draft' ? (
                                                    <span className="text-black bg-gray-100 font-bold p-1 px-7 mx-2 rounded-xl">DRAFT</span>
                                                ) : (
                                                    <span className="relative group text-blue-500 bg-blue-100 font-bold p-1 px-2 mx-2 rounded-xl">
                                                        {selectedBuyOrder.status}
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto overflow-y-auto max-h-52">
                                        <table className="font-inter w-full table-auto text-left">
                                            <thead className="w-full rounded-lg bg-blue-900 text-base font-semibold text-white sticky top-0">
                                                <tr className="whitespace-nowrap text-xl font-bold">
                                                    <th className="py-3 pl-3 rounded-l-lg" title="Column 1"></th>
                                                    <th className="py-3" title="Category">Cat.</th>
                                                    <th className="py-3" title="Name">Name</th>
                                                    <th className='text-center' title="Material Name">Mat. Name</th>
                                                    <th className='text-center'>Quantity</th>
                                                    <th className='text-center' title="Diamond Grading Code">DGC</th>
                                                    <th title="Value">Value</th>
                                                    <th className="rounded-r-lg" title="Purchase Price Ratio">PP Ratio</th>

                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedBuyOrder.buyOrderDetails && selectedBuyOrder.buyOrderDetails.map((item, index) => (
                                                    <tr key={index} className="cursor-pointer font-normal text-black bg-white shadow-md rounded font-bold text-base hover:shadow-2xl">
                                                        <td className="rounded-l-lg pr-3 pl-5 py-4 text-black font-bold">{index + 1}</td>
                                                        <td>{item.categoryType}</td>
                                                        <td>{item.productName}</td>
                                                        <td className='text-center'>{item.materialName}</td>
                                                        <td className='  text-center'>
                                                            <span className='text-center'>{item.materialWeight || 0}</span>
                                                            {item.caregoryId === '7'
                                                                ? <span className=' ml-2'>carat</span>
                                                                : item.caregoryId === '6' || item.caregoryId === '5'
                                                                    ? <span className='ml-2 '>grams</span>
                                                                    : <span className=' ml-2'>piece</span>
                                                            }
                                                        </td>


                                                        <td className='text-center'>{item.diamondGradingCode || 'null'}</td>
                                                        <td>{formatCurrency(item.unitPrice)}</td>
                                                        <td className="rounded-r-lg text-center">
                                                            {item.purchasePriceRatio}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <button
                                        onClick={closeModal}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-md mr-2"
                                        style={{ width: '5rem' }}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        )
                        : ''
                }

            </Modal>
        </>

    );
};

export default StaffDetail;
