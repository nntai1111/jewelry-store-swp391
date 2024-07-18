import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import moment from 'moment'; // Import moment.js for date manipulation
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';
import { FaFileDownload } from "react-icons/fa";
const P2 = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [datesInRange, setDatesInRange] = useState([]);
    const [chartData, setChartData] = useState({
        series: [],
        labels: []
    });
    const [chartData2, setChartData2] = useState({
        series: [],
        labels: []
    });
    const [chartDataSell, setChartDataSell] = useState({
        series: [],
        labels: []
    });
    const [chartDataBuy, setChartDataBuy] = useState({
        series: [],
        labels: []
    });
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0
        }).format(value);
    };

    const handleCalculateDates = () => {
        if (startDate && endDate) {
            const start = moment(startDate);
            const end = moment(endDate);
            let dates = [];

            while (start <= end) {
                const dateObj = {
                    date: start.format('YYYY-MM-DD'),
                    start: moment(start).startOf('day').toISOString(),
                    end: moment(start).endOf('day').toISOString(),
                    revenue: 0 // Initialize revenue to 0
                };
                dates = [...dates, dateObj];
                start.add(1, 'days');
            }

            setDatesInRange(dates);

            dates.forEach((dateObj, index) => {
                fetchRevenue(dateObj, index);
            });

            fetchData(startDate, endDate);
        }

    };
    useEffect(() => {
        handleCalculateDates();
    }, [startDate, endDate]);

    const fetchData = async (startDate, endDate) => {
        // Format startDate to 00:00
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
        // const endDateString = formattedEndDate.toISOString().slice(0, 19); // Remove milliseconds and timezone
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
                `https://jssatsproject.azurewebsites.net/api/Staff/getTop6ByMonth?startDate=${startDateString}&endDate=${endDateString}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (response.data && response.data.data) {
                const seriesData = response.data.data.map(item => item.TotalRevenue);
                const labelsData = response.data.data.map(item => `${item.Firstname} ${item.Lastname}`);
                setChartData({
                    series: seriesData,
                    labels: labelsData
                });
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchData2 = async (startDate, endDate) => {
        // Format startDate to 00:00
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
            if (response.data && response.data.data) {
                const seriesData = response.data.data.map(item => item.Quantity);
                const labelsData = response.data.data.map(item => item.Category);
                setChartData2({
                    series: seriesData,
                    labels: labelsData
                });
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchDataSell = async (startDate, endDate) => {
        // Format startDate to 00:00
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

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }
            const response = await axios.get(
                `https://jssatsproject.azurewebsites.net/api/Payment/GetTotalAllPayMent?startDate=${startDateString}&endDate=${endDateString}&order=2`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (response.data && response.data.data) {
                const seriesData = response.data.data.map(item => item.TotalAmount);
                const labelsData = response.data.data.map(item => item.PaymentMethodName);
                setChartDataSell({
                    series: seriesData,
                    labels: labelsData
                });
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    const fetchDataBuy = async (startDate, endDate) => {
        // Format startDate to 00:00
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

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }
            const response = await axios.get(
                `https://jssatsproject.azurewebsites.net/api/Payment/GetTotalAllPayMent?startDate=${startDateString}&endDate=${endDateString}&order=1`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (response.data && response.data.data) {
                const seriesData = response.data.data.map(item => item.TotalAmount);
                const labelsData = response.data.data.map(item => item.PaymentMethodName);
                setChartDataBuy({
                    series: seriesData,
                    labels: labelsData
                });
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    useEffect(() => {
        fetchData(startDate, endDate);
        fetchData2(startDate, endDate);
        fetchDataSell(startDate, endDate);
        fetchDataBuy(startDate, endDate);
    }, [startDate, endDate]);

    const [options, setOptions] = useState({
        chart: {
            type: 'donut',
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'bottom'
                }
            }
        }],
        labels: chartDataSell.labels
    });
    const [options2, setOptions2] = useState({
        chart: {
            type: 'donut',
        },
        responsive: [{
            breakpoint: 480,
            options2: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'bottom'
                }
            }
        }],
        labels: chartDataBuy.labels
    });

    useEffect(() => {
        setOptions(prevOptions => ({
            ...prevOptions,
            labels: chartDataSell.labels
        }));
    }, [chartDataSell.labels]);
    useEffect(() => {
        setOptions2(prevOptions => ({
            ...prevOptions,
            labels: chartDataBuy.labels
        }));
    }, [chartData2.labels]);
    const fetchRevenue = async (dateObj, index) => {
        // Format startDate to 00:00
        const formattedStartDate = new Date(dateObj.start);
        formattedStartDate.setHours(0, 0, 0, 0);
        formattedStartDate.setHours(formattedStartDate.getHours() + 7); // Add 7 hours
        let startDateString;
        if (!isNaN(formattedStartDate.getTime())) {
            startDateString = formattedStartDate.toISOString().slice(0, 19);;
            // console.log("endDateString (ISO 8601):", endDateString);
        }

        // Format endDate to 23:59
        const formattedEndDate = new Date(dateObj.end);
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
            const revenue = response.data.data;

            setDatesInRange(prevDates => {
                const updatedDates = [...prevDates];
                updatedDates[index].revenue = revenue;
                return updatedDates;
            });
        } catch (error) {
            console.error('Error fetching revenue:', error);
        }
    };

    const handleSetDefaultDates = () => {
        const end = moment().endOf('day'); // End of today
        // const start = moment().subtract(7, 'days').startOf('day'); // 7 days ago, start of the day
        const start = moment().startOf('month'); // Ngày đầu của tháng này

        setStartDate(start.format('YYYY-MM-DD'));
        setEndDate(end.format('YYYY-MM-DD'));

        const dates = [];
        let current = start.clone();
        while (current <= end) {
            dates.push({
                date: current.format('YYYY-MM-DD'),
                start: current.startOf('day').toISOString(),
                end: current.endOf('day').toISOString(),
                revenue: 0 // Initialize revenue to 0
            });
            current.add(1, 'days');
        }

        setDatesInRange(dates);
        dates.forEach((dateObj, index) => {
            fetchRevenue(dateObj, index);
        });

        fetchData(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
    };

    const handleSetMonthDates = () => {
        const end = moment().endOf('month');
        const start = moment().startOf('year');

        setStartDate(start.format('YYYY-MM-DD'));
        setEndDate(end.format('YYYY-MM-DD'));

        const dates = [];
        let current = start.clone();
        while (current <= end) {
            dates.push({
                date: current.format('YYYY-MM'),
                start: current.startOf('month').toISOString(),
                end: current.endOf('month').toISOString(),
                revenue: 0 // Initialize revenue to 0
            });
            current.add(1, 'months');
        }

        setDatesInRange(dates);
        dates.forEach((dateObj, index) => {
            fetchRevenue(dateObj, index);
        });

        fetchData(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
    };
    useEffect(() => {
        handleSetDefaultDates();
    }, []);
    const handleSubmit = async () => {
        // Format startDate to 00:00
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
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }
            const response = await axios.post(`https://jssatsproject.azurewebsites.net/Metrics/csv/ExportChangeMetrics?startDate=${startDateString}&endDate=${endDateString}`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                responseType: 'blob' // Important for handling binary data
            });

            // Create a URL for the file
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Dashboard.csv'); // Set the file name
            document.body.appendChild(link);
            link.click();

            // Clean up and remove the link
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('Error fetching data:', error);
            // Handle errors (e.g., display error message)
        }
    };
    return (
        <div className="flex  flex-col border border-gray-300 shadow-lg my-4  rounded-md">
            <div className="flex items-center space-x-2 ml-auto pr-4">
                <div className="flex flex-col space-y-2">
                    <input
                        type="date"
                        className="border border-gray-300 rounded-md p-2"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>
                <div className="flex flex-col space-y-2">
                    <input
                        type="date"
                        className="border border-gray-300 rounded-md p-2"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
                <button
                    className="bg-white hover:bg-green-100 text-white font-bold py-2 px-2 rounded flex items-center border border-gray-300 shadow-md"
                    onClick={handleSubmit}
                >
                    <FaFileDownload className='text-green-500' />
                    <span className='text-black'>CSV</span>
                </button>
            </div>
            <div className="grid grid-cols-2 gap-4 justify-start items-start">
                <div className="px-8 pb-4">
                    {/* Chart Data 1 */}
                    <h2 className="text-lg font-bold mb-4 text-blue-800">Top seller:</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <ul className="divide-y divide-gray-200">
                                {chartData.labels.map((label, index) => (
                                    <li key={index} className="py-2">
                                        <span className="font-bold">{index + 1}. {label}:</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <ul className="divide-y divide-gray-200">
                                {chartData.series.map((value, index) => (
                                    <li key={index} className="py-2">
                                        {formatCurrency(value)}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="px-8 pb-4">
                    {/* Chart Data 2 */}
                    <h2 className="text-lg font-bold mb-4 text-blue-800">Number products sold:</h2>
                    <ul className="grid grid-cols-3 gap-4">
                        {chartData2.series.map((value, index) => (
                            <li key={index} className="bg-gray-100 p-4 rounded-lg shadow-md">
                                <strong className="font-bold">{chartData2.labels[index]}:</strong> {value}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="w-full flex space-x-4 p-2">
                <div className="w-2/3">
                    <div className="border border-gray-300 shadow-lg  ">
                        <ResponsiveContainer width="96%" height={500} className='mx-2 mt-10'>
                            <LineChart data={datesInRange} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="w-1/3">
                    <div className="flex flex-col space-y-4">
                        <div className="border border-gray-300 shadow-lg p-4">
                            <h1 className='text-blue-800 font-bold text-lg'>Monthly Sell Order Payment:</h1>
                            <ReactApexChart options={options} series={chartDataSell.series} type="donut" height={200} />
                        </div>
                        <div className="border border-gray-300 shadow-lg p-4">
                            <h1 className='text-blue-800 font-bold text-lg'>Monthly Buy Order Payment:</h1>
                            <ReactApexChart options={options2} series={chartDataBuy.series} type="donut" height={200} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default P2;




