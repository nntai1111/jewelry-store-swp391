import React, { useEffect, useState } from 'react';
import { FaArrowTrendUp } from "react-icons/fa6";
import { FaArrowTrendDown } from "react-icons/fa6";
import axios from 'axios';
export default function P1() {
    const [todayRevenue, setTodayRevenue] = useState(null);
    const [yesterdayRevenue, setYesterdayRevenue] = useState(null);
    const [thisWeekRevenue, setThisWeekRevenue] = useState(null);
    const [lastWeekRevenue, setLastWeekRevenue] = useState(null);

    const [todayCustomer, setTodayCustomer] = useState(null);
    const [yesterdayCustomer, setYesterdayCustomer] = useState(null);
    const [thisWeekCustomer, setThisWeekCustomer] = useState(null);
    const [lastWeekCustomer, setLastWeekCustomer] = useState(null);

    const [todayOrder, setTodayOrder] = useState(null);
    const [yesterdayOrder, setYesterdayOrder] = useState(null);
    const [thisWeekOrder, setThisWeekOrder] = useState(null);
    const [lastWeekOrder, setLastWeekOrder] = useState(null);

    const [todayProduct, setTodayProduct] = useState(null);
    const [yesterdayProduct, setYesterdayProduct] = useState(null);
    const [thisWeekProduct, setThisWeekProduct] = useState(null);
    const [lastWeekProduct, setLastWeekProduct] = useState(null);

    const [view, setView] = useState('day'); // state to track which button was clicked
    const [error, setError] = useState(null);

    const getRevenue = async (start, end, setData) => {
        const formattedStartDate = new Date(start);
        formattedStartDate.setHours(0, 0, 0, 0);
        formattedStartDate.setHours(formattedStartDate.getHours() + 7); // Add 7 hours
        let startDateString;
        if (!isNaN(formattedStartDate.getTime())) {
            startDateString = formattedStartDate.toISOString().slice(0, 19);;
            // console.log("endDateString (ISO 8601):", endDateString);
        }

        // Format endDate to 23:59
        const formattedEndDate = new Date(end);
        formattedEndDate.setHours(23, 59, 59, 999);
        formattedEndDate.setHours(formattedEndDate.getHours() + 7); // Add 7 hours
        let endDateString;
        if (!isNaN(formattedEndDate.getTime())) {
            endDateString = formattedEndDate.toISOString().slice(0, 19);;
            // console.log("endDateString (ISO 8601):", endDateString);
        }
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            const response = await axios.get(
                `https://jssatsproject.azurewebsites.net/api/sellorder/SumTotalAmountOrderByDateTime?startDate=${startDateString}&endDate=${endDateString}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.status !== 200) {
                throw new Error('Network response was not ok');
            }

            const result = response.data;
            setData(result.data || 0);
        } catch (error) {
            setError(error.message);
        }

    };
    const getNewCustomer = async (start, end, setData) => {
        const formattedStartDate = new Date(start);
        formattedStartDate.setHours(0, 0, 0, 0);
        formattedStartDate.setHours(formattedStartDate.getHours() + 7); // Add 7 hours
        let startDateString;
        if (!isNaN(formattedStartDate.getTime())) {
            startDateString = formattedStartDate.toISOString().slice(0, 19);;
            // console.log("endDateString (ISO 8601):", endDateString);
        }

        // Format endDate to 23:59
        const formattedEndDate = new Date(end);
        formattedEndDate.setHours(23, 59, 59, 999);
        formattedEndDate.setHours(formattedEndDate.getHours() + 7); // Add 7 hours
        let endDateString;
        if (!isNaN(formattedEndDate.getTime())) {
            endDateString = formattedEndDate.toISOString().slice(0, 19);;
            // console.log("endDateString (ISO 8601):", endDateString);
        }
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            const response = await axios.get(
                `https://jssatsproject.azurewebsites.net/api/Customer/CountNewCustomer?startDate=${startDateString}&endDate=${endDateString}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.status !== 200) {
                throw new Error('Network response was not ok 3');
            }

            const result = response.data;
            setData(result.data || 0);
        } catch (error) {
            setError(error.message);
        }

    };
    const getQuantityOrder = async (start, end, setData) => {
        const formattedStartDate = new Date(start);
        formattedStartDate.setHours(0, 0, 0, 0);
        formattedStartDate.setHours(formattedStartDate.getHours() + 7); // Add 7 hours
        let startDateString;
        if (!isNaN(formattedStartDate.getTime())) {
            startDateString = formattedStartDate.toISOString().slice(0, 19);;
            // console.log("endDateString (ISO 8601):", endDateString);
        }

        // Format endDate to 23:59
        const formattedEndDate = new Date(end);
        formattedEndDate.setHours(23, 59, 59, 999);
        formattedEndDate.setHours(formattedEndDate.getHours() + 7); // Add 7 hours
        let endDateString;
        if (!isNaN(formattedEndDate.getTime())) {
            endDateString = formattedEndDate.toISOString().slice(0, 19);;
            // console.log("endDateString (ISO 8601):", endDateString);
        }
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            const response = await axios.get(
                `https://jssatsproject.azurewebsites.net/api/sellorder/CountOrderByDateTime?startDate=${startDateString}&endDate=${endDateString}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.status !== 200) {
                throw new Error('Network response was not ok 2');
            }

            const result = response.data;
            setData(result.data || 0);
        } catch (error) {
            setError(error.message);
        }

    };
    const getQuantityProduct = async (start, end, setData) => {
        const formattedStartDate = new Date(start);
        formattedStartDate.setHours(0, 0, 0, 0);
        formattedStartDate.setHours(formattedStartDate.getHours() + 7); // Add 7 hours
        let startDateString;
        if (!isNaN(formattedStartDate.getTime())) {
            startDateString = formattedStartDate.toISOString().slice(0, 19);;
            // console.log("endDateString (ISO 8601):", endDateString);
        }

        // Format endDate to 23:59
        const formattedEndDate = new Date(end);
        formattedEndDate.setHours(23, 59, 59, 999);
        formattedEndDate.setHours(formattedEndDate.getHours() + 7); // Add 7 hours
        let endDateString;
        if (!isNaN(formattedEndDate.getTime())) {
            endDateString = formattedEndDate.toISOString().slice(0, 19);;
            // console.log("endDateString (ISO 8601):", endDateString);
        }
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            const response = await axios.get(
                `https://jssatsproject.azurewebsites.net/api/SellOrderDetail/CountProductsSoldByCategory?startDate=${startDateString}&endDate=${endDateString}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.status !== 200) {
                throw new Error('Network response was not ok 1');
            }

            const result = response.data;
            setData(result);
        } catch (error) {
            setError(error.message);
        }

    };

    const handleDayClick = () => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        // Set start and end times for today
        const startToday = new Date(today);
        startToday.setHours(0, 0, 0, 0); // Set to 00:00:00 of today
        const endToday = new Date(today);
        endToday.setHours(23, 59, 59, 999); // Set to 23:59:59 of today

        // Set start and end times for yesterday
        const startYesterday = new Date(yesterday);
        startYesterday.setHours(0, 0, 0, 0); // Set to 00:00:00 of yesterday
        const endYesterday = new Date(yesterday);
        endYesterday.setHours(23, 59, 59, 999); // Set to 23:59:59 of yesterday

        const startTodayStr = startToday.toISOString(); // start of today
        const endTodayStr = endToday.toISOString(); // end of today
        const startYesterdayStr = startYesterday.toISOString(); // start of yesterday
        const endYesterdayStr = endYesterday.toISOString(); // end of yesterday

        // Fetch data for today and yesterday
        getRevenue(startTodayStr, endTodayStr, setTodayRevenue);
        getRevenue(startYesterdayStr, endYesterdayStr, setYesterdayRevenue);
        getNewCustomer(startTodayStr, endTodayStr, setTodayCustomer);
        getNewCustomer(startYesterdayStr, endYesterdayStr, setYesterdayCustomer);
        getQuantityOrder(startTodayStr, endTodayStr, setTodayOrder);
        getQuantityOrder(startYesterdayStr, endYesterdayStr, setYesterdayOrder);
        getQuantityProduct(startTodayStr, endTodayStr, setTodayProduct);
        getQuantityProduct(startYesterdayStr, endYesterdayStr, setYesterdayProduct);

        setView('day');
    };
    useEffect(() => {
        handleDayClick()
    }, []);
    const handleWeekClick = () => {
        const today = new Date();

        // Calculate start and end dates for this week (Monday to Sunday)
        const thisMonday = new Date(today);
        thisMonday.setDate(today.getDate() - today.getDay() + 1); // Monday this week
        thisMonday.setHours(0, 0, 0, 0); // Set to 00:00:00 of Monday

        const thisSunday = new Date(thisMonday);
        thisSunday.setDate(thisMonday.getDate() + 6); // Sunday this week
        thisSunday.setHours(23, 59, 59, 999); // Set to 23:59:59 of Sunday

        // Calculate start and end dates for last week (Monday to Sunday)
        const lastMonday = new Date(thisMonday);
        lastMonday.setDate(thisMonday.getDate() - 7); // Monday last week
        lastMonday.setHours(0, 0, 0, 0); // Set to 00:00:00 of last Monday

        const lastSunday = new Date(lastMonday);
        lastSunday.setDate(lastMonday.getDate() + 6); // Sunday last week
        lastSunday.setHours(23, 59, 59, 999); // Set to 23:59:59 of last Sunday

        // Format dates as ISO strings
        const thisMondayStr = thisMonday.toISOString();
        const thisSundayStr = thisSunday.toISOString();
        const lastMondayStr = lastMonday.toISOString();
        const lastSundayStr = lastSunday.toISOString();

        // Fetch data for this week and last week
        getRevenue(thisMondayStr, thisSundayStr, setThisWeekRevenue);
        getRevenue(lastMondayStr, lastSundayStr, setLastWeekRevenue);
        getNewCustomer(thisMondayStr, thisSundayStr, setThisWeekCustomer);
        getNewCustomer(lastMondayStr, lastSundayStr, setLastWeekCustomer);
        getQuantityOrder(thisMondayStr, thisSundayStr, setThisWeekOrder);
        getQuantityOrder(lastMondayStr, lastSundayStr, setLastWeekOrder);
        getQuantityProduct(thisMondayStr, thisSundayStr, setThisWeekProduct);
        getQuantityProduct(lastMondayStr, lastSundayStr, setLastWeekProduct);

        setView('week');
    };


    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0
        }).format(value);
    };
    // caculate %Change
    const calculatePercentageChange = (today, yesterday) => {
        if (today === null) return null;
        if (yesterday === null || yesterday === 0) return today.toFixed(2);
        const change = ((today - yesterday) / yesterday) * 100;
        return change.toFixed(2); // returns a string with 2 decimal places
    };


    return (
        <div className="container mx-auto px-4 border border-gray-300 shadow-lg  rounded-md">
            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={handleDayClick}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 mx-0"
                    style={{ width: '5rem' }} // Đặt chiều rộng cố định cho nút "Day"
                >
                    Day
                </button>
                <button
                    type="button"
                    onClick={handleWeekClick}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mx-0"
                    style={{ width: '5rem' }} // Đặt chiều rộng cố định cho nút "Week"
                >
                    Week
                </button>

            </div>

            {error && <p className="text-red-500">{error}</p>}
            {view === 'day' && (
                <div className="flex w-full space-x-2 p-4 text-white">
                    <div className={`flex-grow p-4 text-center rounded-xl ${calculatePercentageChange(todayRevenue, yesterdayRevenue) > 0 ? 'bg-green-500' : calculatePercentageChange(todayRevenue, yesterdayRevenue) < 0 ? 'bg-red-500' : 'bg-yellow-500'}`}>
                        <h1 className="font-bold text-xl p-1">Revenue</h1>
                        <p className="text-2xl">{formatCurrency(todayRevenue)}</p>
                        <div className="flex justify-between text-sm mt-2 space-x-4">
                            <div>
                                <h1 className="font-bold">Precious</h1>
                                <p>{formatCurrency(yesterdayRevenue)}</p>
                            </div>
                            <div>
                                <h1 className="font-bold">% Change</h1>
                                <p > {calculatePercentageChange(todayRevenue, yesterdayRevenue) > 0 ? '+' : ''}
                                    {calculatePercentageChange(todayRevenue, yesterdayRevenue) !== null
                                        ? `${calculatePercentageChange(todayRevenue, yesterdayRevenue)} %` : 'N/A'}</p>
                            </div>
                            <div className='flex flex-col items-center'>
                                <h1 className="font-bold  ">Trend</h1>
                                <p className='p-0.5 text-xl' >{calculatePercentageChange(todayRevenue, yesterdayRevenue) > 0 ? <FaArrowTrendUp /> : calculatePercentageChange(todayRevenue, yesterdayRevenue) < 0 ? <FaArrowTrendDown /> : ''}</p>
                            </div>
                        </div>
                    </div>
                    <div className={`flex-grow p-4 text-center rounded-xl ${calculatePercentageChange(todayCustomer, yesterdayCustomer) > 0 ? 'bg-green-500' : calculatePercentageChange(todayCustomer, yesterdayCustomer) < 0 ? 'bg-red-500' : 'bg-yellow-500'}`}>
                        <h1 className="font-bold text-xl p-1">New Customer</h1>
                        <p className="text-2xl">{todayCustomer}</p>
                        <div className="flex justify-between text-sm mt-2 space-x-4">
                            <div>
                                <h1 className="font-bold">Precious</h1>
                                <p>{yesterdayCustomer}</p>
                            </div>
                            <div>
                                <h1 className="font-bold">% Change</h1>
                                <p> {calculatePercentageChange(todayCustomer, yesterdayCustomer) > 0 ? '+' : ''}
                                    {calculatePercentageChange(todayCustomer, yesterdayCustomer) !== null
                                        ? `${calculatePercentageChange(todayCustomer, yesterdayCustomer)} %` : 'N/A'}</p>
                            </div>
                            <div className='flex flex-col items-center'>
                                <h1 className="font-bold  ">Trend</h1>
                                <p className='p-0.5 text-xl' >{calculatePercentageChange(todayCustomer, yesterdayCustomer) > 0 ? <FaArrowTrendUp /> : calculatePercentageChange(todayCustomer, yesterdayCustomer) < 0 ? <FaArrowTrendDown /> : ''}</p>
                            </div>
                        </div>
                    </div>
                    <div className={`flex-grow p-4 text-center rounded-xl ${calculatePercentageChange(todayOrder, yesterdayOrder) > 0 ? 'bg-green-500' : calculatePercentageChange(todayOrder, yesterdayOrder) < 0 ? 'bg-red-500' : 'bg-yellow-500'}`}>
                        <h1 className="font-bold text-xl p-1">Number of Orders</h1>
                        <p className="text-2xl">{todayOrder}</p>
                        <div className="flex justify-between text-sm mt-2 space-x-4">
                            <div>
                                <h1 className="font-bold">Precious</h1>
                                <p>{yesterdayOrder}</p>
                            </div>
                            <div>
                                <h1 className="font-bold">% Change</h1>
                                <p> {calculatePercentageChange(todayOrder, yesterdayOrder) > 0 ? '+' : ''}
                                    {calculatePercentageChange(todayOrder, yesterdayOrder) !== null
                                        ? `${calculatePercentageChange(todayOrder, yesterdayOrder)} %` : 'N/A'}</p>
                            </div>
                            <div className='flex flex-col items-center'>
                                <h1 className="font-bold  ">Trend</h1>
                                <p className='p-0.5 text-xl' >{calculatePercentageChange(todayOrder, yesterdayOrder) > 0 ? <FaArrowTrendUp /> : calculatePercentageChange(todayOrder, yesterdayOrder) < 0 ? <FaArrowTrendDown /> : ''}</p>
                            </div>
                        </div>
                    </div>
                    {todayProduct && yesterdayProduct ? (<div className={`flex-grow p-4 text-center rounded-xl ${calculatePercentageChange(todayProduct.data.reduce((total, item) => total + item.Quantity, 0), yesterdayProduct.data.reduce((total, item) => total + item.Quantity, 0)) > 0 ? 'bg-green-500' : calculatePercentageChange(todayOrder, yesterdayProduct.data.reduce((total, item) => total + item.Quantity, 0)) < 0 ? 'bg-red-500' : 'bg-yellow-500'}`}>
                        <h1 className="font-bold text-xl p-1">Number of Product Sold</h1>
                        <p className="text-2xl">{todayProduct.data.reduce((total, item) => total + item.Quantity, 0)}</p>
                        <div className="flex justify-between text-sm mt-2 space-x-4">
                            <div>
                                <h1 className="font-bold">Precious</h1>
                                <p>{yesterdayProduct.data.reduce((total, item) => total + item.Quantity, 0)}</p>
                            </div>
                            <div>
                                <h1 className="font-bold">% Change</h1>
                                <p> {calculatePercentageChange(todayProduct.data.reduce((total, item) => total + item.Quantity, 0), yesterdayProduct.data.reduce((total, item) => total + item.Quantity, 0)) > 0 ? '+' : ''}
                                    {calculatePercentageChange(todayProduct.data.reduce((total, item) => total + item.Quantity, 0), yesterdayProduct.data.reduce((total, item) => total + item.Quantity, 0)) !== null
                                        ? `${calculatePercentageChange(todayProduct.data.reduce((total, item) => total + item.Quantity, 0), yesterdayProduct.data.reduce((total, item) => total + item.Quantity, 0))} %` : 'N/A'}</p>
                            </div>
                            <div className='flex flex-col items-center'>
                                <h1 className="font-bold  ">Trend</h1>
                                <p className='p-0.5 text-xl' >{calculatePercentageChange(todayProduct.data.reduce((total, item) => total + item.Quantity, 0), yesterdayProduct.data.reduce((total, item) => total + item.Quantity, 0)) > 0 ? <FaArrowTrendUp /> : calculatePercentageChange(todayProduct.data.reduce((total, item) => total + item.Quantity, 0), yesterdayProduct.data.reduce((total, item) => total + item.Quantity, 0)) < 0 ? <FaArrowTrendDown /> : ''}</p>
                            </div>
                        </div>
                    </div>)
                        : (<p>loading...</p>)}

                </div>
            )}
            {view === 'week' && (
                <div className="flex w-full space-x-2 p-4 text-white">
                    <div className={`flex-grow p-4 text-center rounded-xl ${calculatePercentageChange(thisWeekRevenue, lastWeekRevenue) > 0 ? 'bg-green-500' : calculatePercentageChange(thisWeekRevenue, lastWeekRevenue) < 0 ? 'bg-red-500' : 'bg-yellow-500'}`}>
                        <h1 className="font-bold text-xl p-1">Revenue</h1>
                        <p className="text-2xl">{formatCurrency(thisWeekRevenue)}</p>
                        <div className="flex justify-between text-sm mt-2 space-x-4">
                            <div>
                                <h1 className="font-bold">Precious</h1>
                                <p>{formatCurrency(lastWeekRevenue)}</p>
                            </div>
                            <div>
                                <h1 className="font-bold">% Change</h1>
                                <p > {calculatePercentageChange(thisWeekRevenue, lastWeekRevenue) > 0 ? '+' : ''}
                                    {calculatePercentageChange(thisWeekRevenue, lastWeekRevenue) !== null
                                        ? `${calculatePercentageChange(thisWeekRevenue, lastWeekRevenue)} %` : 'N/A'}</p>
                            </div>
                            <div className='flex flex-col items-center'>
                                <h1 className="font-bold  ">Trend</h1>
                                <p className='p-0.5 text-xl' >{calculatePercentageChange(thisWeekRevenue, lastWeekRevenue) > 0 ? <FaArrowTrendUp /> : calculatePercentageChange(thisWeekRevenue, lastWeekRevenue) < 0 ? <FaArrowTrendDown /> : ''}</p>
                            </div>
                        </div>
                    </div>
                    <div className={`flex-grow p-4 text-center rounded-xl ${calculatePercentageChange(thisWeekCustomer, lastWeekCustomer) > 0 ? 'bg-green-500' : calculatePercentageChange(thisWeekCustomer, lastWeekCustomer) < 0 ? 'bg-red-500' : 'bg-yellow-500'}`}>
                        <h1 className="font-bold text-xl p-1">New Customer</h1>
                        <p className="text-2xl">{thisWeekCustomer}</p>
                        <div className="flex justify-between text-sm mt-2 space-x-4">
                            <div>
                                <h1 className="font-bold">Precious</h1>
                                <p>{lastWeekCustomer}</p>
                            </div>
                            <div>
                                <h1 className="font-bold">% Change</h1>
                                <p> {calculatePercentageChange(thisWeekCustomer, lastWeekCustomer) > 0 ? '+' : ''}
                                    {calculatePercentageChange(thisWeekCustomer, lastWeekCustomer) !== null
                                        ? `${calculatePercentageChange(thisWeekCustomer, lastWeekCustomer)} %` : 'N/A'}</p>
                            </div>
                            <div className='flex flex-col items-center'>
                                <h1 className="font-bold  ">Trend</h1>
                                <p className='p-0.5 text-xl' >{calculatePercentageChange(thisWeekCustomer, lastWeekCustomer) > 0 ? <FaArrowTrendUp /> : calculatePercentageChange(thisWeekCustomer, lastWeekCustomer) < 0 ? <FaArrowTrendDown /> : ''}</p>
                            </div>
                        </div>
                    </div>
                    <div className={`flex-grow p-4 text-center rounded-xl ${calculatePercentageChange(thisWeekOrder, lastWeekOrder) > 0 ? 'bg-green-500' : calculatePercentageChange(thisWeekOrder, lastWeekOrder) < 0 ? 'bg-red-500' : 'bg-yellow-500'}`}>
                        <h1 className="font-bold text-xl p-1">Number of Orders</h1>
                        <p className="text-2xl">{thisWeekOrder}</p>
                        <div className="flex justify-between text-sm mt-2 space-x-4">
                            <div>
                                <h1 className="font-bold">Precious</h1>
                                <p>{lastWeekOrder}</p>
                            </div>
                            <div>
                                <h1 className="font-bold">% Change</h1>
                                <p> {calculatePercentageChange(thisWeekOrder, lastWeekOrder) > 0 ? '+' : ''}
                                    {calculatePercentageChange(thisWeekOrder, lastWeekOrder) !== null
                                        ? `${calculatePercentageChange(thisWeekOrder, lastWeekOrder)} %` : 'N/A'}</p>
                            </div>
                            <div className='flex flex-col items-center'>
                                <h1 className="font-bold  ">Trend</h1>
                                <p className='p-0.5 text-xl' >{calculatePercentageChange(thisWeekOrder, lastWeekOrder) > 0 ? <FaArrowTrendUp /> : calculatePercentageChange(thisWeekOrder, lastWeekOrder) < 0 ? <FaArrowTrendDown /> : ''}</p>
                            </div>
                        </div>
                    </div>
                    {thisWeekProduct && lastWeekProduct ?
                        (<div className={`flex-grow p-4 text-center rounded-xl ${calculatePercentageChange(thisWeekProduct.data.reduce((total, item) => total + item.Quantity, 0), lastWeekProduct.data.reduce((total, item) => total + item.Quantity, 0)) > 0 ? 'bg-green-500' : calculatePercentageChange(thisWeekProduct.data.reduce((total, item) => total + item.Quantity, 0), lastWeekProduct.data.reduce((total, item) => total + item.Quantity, 0)) < 0 ? 'bg-red-500' : 'bg-yellow-500'}`}>
                            <h1 className="font-bold text-xl p-1">Number of Product Sold</h1>
                            <p className="text-2xl">{thisWeekProduct.data.reduce((total, item) => total + item.Quantity, 0)}</p>
                            <div className="flex justify-between text-sm mt-2 space-x-4">
                                <div>
                                    <h1 className="font-bold">Precious</h1>
                                    <p>{lastWeekProduct.data.reduce((total, item) => total + item.Quantity, 0)}</p>
                                </div>
                                <div>
                                    <h1 className="font-bold">% Change</h1>
                                    <p> {calculatePercentageChange(thisWeekProduct.data.reduce((total, item) => total + item.Quantity, 0), lastWeekProduct.data.reduce((total, item) => total + item.Quantity, 0)) > 0 ? '+' : ''}
                                        {calculatePercentageChange(thisWeekProduct.data.reduce((total, item) => total + item.Quantity, 0), lastWeekProduct.data.reduce((total, item) => total + item.Quantity, 0)) !== null
                                            ? `${calculatePercentageChange(thisWeekProduct.data.reduce((total, item) => total + item.Quantity, 0), lastWeekProduct.data.reduce((total, item) => total + item.Quantity, 0))} %` : 'N/A'}</p>
                                </div>
                                <div className='flex flex-col items-center'>
                                    <h1 className="font-bold  ">Trend</h1>
                                    <p className='p-0.5 text-xl' >{calculatePercentageChange(thisWeekProduct.data.reduce((total, item) => total + item.Quantity, 0), lastWeekProduct.data.reduce((total, item) => total + item.Quantity, 0)) > 0 ? <FaArrowTrendUp /> : calculatePercentageChange(thisWeekProduct.data.reduce((total, item) => total + item.Quantity, 0), lastWeekProduct.data.reduce((total, item) => total + item.Quantity, 0)) < 0 ? <FaArrowTrendDown /> : ''}</p>
                                </div>
                            </div>
                        </div>)
                        : (<p>loading...</p>)}
                </div>
            )}

        </div>
    );
}


