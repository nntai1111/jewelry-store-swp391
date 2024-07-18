
import React, { useEffect, useState, useRef } from 'react';
import clsx from 'clsx';
import { IoIosSearch } from "react-icons/io";
import axios from "axios";
import { BiExpandVertical } from "react-icons/bi";
import { CiViewList } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
const EmployeeMana = () => {
    const scrollRef = useRef(null);
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11
    const currentYear = currentDate.getFullYear();
    const navigate = useNavigate();
    const [listStaff, setListStaff] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10); // State for page size
    const [searchQuery, setSearchQuery] = useState('');
    const [searchQuery1, setSearchQuery1] = useState(''); // when click icon => search, if not click => not search
    const [totalPages, setTotalPages] = useState(1);
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [sortBy, setSortBy] = useState('totalRevenue');
    const [ascending, setAscending] = useState(false);
    const customersPerPageOptions = [10, 15, 20, 25, 30, 35, 40, 45, 50]; // Options for page size


    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [currentPage]);
    useEffect(() => {
        if (selectedMonth && selectedYear) {
            const start = new Date(selectedYear, selectedMonth - 1, 1);
            const end = new Date(selectedYear, selectedMonth, 0);

            // Add one day to start and end dates
            start.setDate(start.getDate() + 1);
            end.setDate(end.getDate() + 1);

            setStartDate(start.toISOString().split('T')[0]);
            setEndDate(end.toISOString().split('T')[0]);
        }
    }, [selectedMonth, selectedYear]);

    useEffect(() => {
        if (searchQuery) {
            searchStaff();
        } else {
            if (startDate && endDate) {
                getStaff(currentPage);
            }
        }
    }, [startDate, endDate, currentPage, pageSize, searchQuery, ascending]); // Include ascending in dependencies

    const getStaff = async (pageIndex) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No token found");
            }
            const res = await axios.get(`https://jssatsproject.azurewebsites.net/api/staff/getall?startDate=${startDate}&endDate=${endDate}&pageIndex=${pageIndex}&pageSize=${pageSize}&sortBy=${sortBy}&ascending=${ascending}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (res && res.data && res.data.data) {
                const staffs = res.data.data;
                setListStaff(staffs);
                const total = Math.ceil(res.data.totalElements / pageSize);
                setTotalPages(1);
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

    const searchStaff = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No token found");
            }
            const res = await axios.get(`https://jssatsproject.azurewebsites.net/api/staff/search?nameSearch=${searchQuery}&startDate=${startDate}&endDate=${endDate}&pageIndex=1&pageSize=${pageSize}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (res && res.data && res.data.data) {
                const staffs = res.data.data;
                setListStaff(staffs);
                const total = Math.ceil(res.data.totalElements / pageSize);
                setTotalPages(1);
                setCurrentPage(1); // Reset to first page when search results are returned
            }
        } catch (error) {
            console.error('Error searching staffs:', error);
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
        window.scrollTo(0, 0); // Di chuyển scroll lên đầu trang
    };



    const handleSearchChange = (e) => {
        setSearchQuery1(e.target.value);
    };

    const handleSearch = () => {
        setSearchQuery(searchQuery1);
        setCurrentPage(1);
    };

    const handleSortByRevenue = () => {
        setAscending(!ascending); // Toggle ascending state
        setSortBy('totalRevenue');
        setCurrentPage(1); // Reset to first page when sorting changes
    };
    const handleSortBySellOrder = () => {
        setAscending(!ascending); // Toggle ascending state
        setSortBy('totalsellorder');
        setCurrentPage(1); // Reset to first page when sorting changes
    };
    const handleSortByBuyOrder = () => {
        setAscending(!ascending); // Toggle ascending state
        setSortBy('totalbuyorder');
        setCurrentPage(1); // Reset to first page when sorting changes
    };
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0
        }).format(value);
    };

    const months = [
        { value: 1, label: 'January' },
        { value: 2, label: 'February' },
        { value: 3, label: 'March' },
        { value: 4, label: 'April' },
        { value: 5, label: 'May' },
        { value: 6, label: 'June' },
        { value: 7, label: 'July' },
        { value: 8, label: 'August' },
        { value: 9, label: 'September' },
        { value: 10, label: 'October' },
        { value: 11, label: 'November' },
        { value: 12, label: 'December' }
    ];

    const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);
    const placeholders = Array.from({ length: pageSize - listStaff.length });
    const handleDetailClick = async (id, startDate, endDate) => {
        const formattedStartDate = new Date(startDate);
        formattedStartDate.setHours(0, 0, 0, 0);
        formattedStartDate.setHours(formattedStartDate.getHours() + 7); // Add 7 hours
        let startDateString;
        if (!isNaN(formattedStartDate.getTime())) {
            startDateString = formattedStartDate.toISOString().slice(0, 19);;
            // console.log("endDateString (ISO 8601):", endDateString);
        }

        // Format endDate to 23:59
        const formattedEndDate = new Date(endDate);
        formattedEndDate.setHours(23, 59, 59, 999);
        formattedEndDate.setHours(formattedEndDate.getHours() + 7); // Add 7 hours
        let endDateString;
        if (!isNaN(formattedEndDate.getTime())) {
            endDateString = formattedEndDate.toISOString().slice(0, 19);;
            // console.log("endDateString (ISO 8601):", endDateString);
        }
        navigate(`/manager/detailStaff?Id=${id}&startDate=${startDateString}&endDate=${endDateString}`);

    };
    return (
        <div className="flex items-center justify-center min-h-screen bg-white mx-5 pt-5 mb-5 rounded">
            <div >
                <h1 ref={scrollRef} className="text-3xl font-bold text-center text-blue-800 mb-4">Staff Revenue Report</h1>
                <div className="flex justify-between items-center mb-4">
                    {/* First section with page size select */}
                    <div className="flex items-center">
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

                    {/* Second section with month/year selects and search input */}
                    <div className="flex space-x-4">
                        {/* Month select */}
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                            className="px-3 py-2 border border-gray-300 rounded-md"
                        >
                            {months.map((month) => (
                                <option key={month.value} value={month.value}>
                                    {month.label}
                                </option>
                            ))}
                        </select>

                        {/* Year select */}
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                            className="px-3 py-2 border border-gray-300 rounded-md"
                        >
                            {years.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>

                        {/* Search input */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search by Name"
                                value={searchQuery1}
                                onChange={handleSearchChange}
                                className="px-3 py-2 border border-gray-300 rounded-md w-[300px]"
                            />
                            <IoIosSearch className="absolute top-0 right-0 mr-3 mt-3 cursor-pointer text-gray-500" onClick={handleSearch} />
                        </div>
                    </div>
                </div>

                <div className="w-[1200px] overflow-hidden ">
                    <table className="font-inter w-full table-auto text-left">
                        <thead className="w-full rounded-lg bg-blue-900 text-base font-semibold text-white  sticky top-0">
                            <tr className="whitespace-nowrap text-xl  font-bold">
                                <th className="rounded-l-lg"></th>
                                <th className="py-3 pl-3 ">Name</th>
                                <th className="cursor-pointer text-center " onClick={handleSortByRevenue}>
                                    <span>Revenue</span>
                                    {sortBy === 'totalRevenue' && (
                                        <span>{ascending ? '▲' : '▼'}</span>
                                    )}
                                </th>
                                <th className="cursor-pointer text-center " onClick={handleSortBySellOrder}>
                                    <span>Sell Order</span>
                                    {sortBy === 'totalsellorder' && (
                                        <span>{ascending ? '▲' : '▼'}</span>
                                    )}
                                </th>
                                <th className="cursor-pointer text-center " onClick={handleSortByBuyOrder}>
                                    <span>Buy Order</span>
                                    {sortBy === 'totalbuyorder' && (
                                        <span>{ascending ? '▲' : '▼'}</span>
                                    )}
                                </th>
                                <th>Status</th>
                                <th className="rounded-r-lg">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listStaff.map((item, index) => (
                                <tr key={index} className="cursor-pointer font-normal text-black bg-white shadow-md rounded font-bold text-base hover:shadow-2xl">
                                    <td className="rounded-l-lg pr-3 pl-5 py-4 text-black ">{index + (currentPage - 1) * pageSize + 1}</td>
                                    <td>{item.firstname} {item.lastname}</td>
                                    <td className='text-center'>{formatCurrency(item.totalRevenue ? item.totalRevenue : 0)}</td>
                                    <td className='text-center'>{item.totalSellOrder || 0}</td>
                                    <td className='text-center'>{item.totalBuyOrder || 0}</td>
                                    <td>
                                        {item.status === 'active' ? (
                                            <span className="text-green-500 bg-green-100 font-bold p-1 px-2 rounded-xl">ACTIVE</span>
                                        ) : item.status === 'inactive' ? (
                                            <span className="text-red-500 bg-red-100 font-bold p-1 px-2 rounded-xl">INACTIVE</span>
                                        ) : 'null'
                                        }
                                    </td>
                                    <td className="flex space-x-2 mt-3">
                                        <CiViewList className="text-3xl text-[#000099]" onClick={() => handleDetailClick(item.id, startDate, endDate)} />
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
        </div>
    );
}

export default EmployeeMana;

