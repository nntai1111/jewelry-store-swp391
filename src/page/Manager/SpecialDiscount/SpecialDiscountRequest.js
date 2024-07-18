
import React, { useEffect, useState, useRef } from 'react';
import { IoIosSearch } from "react-icons/io";
import { format } from 'date-fns';
import axios from "axios";
import clsx from 'clsx';
import { toast } from 'react-toastify';
import { CiViewList } from "react-icons/ci";
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
const SpecialDiscountRequest = () => {
    const scrollRef = useRef(null);
    const [isYesNoOpen, setIsYesNoOpen] = useState(false);
    const [listSpecialDiscount, setListSpecialDiscount] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpenDetail, setIsModalOpenDetail] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const specialDiscountPerPageOptions = [10, 15, 20, 25, 30, 35, 40, 45, 50];
    const [searchQuery1, setSearchQuery1] = useState(''); // when click icon => search, if not click => not search
    const [ascending, setAscending] = useState(false);
    const [newStatus, setNewStatus] = useState('approved');
    const [selectedRequestId, setSelectedRequestId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [currentPage]);
    useEffect(() => {
        if (searchQuery) {

            handleSearch();

        } else {

            getSpecialDiscount();

        }
    }, [pageSize, currentPage, searchQuery, ascending]);


    const getSpecialDiscount = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No token found");
            }
            const res = await axios.get(`https://jssatsproject.azurewebsites.net/api/SpecialDiscountRequest/getall?pageIndex=${currentPage}&pageSize=${pageSize}&ascending=true`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (res && res.data && res.data.data) {
                const specialDiscounts = res.data.data;
                setListSpecialDiscount(specialDiscounts);
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

    const handleDetailClick = async (customerPhone, sellOrderId, item) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No token found");
            }

            // Example of passing data through URL query parameters
            navigate(`/manager/detailSpecialRequest?id=${sellOrderId}&phone=${customerPhone}`);
        } catch (error) {
            console.error('Error handling detail click:', error);
        }
    };

    const handleSort = () => {
        setAscending(!ascending); // Toggle ascending state
        setCurrentPage(1); // Reset to first page when sorting changes
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
                `https://jssatsproject.azurewebsites.net/api/specialDiscountRequest/search?searchTerm=${searchQuery}&pageIndex=${currentPage}&pageSize=${pageSize}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (res && res.data && res.data.data) {
                const searched = res.data.data;
                setListSpecialDiscount(searched);
                setTotalPages(res.data.totalPages);
                // console.log('>>> check search', res)
            }
            else {
                setListSpecialDiscount([]);
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
    const handleStatusUpdate = async () => {
        try {
            const token = localStorage.getItem('token');
            const staffId = localStorage.getItem('staffId');

            if (!token || !staffId) {
                throw new Error("Token or staffId not found");
            }

            // Fetch the current specialDiscount details from the listSpecialDiscount state
            const specialDiscountToUpdate = listSpecialDiscount.find(promo => promo.requestId === selectedRequestId);

            if (!specialDiscountToUpdate) {
                throw new Error("SpecialDiscount request not found");
            }

            // Construct the payload with only approvedBy and status
            const payload = {
                ...specialDiscountToUpdate,  // Keep existing fields as they are
                approvedBy: staffId,    // Update approvedBy
                status: newStatus      // Update status rejected approved
            };

            // Send the PUT request to update the specialDiscount request
            const res = await axios.put(`https://jssatsproject.azurewebsites.net/api/specialDiscountRequest/UpdatespecialDiscountRequest?id=${selectedRequestId}`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // // If status is 'approved', create a new specialDiscount

            toast.success('Status updated successfully');
            setIsYesNoOpen(false);
            setNewStatus('approved')
            closeModal();
            getSpecialDiscount(); // Refresh specialDiscount list after update
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        }
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

    const openModal = (requestId) => {
        setSelectedRequestId(requestId);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedRequestId(null);
    };
    const handleYesNo = () => {
        setIsYesNoOpen(true);
    };
    const placeholders = Array.from({ length: pageSize - listSpecialDiscount.length });

    return (
        <div className="flex items-center justify-center min-h-screen bg-white mx-5 pt-5 mb-5 rounded">
            <div>
                <h1 ref={scrollRef} className="text-3xl font-bold text-center text-blue-800 mb-4"> Special Discount Request</h1>
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
                            {specialDiscountPerPageOptions.map((size) => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                        </select>
                    </div>
                    <div className="relative w-[400px]">
                        <input
                            type="text"
                            placeholder="Search by customer phone or sell order code"
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
                            <tr className="whitespace-nowrap text-xl  font-bold">
                                <th className="rounded-l-lg"></th>
                                <th  >Sell Order</th>
                                <th className='py-3' >Name</th>
                                <th  >Phone</th>
                                <th className=" text-center">Discount Rate</th>
                                <th  >Approved By</th>
                                <th className="text-center ">Status</th>
                                <th className=" rounded-r-lg ">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listSpecialDiscount.map((item, index) => (
                                <tr key={index} className="cursor-pointer font-normal text-black bg-white shadow-md rounded font-bold text-base hover:shadow-2xl">
                                    <td className="rounded-l-lg pr-3 pl-5 py-4 text-black ">{index + (currentPage - 1) * pageSize + 1}</td>
                                    <td >{item.sellOrderCode || 'null'}</td>
                                    <td >{item.customerName}</td>
                                    <td >{item.customerPhone}</td>
                                    <td className="text-center ">{item.discountRate}</td>
                                    <td >{item.approvedName || 'null'}</td>
                                    <td className=" text-center">
                                        {item.status === 'approved'
                                            ? (<span className="text-yellow-500 bg-yellow-100 font-bold p-1 px-2 rounded-xl">Approved</span>)
                                            : item.status === 'rejected' ? (
                                                <span className="text-red-500 bg-red-100 font-bold p-1 px-2 rounded-xl">Rejected</span>
                                            ) : item.status === 'used' ? (
                                                <span className="text-green-500 bg-green-100 font-bold p-1 px-6 rounded-xl">used</span>
                                            ) : (<button
                                                className="my-2 border border-white bg-blue-600 text-white rounded-md transition duration-200 ease-in-out hover:bg-[#1d3279] active:bg-[#4741b174] focus:outline-none"
                                                onClick={() => openModal(item.requestId)} // Open modal with requestId on button click
                                            >
                                                {item.status}
                                            </button>)
                                        }
                                    </td>
                                    <td className="text-3xl text-[#000099] pl-2">
                                        {/* {item.status !== 'rejected' && (<CiViewList onClick={() => handleDetailClick(item.customerPhone, item.sellOrderId)} />)} */}
                                        <CiViewList onClick={() => handleDetailClick(item.customerPhone, item.sellOrderId)} />

                                    </td>
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
                {showModal && (
                    <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-4 rounded-lg shadow-lg w-1/3">
                            <h2 className="text-xl font-bold text-blue-600 text-center mb-4">Update Special discount Request Status</h2>
                            <div className="mb-4">
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Response: </label>
                                <select
                                    id="status"
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                >
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>
                            <div className="flex">
                                <button
                                    // type='button'
                                    onClick={handleYesNo}
                                    className="mr-2 px-4 py-2 bg-blue-500 text-white rounded-md"
                                    style={{ width: '5rem' }}
                                >
                                    Save
                                </button>
                                <button
                                    onClick={closeModal}
                                    className="mr-2 ml-0 px-4 py-2 bg-gray-500 text-white rounded-md"
                                    style={{ width: '5rem' }}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}



                {isYesNoOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
                        <div className="bg-white rounded-lg p-8 max-w-md w-full">
                            <h2 className="text-2xl font-bold text-black mb-4">Confilm to update</h2>
                            <p>Are you sure to update special discount request status</p>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="mr-2 px-4 py-2 bg-blue-500 text-white rounded-md"
                                    onClick={handleStatusUpdate}
                                >
                                    Yes
                                </button>
                                <button
                                    type="button"
                                    className="mr-2 ml-0 px-4 py-2 bg-red-500 text-white rounded-md"
                                    onClick={() => setIsYesNoOpen(false)}
                                >
                                    No
                                </button>
                            </div>

                        </div>
                    </div>
                )}
            </div>



        </div >
    );
};
const StatusUpdateModal = ({ onClose, requestId, handleStatusUpdate }) => {
    const [newStatus, setNewStatus] = useState('approved');

    const handleSubmit = () => {
        handleStatusUpdate(newStatus);
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg shadow-lg w-1/3">
                <h2 className="text-lg font-semibold mb-4">Update SpecialDiscount Request Status</h2>
                <div className="mb-4">
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">Response: </label>
                    <select
                        id="status"
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
                <div className="flex justify-end">
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                    >
                        Update
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};
export default SpecialDiscountRequest;
