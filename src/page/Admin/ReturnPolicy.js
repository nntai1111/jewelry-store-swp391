
import React, { useEffect, useState } from 'react';
import { IoIosSearch } from "react-icons/io";
import { format } from 'date-fns';
import axios from "axios";
import clsx from 'clsx';
import { LiaEyeDropperSolid } from "react-icons/lia";
import { toast } from 'react-toastify';
import { MdOutlineCancel } from "react-icons/md";
import { CiViewList } from "react-icons/ci";

const ReturnPolicy = () => {
    const [isYesNoOpen, setIsYesNoOpen] = useState(false);
    const [originalListPolicy, setOriginalListPolicy] = useState([]);
    const [listPolicy, setListPolicy] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPolicy, setSelectedPolicy] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newPolicy, setNewPolicy] = useState({ description: '', effectiveDate: '', status: 'active' });

    const [searchQuery1, setSearchQuery1] = useState(''); // when click icon => search, if not click => not search

    const [searchQuery, setSearchQuery] = useState('');
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const policyPerPageOptions = [10, 15, 20, 25, 30, 35, 40, 45, 50];
    const [ascending, setAscending] = useState(true);
    const [errors, setErrors] = useState({});


    useEffect(() => {


        getPolicy();


    }, [pageSize, currentPage, searchQuery, ascending]);

    const getPolicy = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No token found");
            }
            const res = await axios.get(`https://jssatsproject.azurewebsites.net/api/ReturnBuyBackPolicy/getall?pageIndex=${currentPage}&pageSize=${pageSize}&ascending=${ascending}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('... check policy', res);
            if (res && res.data && res.data.data) {
                const policys = res.data.data;
                setOriginalListPolicy(policys);
                setListPolicy(policys);

            }
        } catch (error) {
            console.error('Error fetching policys:', error);
            if (error.response) {
                console.error('Error response:', error.response.data);
            } else if (error.request) {
                console.error('Error request:', error.request);
            } else {
                console.error('Error message:', error.message);
            }
        }
    };

    const handleEditClick = (policy) => {
        setSelectedPolicy(policy);
        setIsModalOpen(true);
    };

    const handleSaveChanges = async () => {
        try {
            const res = await axios.put(
                `https://jssatsproject.azurewebsites.net/api/ReturnBuyBackPolicy/UpdateReturnBuyBackPolicy?id=${selectedPolicy.id}`,
                selectedPolicy
            );
            console.log('>>> check ', selectedPolicy)
            if (res.status === 200) {
                const updatedPolicy = originalListPolicy.map((policy) =>
                    policy.id === selectedPolicy.id ? selectedPolicy : policy
                );
                setOriginalListPolicy(updatedPolicy);
                setListPolicy(updatedPolicy);
                setIsModalOpen(false);
                setSelectedPolicy(null);
                toast.success("Policy updated successfully");
            }
        } catch (error) {
            console.error('Failed to update policy:', error);
            toast.error("Failed to update policy");
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };


    const handleDetailClick = (policy) => {
        setSelectedPolicy(policy);
    };
    const validateForm = () => {
        let tempErrors = {};
        let today = new Date();
        if (!newPolicy.description) tempErrors.description = 'Description is required';
        if (!newPolicy.effectiveDate) tempErrors.effectiveDate = 'effectiveDate is required';
        else if (newPolicy.effectiveDate < today) {
            tempErrors.effectiveDate = 'Effective Date must be greater than or equal to Today';
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };
    const handleCreatePolicy = async () => {
        // Validate input

        if (!newPolicy.description || !newPolicy.effectiveDate || !newPolicy.status) {
            toast.error("All fields are required");
            return;
        }
        const newPolicyAdd = newPolicy;
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No token found");
            }
            const res = await axios.post('https://jssatsproject.azurewebsites.net/api/returnBuyBackPolicy/CreateReturnBuyBackPolicy', newPolicyAdd, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (res && res.data) {
                getPolicy();
                setOriginalListPolicy([...listPolicy, res.data]);
                setListPolicy([...listPolicy, res.data]);
                setIsCreateModalOpen(false);
                setIsYesNoOpen(false)
                setNewPolicy({ description: '', effectiveDate: '', status: 'active' });
                toast.success("Policy created successfully");

            }
        } catch (error) {
            console.error('Failed to create policy:', error);
            toast.error("Failed to create policy");
        }
    };

    const setCancel = () => {
        setSelectedPolicy(null);
        setIsModalOpen(false)
    }

    const getNamefromDescription = (value) => {
        if (!value) return '';  // Check if value is undefined or null
        const newlinePosition = value.indexOf('\n');
        return newlinePosition !== -1 ? value.substring(0, newlinePosition) : value;
    }

    const getDescription = (value) => {
        if (!value) return '';  // Check if value is undefined or null
        const newlinePosition = value.indexOf('\n');
        return newlinePosition !== -1 ? value.substring(newlinePosition + 1) : '';
    }
    const handleSort = () => {
        setAscending(!ascending); // Toggle ascending state
        setCurrentPage(1); // Reset to first page when sorting changes
    };

    const formatEffectiveDate = (date) => {
        if (!date) return '';  // Check if date is undefined or null
        try {
            return format(new Date(date), 'dd/MM/yyyy');
        } catch (error) {
            console.error('Invalid date format:', date);
            return 'Invalid Date';
        }
    }
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleSearch = () => {
        let filteredPolicys = originalListPolicy;

        if (searchQuery) {
            filteredPolicys = filteredPolicys.filter((policy) =>
                policy.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setListPolicy(filteredPolicys);
        setSearchQuery('')
    };
    const handleYesNo = () => {
        if (!validateForm()) return;
        setIsYesNoOpen(true);
    };
    const placeholders = Array.from({ length: pageSize - listPolicy.length });

    return (
        <div className="flex items-center justify-center min-h-screen bg-white mx-5 pt-5 mb-5 rounded">
            <div>
                <h1 className="text-3xl font-bold text-center text-blue-800 mb-4">Return Buy Back Policy List</h1>
                <div className="flex  items-center">
                    <div className="ml-2">
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                            onClick={() => setIsCreateModalOpen(true)}
                        >
                            Add new buy back policy
                        </button>
                    </div>
                    {/* <div className="flex items-center space-x-4"> */}
                    <div className="flex items-center mx-4">
                        <label className="block mr-2">Page Size:</label>
                        <select
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(parseInt(e.target.value));
                                setCurrentPage(1); // Reset to first page when page size changes
                            }}
                            className="px-3 py-2 border border-gray-300 rounded-md"
                        >
                            {policyPerPageOptions.map((size) => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                        </select>
                    </div>
                    {/* <div className="relative w-[400px]">
                            <input
                                type="text"
                                placeholder="Search by name or description"
                                value={searchQuery1}
                                // onChange={handleSearchChange}
                                className="px-3 py-2 border border-gray-300 rounded-md w-full"
                            />
                            <IoIosSearch
                                className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-500"
                            // onClick={handleSetQuery}
                            />
                        </div> */}
                    {/* </div> */}
                </div>
                <div className="w-[1200px] overflow-hidden ">
                    <table className="font-inter w-full table-auto text-left">
                        <thead className="w-full rounded-lg bg-blue-900 text-base font-semibold text-white  sticky top-0">
                            <tr className="whitespace-nowrap text-xl  font-bold">
                                <th className="rounded-l-lg"></th>
                                <th >Name</th>
                                <th className="cursor-pointer " onClick={handleSort}>
                                    <span>Effective Date</span>
                                    <span className=' text-sm mx-2'>{ascending ? '▲' : '▼'}</span>
                                </th>
                                <th className=" text-center py-3">Status</th>
                                <th className=" rounded-r-lg ">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listPolicy.map((item, index) => (
                                <tr key={index} className="cursor-pointer font-normal text-black bg-white shadow-md rounded font-bold text-base hover:shadow-2xl">
                                    <td className="rounded-l-lg pr-3 pl-5 py-4 text-black ">{index + (currentPage - 1) * pageSize + 1}</td>
                                    <td >{getNamefromDescription(item.description)}</td>
                                    <td >{formatEffectiveDate(item.effectiveDate)}</td>
                                    <td className="text-center">
                                        {item.status === 'active' ? (
                                            <span className="text-green-500 bg-green-100 font-bold p-1 px-2 rounded-xl">ACTIVE</span>
                                        ) : (
                                            <span className="text-red-500 bg-red-100 font-bold p-1 px-2 rounded-xl">INACTIVE</span>
                                        )
                                        }
                                    </td>
                                    <td className="text-3xl text-[#000099] pl-2"><CiViewList onClick={() => handleDetailClick(item)} /></td>

                                </tr>
                            ))}
                            {placeholders.map((_, index) => (
                                <tr key={`placeholder-${index}`} className="cursor-pointer bg-[#f6f8fa] drop-shadow-[0_0_10px_rgba(34,46,58,0.02)]">
                                    <td className="rounded-l-lg pl-3 text-sm font-normal text-[#637381] py-4">-</td>
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
            {selectedPolicy && !isModalOpen && (
                <div className="fixed inset-0 z-30 flex items-center justify-center z-10 bg-gray-800 bg-opacity-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full">
                        <h2 className="text-2xl font-bold text-blue-600 text-center mb-4">{getNamefromDescription(selectedPolicy.description)}</h2>

                        <p className="text-sm text-gray-700 mb-2 text-xl"><strong>ID:</strong> {selectedPolicy.id}</p>
                        <p className="text-sm text-gray-700 mb-2 text-xl"><strong>Description: </strong>{getDescription(selectedPolicy.description)}</p>

                        <p className="text-sm text-gray-700 mb-2 text-xl"><strong>Effective Date:</strong> {formatEffectiveDate(selectedPolicy.effectiveDate)}</p>
                        <p className="text-sm text-gray-700 mb-2 text-xl"><strong>Status:</strong>
                            {selectedPolicy.status === 'active' ? (
                                <span className="text-green-500 bg-green-100 font-bold p-1 px-2 rounded-xl">ACTIVE</span>
                            ) : (
                                <span className="text-red-500 bg-red-100 font-bold p-1 px-2 rounded-xl">INACTIVE</span>
                            )
                            }</p>
                        <div className='flex'>
                            <button
                                className="mr-2 px-4 py-2 bg-blue-500 text-white rounded-md" onClick={() => handleEditClick(selectedPolicy)}
                            >
                                Edit
                            </button>
                            <button
                                className="mr-2 ml-0 px-4 py-2 bg-gray-500 text-white rounded-md" onClick={() => setSelectedPolicy(null)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isModalOpen && selectedPolicy && (
                <div className="fixed inset-0 z-30 flex items-center justify-center z-10 bg-gray-800 bg-opacity-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full">
                        <p className="text-sm text-gray-700 mb-2">ID: {selectedPolicy.id}</p>
                        <div className="mb-4">
                            <label className="block text-gray-700">Description</label>
                            <textarea
                                type="text"
                                value={selectedPolicy.description}
                                onChange={(e) => setSelectedPolicy({ ...selectedPolicy, description: e.target.value })}
                                className="border border-gray-300 rounded-md py-2 px-4 w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Effective Date</label>
                            <input
                                type="date"
                                value={selectedPolicy.effectiveDate ? format(new Date(selectedPolicy.effectiveDate), 'yyyy-MM-dd') : ''}
                                onChange={(e) => setSelectedPolicy({ ...selectedPolicy, effectiveDate: e.target.value })}
                                className="border border-gray-300 rounded-md py-2 px-4 w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Status</label>
                            <select
                                value={selectedPolicy.status}
                                onChange={(e) => setSelectedPolicy({ ...selectedPolicy, status: e.target.value })}
                                className="border border-gray-300 rounded-md py-2 px-4 w-full"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                        <div className="flex justify-between">
                            <button
                                className="mr-2 px-4 py-2 bg-blue-500 text-white rounded-md"
                                onClick={handleSaveChanges}
                            >
                                Save
                            </button>
                            <button
                                className="mr-2 ml-0 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
                                onClick={() => setCancel()}
                            >
                                <MdOutlineCancel />
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-30 flex items-center justify-center z-10 bg-gray-800 bg-opacity-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">Create New Policy</h2>
                        <div className="mb-4">
                            <label className="block text-gray-700">Description</label>
                            <textarea
                                type="text"
                                value={newPolicy.description}
                                onChange={(e) => setNewPolicy({ ...newPolicy, description: e.target.value })}
                                className="border border-gray-300 rounded-md py-2 px-4 w-full"
                            />
                            {errors.description && <span className="text-red-500 text-sm">{errors.description}</span>}

                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Effective Date</label>
                            <input
                                type="date"
                                value={newPolicy.effectiveDate}
                                onChange={(e) => setNewPolicy({ ...newPolicy, effectiveDate: e.target.value })}
                                className="border border-gray-300 rounded-md py-2 px-4 w-full"
                            />
                            {errors.effectiveDate && <span className="text-red-500 text-sm">{errors.effectiveDate}</span>}

                        </div>

                        <div className="flex justify-between">
                            <button
                                className="mr-2 px-4 py-2 bg-blue-500 text-white rounded-md"
                                onClick={handleYesNo}
                            >
                                Create
                            </button>
                            <button
                                className="mr-2 ml-0 px-4 py-2 bg-gray-500 text-white rounded-md"
                                onClick={() => setIsCreateModalOpen(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isYesNoOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full">
                        <h2 className="text-2xl font-bold text-black mb-4">Confilm to update</h2>
                        <p>Are you sure to update this product's stall</p>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                className="mr-2 px-4 py-2 bg-blue-500 text-white rounded-md"
                                onClick={handleCreatePolicy}
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

export default ReturnPolicy;
