
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { IoIosSearch } from "react-icons/io";
import axios from "axios";
import { CiViewList } from "react-icons/ci";
const Stall = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11
    const currentYear = currentDate.getFullYear();
    const [listStall, setListStall] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    // list revenue of all stall
    const [revenueData, setRevenueData] = useState([]);
    useEffect(() => {
        getStall();
    }, []);

    useEffect(() => {
        if (selectedMonth && selectedYear) {
            const start = new Date(selectedYear, selectedMonth - 1, 1);
            const end = new Date(selectedYear, selectedMonth, 0);
            setStartDate(start.toISOString().split('T')[0]);
            setEndDate(end.toISOString().split('T')[0]);
        }
    }, [selectedMonth, selectedYear]);

    useEffect(() => {
        if (startDate && endDate) {
            fetchRevenueData();
        }
    }, [startDate, endDate]);

    const fetchRevenueData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No token found");
            }
            const res = await axios.get(`https://jssatsproject.azurewebsites.net/api/stall/getTotalRevenue?startDate=${startDate}&endDate=${endDate}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (res && res.data && res.data.data) {

                setRevenueData(res.data.data);
                console.log('... check revenue data stall', revenueData);
            }
        } catch (error) {
            console.error('Error fetching revenue data:', error);
            if (error.response) {
                console.error('Error response:', error.response.data);
            } else if (error.request) {
                console.error('Error request:', error.request);
            } else {
                console.error('Error message:', error.message);
            }
        }
    };

    const getStall = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No token found");
            }
            const res = await axios.get(`https://jssatsproject.azurewebsites.net/api/stall/getall`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('... check stall', res);
            if (res && res.data && res.data.data) {
                const stalls = res.data.data;
                setListStall(stalls);
            }
        } catch (error) {
            console.error('Error fetching stalls:', error);
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

    return (
        <div className="flex items-center justify-center min-h-screen bg-white mx-5 pt-5 mb-5 rounded">
            <div>
                <h1 className="text-3xl font-bold text-center text-blue-800 mb-4">Stall revenue list</h1>
                <div className="flex space-x-4 mb-4">
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md"
                    >
                        {months.map((month) => (
                            <option key={month.value} value={month.value}>
                                {month.label}
                            </option>
                        ))}
                    </select>
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md"
                    >
                        {years.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="w-[1200px] overflow-hidden ">
                    <table className="font-inter w-full table-auto text-left">
                        <thead className="w-full rounded-lg bg-blue-900 text-base font-semibold text-white  sticky top-0">
                            <tr className="whitespace-nowrap text-xl  font-bold">
                                <th className="rounded-l-lg"></th>
                                <th className="py-3 ">Name</th>
                                <th >Type</th>
                                <th >Status</th>
                                <th className=" rounded-r-lg  ">Revenue</th>
                                {/* <th className=" rounded-r-lg  ">Action</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {listStall.map((item, index) => (
                                <tr key={index} className="cursor-pointer font-normal text-black bg-white shadow-md rounded font-bold text-base hover:shadow-2xl">
                                    <td className="rounded-l-lg pr-3 pl-5 py-4 text-black ">{index + 1}</td>
                                    <td > {item.name}</td>
                                    <td >{item.description}</td>
                                    <td>
                                        {item.status === 'active' ? (
                                            <span className="text-green-500 bg-green-100 font-bold p-1 px-2 rounded-xl">ACTIVE</span>
                                        ) : item.status === 'inactive' ? (
                                            <span className="text-red-500 bg-red-100 font-bold p-1 px-2 rounded-xl">INACTIVE</span>
                                        ) : 'null'
                                        }
                                    </td>
                                    <td className='rounded-r-lg'>
                                        {formatCurrency(revenueData.find(re => re.StallName === item.name)?.TotalRevenue || 0)}
                                    </td>
                                    {/* <td className="text-3xl text-[#000099] pl-2 rounded-r-lg">
                                        <CiViewList onClick={() => handleDetailClick(item.id)} />
                                    </td> */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Stall;
