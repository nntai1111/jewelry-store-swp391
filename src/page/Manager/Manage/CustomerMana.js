
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import clsx from 'clsx';
import { toast } from 'react-toastify';
import { IoIosSearch } from 'react-icons/io';
import { FiEdit3 } from "react-icons/fi";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // loading
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { CiViewList } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
const CustomerMana = () => {
    const scrollRef = useRef(null);
    const [isYesNoOpen, setIsYesNoOpen] = useState(false);
    const [originalListCustomer, setOriginalListCustomer] = useState([]);
    const [listCustomer, setListCustomer] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery1, setSearchQuery1] = useState(''); // when click icon => search, if not click => not search
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pageSize, setPageSize] = useState(10); // State for page size
    const [loadingApi, setLoadingApi] = useState(false); // set loading api
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const customersPerPageOptions = [10, 15, 20, 25, 30, 35, 40, 45, 50]; // Options for page size

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [currentPage]);

    useEffect(() => {
        if (searchQuery) {

            handleSearch();

        } else {

            getCustomer(currentPage);

        }
    }, [currentPage, pageSize, searchQuery]); // Include searchQuery in dependencies to refetch data on search change

    const handleDetailClick = async (customerPhone) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No token found");
            }

            // Example of passing data through URL query parameters
            navigate(`/manager/detailCustomer?phone=${customerPhone}`);
        } catch (error) {
            console.error('Error handling detail click:', error);
        }
    };


    const getCustomer = async (pageIndex) => {
        setLoadingApi(true);
        try {
            const res = await axios.get(`https://jssatsproject.azurewebsites.net/api/customer/getall?pageIndex=${pageIndex}&pageSize=${pageSize}`);
            if (res && res.data && res.data.data) {
                const customers = res.data.data;
                if (customers.length > 0) {
                    setOriginalListCustomer(customers);
                    setListCustomer(customers);
                    const total = Math.ceil(res.data.totalElements / pageSize);
                    setTotalPages(total);
                } else {
                    setTotalPages(pageIndex - 1); // Set total pages based on the last successful page
                }
            } else {
                setTotalPages(pageIndex - 1); // Set total pages based on the last successful page
            }
        } catch (error) {
            console.error('Failed to fetch customers:', error);
        }
        setLoadingApi(false);
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
        setLoadingApi(true);
        try {
            const res = await axios.get(`https://jssatsproject.azurewebsites.net/api/customer/search?searchTerm=${searchQuery}&pageIndex=${currentPage}&pageSize=${pageSize}`);
            if (res && res.data && res.data.data) {
                const customers = res.data.data;
                // console.log('>>> check ressss', res)
                setListCustomer(customers);
                const total = Math.ceil(res.data.totalElements / pageSize);
                setTotalPages(total);
            } else {
                setListCustomer([]);
                setTotalPages(0);
            }
        } catch (error) {
            console.error('Failed to search customers:', error);
            toast.error('Failed to search customers');
        }
        setLoadingApi(false);
    };

    const handleEditClick = (customer) => {
        setSelectedCustomer(customer);
        setIsModalOpen(true);
        setErrors({});
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedCustomer({ ...selectedCustomer, [name]: value });
    };

    const handleSaveChanges = async () => {
        setLoadingApi(true);
        try {
            const res = await axios.put(
                `https://jssatsproject.azurewebsites.net/api/Customer/UpdateCustomer?id=${selectedCustomer.id}`,
                selectedCustomer
            );
            if (res.status === 200) {
                const updatedCustomers = originalListCustomer.map((customer) =>
                    customer.id === selectedCustomer.id ? selectedCustomer : customer
                );
                setOriginalListCustomer(updatedCustomers);
                setListCustomer(updatedCustomers);
                setIsModalOpen(false);
                setIsYesNoOpen(false);
                toast.success('Update customer success');
            }
        } catch (error) {
            console.error('Failed to update customer:', error);
            toast.error('Failed to update customer');
        }
        setLoadingApi(false);
    };
    const validatePhoneNumber = (phone) => {
        const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})\b/;
        return phoneRegex.test(phone);
    };
    const validateForm = () => {
        let tempErrors = {};

        if (!selectedCustomer.firstname) tempErrors.firstname = 'First name is required';
        if (!selectedCustomer.lastname) tempErrors.lastname = 'Last name is required';
        if (!selectedCustomer.phone) tempErrors.phone = 'Phone is required';
        else if (!validatePhoneNumber(selectedCustomer.phone)) tempErrors.phone = 'Invalid phone number';
        if (!selectedCustomer.email) tempErrors.email = 'Email is required';
        if (!selectedCustomer.gender) tempErrors.gender = 'Gender is required';
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };
    const renderModal = () => {
        if (!isModalOpen || !selectedCustomer) return null;
        return (
            <div className="fixed inset-0 z-30 flex items-center justify-center bg-gray-600 bg-opacity-50">
                <div className="bg-white w-[600px] p-6 rounded-lg">
                    <h2 className="text-2xl font-bold text-blue-600 text-center mb-2">Edit Customer</h2>
                    <form>
                        <div className="mb-4">
                            <label className="block mb-1">First Name</label>
                            <input
                                type="text"
                                name="firstname"
                                value={selectedCustomer.firstname}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                            {errors.firstname && <span className="text-red-500 text-sm">{errors.firstname}</span>}
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1">Last Name</label>
                            <input
                                type="text"
                                name="lastname"
                                value={selectedCustomer.lastname}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                            {errors.lastname && <span className="text-red-500 text-sm">{errors.lastname}</span>}

                        </div>
                        <div className="mb-4">
                            <label className="block mb-1">Phone</label>
                            <input
                                type="text"
                                name="phone"
                                value={selectedCustomer.phone}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                            {errors.phone && <span className="text-red-500 text-sm">{errors.phone}</span>}

                        </div>
                        <div className="mb-4">
                            <label className="block mb-1">Email</label>
                            <input
                                type="text"
                                name="email"
                                value={selectedCustomer.email}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                            {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}

                        </div>
                        <div className="mb-4">
                            <label className="block mb-1">Gender</label>
                            <select
                                name="gender"
                                value={selectedCustomer.gender}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={handleYesNo}
                                className="mr-2 px-4 py-2 bg-blue-500 text-white rounded-md"
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="mr-2 ml-0 px-4 py-2 bg-red-500 text-white rounded-md"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };
    const handleYesNo = () => {
        if (!validateForm()) return;
        setIsYesNoOpen(true);
    };
    const formatPoint = (value) => {
        return new Intl.NumberFormat('de-DE', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
            useGrouping: true,
        }).format(value);
    };
    const placeholders = Array.from({ length: pageSize - listCustomer.length });
    return (
        <div className="flex items-center justify-center min-h-screen bg-white mx-5 pt-5 mb-5 rounded">
            <div>
                <h1 ref={scrollRef} className="text-3xl font-bold text-center text-blue-800 mb-4">Customer management list</h1>
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
                            {customersPerPageOptions.map((size) => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                        </select>
                    </div>
                    <div className="relative w-[400px]">
                        <input
                            type="text"
                            placeholder="Search by phone number"
                            value={searchQuery1}
                            onChange={handleSearchChange}
                            className="px-3 py-2 border border-gray-300 rounded-md w-full"
                        />
                        {/* <IoIosSearch className="absolute top-0 right-0 mr-3 mt-3 cursor-pointer text-gray-500" onClick={handleSearch} /> */}
                        <IoIosSearch className="absolute top-0 right-0 mr-3 mt-3 cursor-pointer text-gray-500" onClick={handleSetQuery} />

                    </div>

                </div>

                <div className="w-[1200px] overflow-hidden ">
                    <table className="font-inter w-full table-auto text-left">
                        <thead className="w-full rounded-lg bg-blue-900 text-base font-semibold text-white  sticky top-0">
                            <tr className="whitespace-nowrap text-xl  font-bold">
                                <th className="rounded-l-lg"></th>
                                <th className='py-3'>Name</th>
                                <th>Phone Number</th>
                                <th>Email</th>
                                <th>Gender</th>
                                <th>Total Point</th>
                                <th className="rounded-r-lg">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listCustomer.map((item, index) => (
                                <tr key={index} className="cursor-pointer font-normal text-black bg-white shadow-md rounded font-bold text-base hover:shadow-2xl">
                                    <td className="rounded-l-lg pr-3 pl-5 py-4 text-black ">{index + (currentPage - 1) * pageSize + 1}</td>
                                    <td>{item.firstname} {item.lastname}</td>
                                    <td>{item.phone}</td>
                                    <td>{item.email}</td>
                                    <td>{item.gender === 'Male'
                                        ? <span className='text-blue-500 font-bold'>Male</span>
                                        : <span className='text-pink-500 font-bold'>Female</span>
                                    }</td>
                                    <td>{formatPoint(item.point.totalpoint)}</td>
                                    {/* <td className="text-2xl text-green-500 pl-4"><FiEdit3 onClick={() => handleEditClick(item)} /></td> */}
                                    <td className="flex space-x-2 mt-3">
                                        <CiViewList className="text-3xl text-[#000099]" onClick={() => handleDetailClick(item.phone)} />
                                        <FiEdit3 className="text-3xl text-green-500" onClick={() => handleEditClick(item)} />
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

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* <div>
                    {loadingApi && (
                        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 backdrop-blur-sm z-50">
                            <FontAwesomeIcon
                                icon={faSpinner}
                                className="fa-spin fa-2x text-white"
                            />
                        </div>
                    )}
                </div> */}
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
            {renderModal()}
            {isYesNoOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full">
                        <h2 className="text-2xl font-bold text-black mb-4">Confilm to update</h2>
                        <p>Are you sure to update this staff</p>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                className="mr-2 px-4 py-2 bg-blue-500 text-white rounded-md"
                                onClick={handleSaveChanges}
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

export default CustomerMana;
