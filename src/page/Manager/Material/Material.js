import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Material = () => {
    const [originalListPrice, setOriginalListPrice] = useState([]);
    const [listPrice, setListPrice] = useState([]);
    const [materials, setMaterials] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [dateTime, setDateTime] = useState({
        timeString: '',
        dateString: ''
    });
    const now = new Date(); // Thời điểm hiện tại

    // Hàm định dạng thành chuỗi ISO 8601 với múi giờ hiện tại
    function toLocalISOString(date) {
        const pad = (num) => (num < 10 ? '0' : '') + num;

        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        const seconds = pad(date.getSeconds());
        const milliseconds = (date.getMilliseconds() / 1000).toFixed(3).slice(2, 5);

        const timezoneOffset = -date.getTimezoneOffset();
        const diff = timezoneOffset >= 0 ? '+' : '-';
        const diffHours = pad(Math.floor(Math.abs(timezoneOffset) / 60));
        const diffMinutes = pad(Math.abs(timezoneOffset) % 60);

        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
    }

    const today = toLocalISOString(now); // Chuỗi ISO 8601 với múi giờ hiện tại
    const formattoday = now.toLocaleString();
    const today1 = today;
    useEffect(() => {
        getPrice();
        getMaterials();
    }, []);

    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            setDateTime({
                timeString: now.toLocaleTimeString(),
                dateString: now.toLocaleDateString()
            });
        };

        updateDateTime();
        const intervalId = setInterval(updateDateTime, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const getPrice = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }
            console.log('>>> check now', now);
            console.log('>>> check today', today);
            console.log('>>> check formattoday', formattoday);

            const res = await axios.get(`https://jssatsproject.azurewebsites.net/api/MaterialPriceList/getall?effectiveDate=${today1}&page=${currentPage}&pageSize=${pageSize}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res?.data?.data) {
                const prices = res.data.data;
                setOriginalListPrice(prices);
                setListPrice(prices);
            }
        } catch (error) {
            console.error('Error fetching prices:', error);
        }
    };


    const getMaterials = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }
            const res = await axios.get('https://jssatsproject.azurewebsites.net/api/Material/getall', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (res?.data?.data) {
                const materialData = res.data.data.reduce((acc, material) => {
                    acc[material.id] = material.name;
                    return acc;
                }, {});
                setMaterials(materialData);
            }
        } catch (error) {
            console.error('Error fetching materials:', error);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-white px-5 py-5 rounded">
            <div className="w-full max-w-screen-lg">
                <h1 className="text-3xl font-bold text-center text-blue-800 mb-6">Gold Price Today</h1>
                <div className="flex justify-center items-center mb-6">
                    <div className="text-center mr-4">
                        <strong>Time:</strong> {dateTime.timeString}
                    </div>
                    <div className="text-center ml-4">
                        <strong>Date:</strong> {dateTime.dateString}
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead className="bg-sky-300 text-white text-left">
                            <tr>
                                <th className="py-3 px-4 border border-gray-300"></th>
                                <th className="py-3 px-4 border border-gray-300">Name</th>
                                <th className="py-3 px-4 border border-gray-300">Buy Price (₫)</th>
                                <th className="py-3 px-4 border border-gray-300">Sell Price (₫)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listPrice.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-100">
                                    <td className="py-4 px-4 border border-gray-300">{index + 1}</td>
                                    <td className="py-4 px-4 border border-gray-300">{materials[item.materialId]}</td>
                                    <td className="py-4 px-4 border border-gray-300 text-right">{formatCurrency(item.buyPrice)}</td>
                                    <td className="py-4 px-4 border border-gray-300 text-right">{formatCurrency(item.sellPrice)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Material;
