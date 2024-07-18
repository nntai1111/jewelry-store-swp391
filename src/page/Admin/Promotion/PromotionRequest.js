
import React, { useEffect, useState, useRef } from 'react';
import { IoIosSearch } from "react-icons/io";
import { format } from 'date-fns';
import axios from "axios";
import clsx from 'clsx';
import { toast } from 'react-toastify';
import { CiViewList } from "react-icons/ci";
import Modal from 'react-modal';

const PromotionRequest = () => {
    const scrollRef = useRef(null);

    const [originalListPromotion, setOriginalListPromotion] = useState([]);
    const [listPromotion, setListPromotion] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedRequestId, setSelectedRequestId] = useState(null);


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenDetail, setIsModalOpenDetail] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const promotionPerPageOptions = [10, 15, 20, 25, 30, 35, 40, 45, 50];
    const [searchQuery1, setSearchQuery1] = useState(''); // when click icon => search, if not click => not search
    const [ascending, setAscending] = useState(false);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [currentPage]);
    useEffect(() => {

        getCategory();
    }, []);
    useEffect(() => {
        if (searchQuery) {

            handleSearch();

        } else {

            getPromotion();

        }
    }, [pageSize, currentPage, searchQuery, ascending]);

    const getCategory = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No token found");
            }
            const res = await axios.get('https://jssatsproject.azurewebsites.net/api/productcategory/getall', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (res && res.data && res.data.data) {
                const categories = res.data.data;
                setCategories(categories);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };


    const getPromotion = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No token found");
            }
            const res = await axios.get(`https://jssatsproject.azurewebsites.net/api/promotionRequest/getall?ascending=${ascending}&pageIndex=${currentPage}&pageSize=${pageSize}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (res && res.data && res.data.data) {
                const promotions = res.data.data;
                setListPromotion(promotions);
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

    const handleDetailClick = async (id) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No token found");
            }
            const res = await axios.get(`https://jssatsproject.azurewebsites.net/api/promotionRequest/getById?id=${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            // console.log('check detail click', res)
            if (res && res.data && res.data.data) {
                const details = res.data.data[0];
                // console.log('check detail click', res)
                setSelectedRequest(details);
                setIsModalOpenDetail(true); // Open modal when staff details are fetched
            }
        } catch (error) {
            console.error('Error fetching staff details:', error);
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
                `https://jssatsproject.azurewebsites.net/api/promotionRequest/search?description=${searchQuery}&pageIndex=${currentPage}&pageSize=${pageSize}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (res && res.data && res.data.data) {
                const searched = res.data.data;
                setListPromotion(searched);
                setTotalPages(res.data.totalPages);
                // console.log('>>> check search', res)
            }
            else {
                setListPromotion([]);
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

    const getNamefromDescription = (value) => {
        const newlinePosition = value.indexOf('\n');
        return newlinePosition !== -1 ? value.substring(0, newlinePosition) : value;
    }

    const getDescription = (value) => {
        const newlinePosition = value.indexOf('\n');
        return newlinePosition !== -1 ? value.substring(newlinePosition + 1) : '';
    }

    const openModal = (requestId) => {
        setSelectedRequestId(requestId);
        setShowModal(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsModalOpenDetail(false);
        setShowModal(false);
        setSelectedRequestId(null);
    };

    const handleStatusUpdate = async (newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const staffId = localStorage.getItem('staffId');

            if (!token || !staffId) {
                throw new Error("Token or staffId not found");
            }

            // Fetch the current promotion details from the listPromotion state
            const promotionToUpdate = listPromotion.find(promo => promo.requestId === selectedRequestId);

            if (!promotionToUpdate) {
                throw new Error("Promotion request not found");
            }

            // Construct the payload with only approvedBy and status
            const payload = {
                ...promotionToUpdate,  // Keep existing fields as they are
                approvedBy: staffId,    // Update approvedBy
                status: newStatus      // Update status rejected approved
            };

            // Send the PUT request to update the promotion request
            const res = await axios.put(`https://jssatsproject.azurewebsites.net/api/promotionrequest/UpdatePromotionRequest?id=${selectedRequestId}`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // // If status is 'approved', create a new promotion
            if (newStatus === 'approved') {
                const { description, discountRate, startDate, endDate, categories } = promotionToUpdate;


                const createPromotionPayload = {
                    name: getNamefromDescription(description),
                    description: getDescription(description),
                    discountRate,
                    startDate,
                    endDate,
                    categoriIds: promotionToUpdate.categories.map(category => category.id),
                    status: 'active'
                };
                console.log('>>>check new promotion approved', createPromotionPayload)
                const createPromotionRes = await axios.post('https://jssatsproject.azurewebsites.net/api/promotion/createpromotion', createPromotionPayload, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                //Assuming create promotion API returns the created promotion details
                if (createPromotionRes && createPromotionRes.data) {
                    // toast.success('Promotion created successfully');
                } else {
                    throw new Error('Failed to create promotion');
                }
            }

            toast.success('Status updated successfully');

            closeModal();
            getPromotion(); // Refresh promotion list after update
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        }
    };

    const placeholders = Array.from({ length: pageSize - listPromotion.length });

    return (
        <div className="flex items-center justify-center min-h-screen bg-white mx-5 pt-5 mb-5 rounded">
            <div>
                <h1 className="text-3xl font-bold text-center text-blue-800 mb-4"> Promotion Request List</h1>
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
                            {promotionPerPageOptions.map((size) => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                        </select>
                    </div>
                    <div className="relative w-[400px]">
                        <input
                            type="text"
                            placeholder="Search by name"
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
                                <th >Name</th>
                                {/* <th >Description</th> */}
                                <th className=" text-center">Discount Rate</th>
                                <th >From</th>
                                <th >To</th>
                                <th className='text-center' >Status</th>
                                <th className=" py-3 rounded-r-lg">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listPromotion.map((item, index) => (
                                <tr key={index} className="cursor-pointer font-normal text-black bg-white shadow-md rounded font-bold text-base hover:shadow-2xl">
                                    <td className="rounded-l-lg pr-3 pl-5 py-4 text-black ">{index + (currentPage - 1) * pageSize + 1}</td>
                                    <td >{getNamefromDescription(item.description)}</td>
                                    {/* <td>{getDescription(item.description)}</td> */}
                                    <td className="text-center ">{item.discountRate}</td>
                                    <td >{format(new Date(item.startDate), 'dd/MM/yyyy')}</td>
                                    <td >{format(new Date(item.endDate), 'dd/MM/yyyy')}</td>
                                    <td className=" text-center">
                                        {item.status === 'approved'
                                            ? (<span className="text-green-500 bg-green-100 font-bold p-1 px-2 rounded-xl">Approved</span>)
                                            : item.status === 'rejected' ? (
                                                <span className="text-red-500 bg-red-100 font-bold p-1 px-2 rounded-xl">Rejected</span>
                                            ) : (<button
                                                className="my-2 border border-white bg-blue-600 text-white rounded-md transition duration-200 ease-in-out hover:bg-[#1d3279] active:bg-[#4741b174] focus:outline-none"
                                                onClick={() => openModal(item.requestId)} // Open modal with requestId on button click
                                            >
                                                {item.status}
                                            </button>)
                                        }

                                    </td>
                                    <td className="text-3xl  text-[#000099] pl-2"><CiViewList onClick={() => handleDetailClick(item.requestId)} /></td>

                                </tr>
                            ))}
                            {placeholders.map((_, index) => (
                                <tr key={`placeholder-${index}`} className="cursor-pointer bg-[#f6f8fa] drop-shadow-[0_0_10px_rgba(34,46,58,0.02)]">
                                    <td className="rounded-l-lg pl-3 text-sm font-normal text-[#637381] py-4">-</td>
                                    <td className="text-sm font-normal text-[#637381] text-center py-4">-</td>
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
            </div>

            {showModal && (
                <StatusUpdateModal
                    onClose={closeModal}
                    requestId={selectedRequestId}
                    handleStatusUpdate={handleStatusUpdate}
                />
            )}
            <Modal
                isOpen={isModalOpenDetail}
                onRequestClose={closeModal}
                contentLabel="Product Details"
                className="bg-white p-6 rounded-lg shadow-lg "
                overlayClassName="fixed inset-0 z-30 bg-black bg-opacity-50 flex justify-center items-center"
            >
                {selectedRequest && (
                    <div className="fixed inset-0 z-30 flex items-center justify-center z-10 bg-gray-800 bg-opacity-50">
                        <div className="bg-white rounded-lg p-8 max-w-md w-full">
                            <h2 className="text-xl font-bold text-blue-600 text-center mb-4">{selectedRequest.description && getNamefromDescription(selectedRequest.description)}</h2>
                            <p className="text-base text-gray-700 mb-2"> <strong>Manager:</strong> {selectedRequest.managerName}</p>
                            <p className="text-base text-gray-700 mb-2"><strong>Discount Rate: </strong>{selectedRequest.discountRate}</p>
                            <p className="text-base text-gray-700 mb-2"><strong>Description: </strong>{selectedRequest.description && getDescription(selectedRequest.description)}</p>
                            <p className="text-base text-gray-700 mb-2"><strong>Start Date: </strong>{selectedRequest.startDate && format(new Date(selectedRequest.startDate), 'dd/MM/yyyy')}</p>
                            <p className="text-base text-gray-700 mb-2"><strong>End Date:</strong> {selectedRequest.endDate && format(new Date(selectedRequest.endDate), 'dd/MM/yyyy')}</p>
                            <div >
                                <p className="text-base text-gray-700 mb-2"><strong>Categories:</strong></p>
                                <ul className="list-disc list-inside">
                                    {selectedRequest.categories && selectedRequest.categories.map((category, index) => (
                                        <li key={index} className="text-sm">{category.name}</li>
                                    ))}
                                </ul>
                            </div>
                            <p className="text-base text-gray-700 mb-2"><strong>Create at:</strong> {selectedRequest.createdAt && formatDateTime(selectedRequest.createdAt)}</p>

                            <p className="text-base text-gray-700 mb-2"><strong>Status: </strong>
                                {selectedRequest.status === 'approved'
                                    ? (<span className="text-green-500 bg-green-100 font-bold p-1 px-2 rounded-xl">Approved</span>)
                                    : selectedRequest.status === 'rejected' ? (
                                        <span className="text-red-500 bg-red-100 font-bold p-1 px-2 rounded-xl">Rejected</span>
                                    ) : selectedRequest.status
                                }
                            </p>
                            <div className='flex justify-end mt-6'>
                                <button
                                    className="px-6 py-3 bg-blue-500 text-white rounded" onClick={closeModal}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div >
                )}
            </Modal >
        </div>
    );
};

const StatusUpdateModal = ({ onClose, requestId, handleStatusUpdate }) => {
    const [newStatus, setNewStatus] = useState('approved');
    const [isYesNoOpen, setIsYesNoOpen] = useState(false);
    const handleSubmit = () => {
        handleStatusUpdate(newStatus);
    };
    const handleYesNo = () => {
        setIsYesNoOpen(true);
    };
    return (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg shadow-lg w-1/3">
                <h2 className="text-lg font-semibold mb-4">Update Promotion Request Status</h2>
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
                        // onClick={handleSubmit}
                        type='button'
                        onClick={handleYesNo}
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
            {isYesNoOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full">
                        <h2 className="text-2xl font-bold text-black mb-4">Confilm to update</h2>
                        <p>Change status of promotion request ?</p>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                className="mr-2 px-4 py-2 bg-blue-500 text-white rounded-md"
                                onClick={handleSubmit}
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
    );
};

export default PromotionRequest;
