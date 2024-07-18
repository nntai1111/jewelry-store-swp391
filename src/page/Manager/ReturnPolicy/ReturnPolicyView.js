import React, { useEffect, useState, useRef } from 'react';
import { IoIosSearch } from "react-icons/io";
import { format } from 'date-fns'; // Import format function from date-fns
import axios from "axios";
import clsx from 'clsx';
import { CiViewList } from "react-icons/ci";

const ReturnPolicyView = () => {
    const scrollRef = useRef(null);
    const [originalListPolicy, setOriginalListPolicy] = useState([]);
    const [listPolicy, setListPolicy] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPolicy, setSelectedPolicy] = useState(null); // State to hold selected policy


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const policyPerPageOptions = [10, 15, 20, 25, 30, 35, 40, 45, 50];
    const [searchQuery1, setSearchQuery1] = useState(''); // when click icon => search, if not click => not search
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

            getPolicy();

        }
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
                setTotalPages(res.data.totalPages);
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

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

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

    const handleDetailClick = (policy) => {
        setSelectedPolicy(policy); // Set selected policy for detail view
    };
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

    const placeholders = Array.from({ length: pageSize - listPolicy.length });

    return (
        <div className="flex items-center justify-center min-h-screen bg-white mx-5 pt-5 mb-5 rounded">
            <div>
                <h1 ref={scrollRef} className="text-3xl font-bold text-center text-blue-800 mb-4">Return Buy Back Policy List</h1>
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
                            {policyPerPageOptions.map((size) => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                        </select>
                    </div>
                    {/* <div className="relative w-[400px]">
                        <input
                            type="text"
                            placeholder="Search "
                            value={searchQuery1}
                            onChange={handleSearchChange}
                            className="px-3 py-2 border border-gray-300 rounded-md w-full"
                        />
                        <IoIosSearch className="absolute top-0 right-0 mr-3 mt-3 cursor-pointer text-gray-500" onClick={handleSetQuery} />
                    </div> */}
                </div>
                <div className="w-[1200px] overflow-hidden ">
                    <table className="font-inter w-full table-auto text-left">
                        <thead className="w-full rounded-lg bg-blue-900 text-base font-semibold text-white  sticky top-0">
                            <tr className="whitespace-nowrap text-xl  font-bold">
                                <th className="rounded-l-lg"></th>
                                <th className='py-3' >Name</th>
                                <th className="cursor-pointer " onClick={handleSort}>
                                    <span>Effective Date</span>
                                    <span className=' text-sm mx-2'>{ascending ? '▲' : '▼'}</span>
                                </th>
                                <th className=" text-center">Status</th>
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

            {/* Modal for Policy Detail */}
            {selectedPolicy && (
                <div className="fixed inset-0 z-30 flex items-center justify-center z-10 bg-gray-800 bg-opacity-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full">
                        <h2 className="text-2xl font-bold text-blue-600 text-center mb-4">{getNamefromDescription(selectedPolicy.description)}</h2>

                        <p className="text-sm text-gray-700 mb-2 text-xl"><strong>ID:</strong> {selectedPolicy.id}</p>
                        <p className="text-sm text-gray-700 mb-2 text-xl"><strong>Description: </strong>{getDescription(selectedPolicy.description)}</p>

                        <p className="text-sm text-gray-700 mb-2 text-xl"><strong>Effective Date:</strong> {formatEffectiveDate(selectedPolicy.effectiveDate)}</p>
                        <p className="text-sm text-gray-700 mb-2 text-xl"><strong>Status:</strong>
                            {selectedPolicy.status === 'active' ? (
                                <span className="text-green-500 bg-green-100 font-bold p-1 px-2 mx-2 rounded-xl">ACTIVE</span>
                            ) : (
                                <span className="text-red-500 bg-red-100 font-bold p-1 px-2 mx-2 rounded-xl">INACTIVE</span>
                            )
                            }</p>

                        <button
                            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md" onClick={() => setSelectedPolicy(null)}
                        >
                            Close
                        </button>

                    </div>
                </div>
            )}
        </div>

    );
};

export default ReturnPolicyView;

