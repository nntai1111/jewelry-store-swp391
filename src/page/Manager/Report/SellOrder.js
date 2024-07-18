import React, { useEffect, useState, useRef } from 'react'
import clsx from 'clsx'
import { IoIosSearch } from "react-icons/io";
import axios from "axios";
import Modal from 'react-modal';
import { CiViewList } from "react-icons/ci";
import { FaMoneyBillWave } from "react-icons/fa"; // cash
import vnPayLogo from '../../../assets/vnpay.jpg'

const SellOrder = () => {
    const scrollRef = useRef(null);

    const [listSellOrder, setListSellOrder] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchQuery1, setSearchQuery1] = useState(''); // when click icon => search, if not click => not search

    const [selectedOrder, setSelectedOrder] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const sellOrderPerPageOptions = [10, 15, 20, 25, 30, 35, 40, 45, 50];
    const [ascending, setAscending] = useState(false);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [currentPage]);

    useEffect(() => {
        if (searchQuery) {

            handleSearch();

        } else {

            getSellOrder();

        }
    }, [pageSize, currentPage, searchQuery, ascending]);

    const handleDetailClick = async (id) => {
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
            // console.log('check detail clickcccc', res.data.data[0])
            if (res && res.data) {
                const details = res.data.data[0];
                // console.log('check detail click', res.data.data[0].sellOrderDetails)
                setSelectedOrder(details);
                setIsModalOpen(true); // Open modal when staff details are fetched
            }
        } catch (error) {
            console.error('Error fetching staff details:', error);
        }
    };

    const getSellOrder = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No token found");
            }
            const res = await axios.get(`https://jssatsproject.azurewebsites.net/api/sellorder/getall?statusList=completed&ascending=${ascending}&pageIndex=${currentPage}&pageSize=${pageSize}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (res && res.data && res.data.data) {
                const allSellOrders = res.data.data;
                setListSellOrder(allSellOrders);
                setTotalPages(res.data.totalPages);
            }
        } catch (error) {
            console.error('Error fetching staffs:', error);
            if (error.response) {
                console.error('Error response:', error.response.data);
            } else if (error.request) {
                console.error('Error request:', error.request);
            } else {
                console.error('Error message:', error.message);
            }
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0
        }).format(value);
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

    const handleSearch = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }
            const res = await axios.get(
                `https://jssatsproject.azurewebsites.net/api/sellorder/search?statusList=completed&customerPhone=${searchQuery}&ascending=${ascending}&pageIndex=${currentPage}&pageSize=${pageSize}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (res && res.data && res.data.data) {
                const searched = res.data.data;
                setListSellOrder(searched);
                setTotalPages(res.data.totalPages);
                console.log('>>> check search', res)
            }
            else {
                setListSellOrder([]);
                setTotalPages(0);
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
        setSelectedOrder(null)

    };
    const handleSort = () => {
        setAscending(!ascending); // Toggle ascending state
        setCurrentPage(1); // Reset to first page when sorting changes
    };
    const formatDateTime = (isoString) => {
        const date = new Date(isoString);

        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const year = date.getFullYear();

        return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
    };
    const placeholders = Array.from({ length: pageSize - listSellOrder.length });

    return (
        <div className="flex items-center justify-center min-h-screen bg-white mx-5 pt-5 mb-5 rounded">
            <div>
                <h1 ref={scrollRef} className="text-3xl font-bold text-center text-blue-800 mb-4">List of sell order</h1>
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
                            placeholder="Search by customer phone"
                            value={searchQuery1}
                            onChange={handleSearchChange}
                            className="px-3 py-2 border border-gray-300 rounded-md w-full"
                        />
                        <IoIosSearch className="absolute top-0 right-0 mr-3 mt-3 cursor-pointer text-gray-500" onClick={handleSetQuery} />
                    </div>
                </div>
                <div className="w-[1200px] overflow-hidden ">
                    <table className="font-inter w-full table-auto text-left">
                        <thead className="w-full rounded-lg bg-blue-900 text-base font-semibold text-white  sticky top-0">
                            <tr className="whitespace-nowrap text-xl font-bold">
                                <th className="rounded-l-lg"></th>
                                <th className="py-3 pl-3">Code</th>
                                <th >Staff name</th>
                                <th >Customer</th>
                                <th >Phone number</th>
                                <th className="cursor-pointer " onClick={handleSort}>
                                    <span>Time</span>
                                    <span className=' text-sm mx-2'>{ascending ? '▲' : '▼'}</span>
                                </th>
                                <th >Total</th>
                                <th className=" rounded-r-lg ">Action</th>
                            </tr>
                        </thead>

                        <tbody >
                            {listSellOrder.map((item, index) => (
                                <tr key={index} className="cursor-pointer font-normal text-black bg-white shadow-md rounded font-bold text-base hover:shadow-2xl">
                                    <td className="rounded-l-lg pr-3 pl-5 py-4 text-black ">{index + (currentPage - 1) * pageSize + 1}</td>
                                    <td >{item.code}</td>
                                    <td >{item.staffName}</td>
                                    <td >{item.customerName}</td>
                                    <td >{item.customerPhoneNumber}</td>
                                    <td >{formatDateTime(item.createDate)}</td>
                                    <td className=''>{formatCurrency(item.finalAmount)}</td>
                                    <td className="text-3xl text-[#000099] pl-2"><CiViewList onClick={() => handleDetailClick(item.id)} /></td>
                                </tr>
                            ))}
                            {placeholders.map((_, index) => (
                                <tr key={`placeholder-${index}`} className="cursor-pointer bg-[#f6f8fa] drop-shadow-[0_0_10px_rgba(34,46,58,0.02)]">
                                    <td className="rounded-l-lg pl-3 text-sm font-normal text-[#637381] py-4">-</td>
                                    <td className="text-sm font-normal text-[#637381] py-4">-</td>
                                    <td className="text-sm font-normal text-[#637381] py-4">-</td>
                                    <td className="text-sm font-normal text-[#637381] py-4">-</td>
                                    <td className="text-sm font-normal text-[#637381] py-4">-</td>
                                    <td className="text-sm font-normal text-[#637381] py-4">-</td>
                                    <td className="text-sm font-normal text-[#637381] py-4">-</td>
                                    <td className="text-sm font-normal text-[#637381] py-4">-</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-center my-4">
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
                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    contentLabel="Product Details"
                    className="bg-white p-6 rounded-lg shadow-lg w-full max-w-[1000px] mx-auto"
                    overlayClassName="fixed inset-0 z-30 bg-black bg-opacity-50 flex justify-center items-center"
                >
                    {selectedOrder && (
                        <div className="fixed inset-0 flex items-center justify-center z-10 bg-gray-800 bg-opacity-50">
                            <div className="bg-white rounded-lg p-8 w-full max-w-[1000px]">
                                <h1 className='text-blue-800 text-center font-bold text-3xl mb-4'>Sell Order Detail ({selectedOrder.sellOrderDetails ? selectedOrder.sellOrderDetails.length : 0})</h1>
                                <div className="grid grid-cols-2 gap-4 ml-4 mb-4 mx-6">
                                    <div className="shadow-xl p-4 rounded-lg">
                                        <p className="mb-4">
                                            <strong>Code:</strong> {selectedOrder.code}
                                        </p>
                                        <p className="mb-4">
                                            <strong>Total Value:</strong> {formatCurrency(selectedOrder.finalAmount)}
                                        </p>
                                        <p className="mb-4">
                                            <strong>Time:</strong> {formatDateTime(selectedOrder.createDate)}
                                        </p>
                                        <p className="mb-4">
                                            <strong>Special Discount Rate:</strong> {selectedOrder.specialDiscountRate}
                                        </p>
                                        <p className="mb-4">
                                            <strong>Special Discount Status:</strong>
                                            {selectedOrder.specialDiscountStatus === 'approved'
                                                ? (<span className="text-yellow-500 bg-yellow-100 font-bold p-1 mx-2  rounded-xl">APPROVED</span>)
                                                : selectedOrder.specialDiscountStatus === 'rejected' ? (
                                                    <span className="text-red-500 bg-red-100 font-bold p-1 mx-2 rounded-xl">REJECTED</span>
                                                ) : selectedOrder.specialDiscountStatus === 'used' ? (
                                                    <span className="text-green-500 bg-green-100 font-bold p-1 px-2 mx-2 rounded-xl">USED</span>
                                                ) : selectedOrder.specialDiscountStatus
                                            }

                                        </p>
                                        <p className="mb-4 flex items-center">
                                            <strong className="mr-2">Payment Method:</strong>{selectedOrder.paymentMethod}
                                            {selectedOrder.paymentMethod === 'VnPay' ? (
                                                <img src={vnPayLogo} alt="VNPay Logo" className="w-5 h-auto mx-2" />
                                            ) : selectedOrder.paymentMethod === 'Cash' ? (
                                                <FaMoneyBillWave className="text-green-500 text-2xl mx-2" />
                                            ) : (
                                                'null'
                                            )}
                                        </p>
                                        {/* <p className="mb-4">
                                        <strong>Quantity Of Products:</strong> {selectedOrder.sellOrderDetails ? selectedOrder.sellOrderDetails.length : 0}
                                    </p> */}
                                    </div>
                                    <div className="shadow-xl p-4 rounded-lg">
                                        <p className="mb-4">
                                            <strong>Customer:</strong> {selectedOrder.customerName}
                                        </p>
                                        <p className="mb-4">
                                            <strong>Phone:</strong> {selectedOrder.customerPhoneNumber}
                                        </p>
                                        <p className="mb-4">
                                            <strong>Seller:</strong> {selectedOrder.staffName}
                                        </p>
                                        <p className="mb-4 mr-4">
                                            <strong>Description:</strong> {selectedOrder.description || 'null'}
                                        </p>
                                        <p className="mb-4">
                                            <strong>Status:</strong>
                                            {selectedOrder.status === 'completed' ? (
                                                <span className="text-green-500 bg-green-100 font-bold p-1 px-2 mx-2 rounded-xl">COMPLETED</span>
                                            ) : selectedOrder.status === 'cancelled' ? (
                                                <span className="text-red-500 bg-red-100 font-bold p-1 px-2 mx-2 rounded-xl">CANCELLED</span>
                                            ) : selectedOrder.status === 'processing' ? (
                                                <span className="text-yellow-600 bg-yellow-100 font-bold p-1 px-2 mx-2 rounded-xl">PROCESSING</span>
                                            ) : selectedOrder.status === 'draft' ? (
                                                <span className="text-black bg-gray-100 font-bold p-1 px-7 mx-2 rounded-xl">DRAFT</span>
                                            ) : (
                                                <span className="relative group text-blue-500 bg-blue-100 font-bold p-1 px-2 mx-2 rounded-xl">
                                                    {selectedOrder.status}
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
                                            {selectedOrder.sellOrderDetails && selectedOrder.sellOrderDetails.map((item, index) => (
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
                    )}
                </Modal>

            </div>
        </div>
    )
}

export default SellOrder