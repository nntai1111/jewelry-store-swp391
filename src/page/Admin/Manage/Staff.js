import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { IoIosSearch } from "react-icons/io";
import axios from "axios";
import Modal from 'react-modal';
import { CiViewList } from "react-icons/ci";
import { FiEdit3 } from "react-icons/fi";
import { toast } from 'react-toastify';
// Set the app element for accessibility
Modal.setAppElement('#root');

const Staff = () => {
    const [listaccount, setListaccount] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery1, setSearchQuery1] = useState('');
    const [pageSize, setPageSize] = useState(10);
    const accountPerPageOptions = [10, 15, 20, 25, 30, 35, 40, 45, 50];
    const [selectedRole, setSelectedRole] = useState(4);
    const [errors, setErrors] = useState({});
    const [isYesNoOpen, setIsYesNoOpen] = useState(false);

    useEffect(() => {
        if (searchQuery) {
            handleSearch();
        } else {
            getaccount(currentPage, selectedRole);
        }
    }, [currentPage, pageSize, searchQuery, selectedRole]);

    const getaccount = async (pageIndex, roleId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No token found");
            }
            const res = await axios.get(
                `https://jssatsproject.azurewebsites.net/api/account/getAll?pageIndex=${pageIndex}&pageSize=${pageSize}&roleId=${roleId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (res && res.data && res.data.data) {
                const allAccount = res.data.data;
                setListaccount(allAccount);
                setTotalPages(res.data.totalPages);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            if (error.response) {
                console.error('Error response:', error.response.data);
            } else if (error.request) {
                console.error('Error request:', error.request);
            } else {
                console.error('Error message:', error.message);
            }
        }
    };

    const handleRole = (e) => {
        setSelectedRole(Number(e.target.value));
        setSearchQuery('');
        setSearchQuery1('');
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSearchChange = (e) => {
        setSearchQuery1(e.target.value);
    };

    const handleSetQuery = async () => {
        setSearchQuery(searchQuery1);
        setCurrentPage(1);
    };

    const handleSearch = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }
            const res = await axios.get(
                `https://jssatsproject.azurewebsites.net/api/account/search?pageIndex=${currentPage}&pageSize=${pageSize}&roleId=${selectedRole}&searchTerm=${searchQuery}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (res && res.data && res.data.data) {
                const searchedAccount = res.data.data;
                setListaccount(searchedAccount);
                setTotalPages(res.data.totalPages);
            } else {
                setListaccount([]);
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
    };

    const handleDetailClick = async (id) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }
            const res = await axios.get(`https://jssatsproject.azurewebsites.net/api/staff/getbyid?id=${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res && res.data && res.data.data) {
                setSelectedStaff(res.data.data);
            }

        } catch (error) {
            console.error('Error fetching staff details:', error);
        }
    };

    const handleEditClick = async (id) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }
            const res = await axios.get(`https://jssatsproject.azurewebsites.net/api/staff/getbyid?id=${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res && res.data && res.data.data) {
                setSelectedStaff(res.data.data);
            }

        } catch (error) {
            console.error('Error fetching staff details:', error);
        }
        setIsModalOpen(true);
    };


    const validatePhoneNumber = (phone) => {
        const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})\b/;
        return phoneRegex.test(phone);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedStaff((prevStaff) => ({
            ...prevStaff,
            [name]: value,
        }));
    };

    const validateForm = () => {
        let tempErrors = {};
        if (!selectedStaff.firstname) tempErrors.firstname = 'First name is required';
        if (!selectedStaff.lastname) tempErrors.lastname = 'Last name is required';
        if (!selectedStaff.phone) tempErrors.phone = 'Phone is required';
        else if (!validatePhoneNumber(selectedStaff.phone)) tempErrors.phone = 'Invalid phone number';
        if (!selectedStaff.email) tempErrors.email = 'Email is required';
        if (!selectedStaff.address) tempErrors.address = 'Address is required';
        if (!selectedStaff.gender) tempErrors.gender = 'Gender is required';
        if (!selectedStaff.status) tempErrors.status = 'Status is required';
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };
    const handleSaveChanges = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }
            const res = await axios.put(
                `https://jssatsproject.azurewebsites.net/api/staff/updateStaff?id=${selectedStaff.id}`,
                {
                    firstname: selectedStaff.firstname,
                    lastname: selectedStaff.lastname,
                    phone: selectedStaff.phone,
                    email: selectedStaff.email,
                    address: selectedStaff.address,
                    gender: selectedStaff.gender,
                    status: selectedStaff.status
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (res.status === 200) {
                getaccount(currentPage, selectedRole); // Refresh the account list
                setIsModalOpen(false); // Close the modal
                setIsYesNoOpen(false);// Close the modal yes no
                setSelectedStaff(null); // Clear selected staff
                toast.success('Update successful !')
            }
        } catch (error) {
            console.error('Failed to update staff:', error);
        }
    };

    const handleYesNo = () => {
        if (!validateForm()) return;
        setIsYesNoOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setSelectedStaff(null);
        setErrors({});
    };
    const placeholders = Array.from({ length: pageSize - listaccount.length });

    return (
        <div className="flex items-center justify-center min-h-screen bg-white mx-5 pt-5 mb-5 rounded">
            <div>
                <h1 className="text-3xl font-bold text-center text-blue-800 mb-4">Staff management list</h1>
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
                            {accountPerPageOptions.map((size) => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                        </select>
                    </div>
                    <div className="relative flex">
                        <div>
                            <select
                                value={selectedRole}
                                onChange={handleRole}
                                className="px-3 py-2 border border-gray-300 rounded-md mx-4"
                            >
                                <option value={4}>Manage</option>
                                <option value={1}>Seller</option>
                                <option value={3}>Cashier</option>
                                <option value={2}>Admin</option>

                            </select>
                        </div>
                        <div className="w-[400px]">
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
                </div>
                <div className="w-[1200px] overflow-hidden ">
                    <table className="font-inter w-full table-auto text-left">
                        <thead className="w-full rounded-lg bg-blue-900 text-base font-semibold text-white  sticky top-0">
                            <tr className="whitespace-nowrap text-xl  font-bold">
                                <th className="rounded-l-lg"></th>
                                <th className='py-3'>Name</th>
                                <th>Username</th>
                                <th>Password</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th className="rounded-r-lg">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listaccount.map((item, index) => (
                                <tr key={index} className="cursor-pointer font-normal text-black bg-white shadow-md rounded font-bold text-base hover:shadow-2xl">
                                    <td className="rounded-l-lg pr-3 pl-5 py-4 text-black ">{index + (currentPage - 1) * pageSize + 1}</td>
                                    <td>{item.staffName}</td>
                                    <td>{item.username}</td>
                                    <td>{item.password}</td>
                                    <td>
                                        {item.roleId === 2
                                            ? 'Admin'
                                            : item.roleId === 1
                                                ? 'Seller'
                                                : item.roleId === 4
                                                    ? 'Manager'
                                                    : item.roleId === 3
                                                        ? 'Cashier'
                                                        : item.roleId}
                                    </td>
                                    <td>
                                        {item.status === 'active' ? (
                                            <span className="text-green-500 bg-green-100 font-bold p-1 px-2 rounded-xl">ACTIVE</span>
                                        ) : (
                                            <span className="text-red-500 bg-red-100 font-bold p-1 px-2 rounded-xl">INACTIVE</span>
                                        )
                                        }
                                    </td>
                                    <td className="flex space-x-2 mt-3">
                                        <CiViewList className="text-3xl text-[#000099]" onClick={() => handleDetailClick(item.id)} />
                                        <FiEdit3 className="text-3xl text-green-500" onClick={() => handleEditClick(item.id)} />
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
            {selectedStaff && !isModalOpen && (
                <div className="fixed inset-0 z-30 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full">
                        <h2 className="text-2xl font-bold text-blue-600 text-center mb-4">{selectedStaff.firstname} {selectedStaff.lastname}</h2>
                        <p className="text-sm text-gray-700 mb-2 text-xl"><strong>ID:</strong> {selectedStaff.id}</p>
                        <p className="text-sm text-gray-700 mb-2 text-xl"><strong>Phone:</strong> {selectedStaff.phone}</p>
                        <p className="text-sm text-gray-700 mb-2 text-xl"><strong>Email:</strong> {selectedStaff.email}</p>
                        <p className="text-sm text-gray-700 mb-2 text-xl"><strong>Address:</strong> {selectedStaff.address}</p>
                        <p className="text-sm text-gray-700 mb-2 text-xl"><strong>Gender:</strong> {selectedStaff.gender}</p>
                        <p className="text-sm text-gray-700 mb-2 text-xl"><strong>Status:</strong>
                            {selectedStaff.status === 'active' ? (
                                <span className="text-green-500 bg-green-100 font-bold p-1 px-2 mx-2 rounded-xl">ACTIVE</span>
                            ) : selectedStaff.status === 'inactive' ? (
                                <span className="text-red-500 bg-red-100 font-bold p-1 px-2 mx-2 rounded-xl">INACTIVE</span>
                            ) : 'null'
                            }
                        </p>


                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded-md mr-2"

                            onClick={() => setSelectedStaff(null)}
                        >
                            Close
                        </button>

                    </div>
                </div>
            )}
            {isModalOpen && selectedStaff && (
                <div className="fixed inset-0 z-30 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full">
                        <h2 className="text-2xl font-bold text-blue-600 text-center mb-2">Edit Staff</h2>
                        <form>
                            <div className="mb-4">
                                <label className="block text-gray-700">First Name:</label>
                                <input
                                    type="text"
                                    name="firstname"
                                    value={selectedStaff.firstname || ''}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    required
                                />
                                {errors.firstname && <span className="text-red-500 text-sm">{errors.firstname}</span>}
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Last Name:</label>
                                <input
                                    type="text"
                                    name="lastname"
                                    value={selectedStaff.lastname || ''}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    required
                                />
                                {errors.lastname && <span className="text-red-500 text-sm">{errors.lastname}</span>}
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Phone:</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={selectedStaff.phone || ''}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    required
                                />
                                {errors.phone && <span className="text-red-500 text-sm">{errors.phone}</span>}
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700">Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={selectedStaff.email || ''}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    required
                                />
                                {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Address:</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={selectedStaff.address || ''}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    required
                                />
                                {errors.address && <span className="text-red-500 text-sm">{errors.address}</span>}

                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Gender:</label>
                                <select
                                    name="gender"
                                    value={selectedStaff.gender || ''}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                            {/* <div className="mb-4">
                                <label className="block text-gray-700">Status:</label>
                                <select
                                    name="status"
                                    value={selectedStaff.status || ''}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div> */}
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="mr-2 px-4 py-2 bg-blue-500 text-white rounded-md"
                                    onClick={handleYesNo}
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    className="mr-2 ml-0 px-4 py-2 bg-red-500 text-white rounded-md"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}
            {isYesNoOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full">
                        <h2 className="text-2xl font-bold text-black mb-4">Confilm to update</h2>
                        <p>Are you sure to update this customer</p>

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

export default Staff;
