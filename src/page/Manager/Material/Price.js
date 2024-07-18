
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Price = () => {
    const [listMaterials, setListMaterials] = useState([]);
    const [dateTime, setDateTime] = useState({
        timeString: '',
        dateString: ''
    });
    const [materialPrices, setMaterialPrices] = useState([]);
    const [selectedTime, setSelectedTime] = useState('');

    useEffect(() => {
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
            const materials = res.data.data;
            setListMaterials(materials);
            setMaterialPrices(materials.map(material => ({
                materialID: material.id,
                buyPrice: '',
                sellPrice: '',
                effectiveDate: ''
            })));
        } catch (error) {
            console.error('Error fetching materials:', error);
        }
    };

    const handleChange = (index, e) => {
        const { name, value } = e.target;
        const newMaterialPrices = [...materialPrices];
        newMaterialPrices[index][name] = value;
        setMaterialPrices(newMaterialPrices);
    };

    const handleTimeChange = (e) => {
        setSelectedTime(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            const toLocalISOString = (date, time) => {
                const pad = (num) => (num < 10 ? '0' : '') + num;

                const year = date.getFullYear();
                const month = pad(date.getMonth() + 1);
                const day = pad(date.getDate());
                const [hours, minutes] = time.split(':');
                return `${year}-${month}-${day}T${hours}:${minutes}:00.000Z`;
            };

            const now = new Date();
            const today = toLocalISOString(now, selectedTime);
            // console.log('>>> check timeeee', today)
            await Promise.all(materialPrices.map(async (materialPrice) => {
                if (materialPrice.buyPrice && materialPrice.sellPrice) {
                    await axios.post('https://jssatsproject.azurewebsites.net/api/MaterialPriceList/CreateMaterialPriceList', {
                        materialID: materialPrice.materialID,
                        buyPrice: materialPrice.buyPrice,
                        sellPrice: materialPrice.sellPrice,
                        effectiveDate: today
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                }
            }));

            alert('Material price list created successfully!');
            getMaterials();
        } catch (error) {
            console.error('Error creating material price list:', error);
        }
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
                <form onSubmit={handleSubmit}>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-300">
                            <thead className="bg-sky-300 text-white text-left">
                                <tr>
                                    <th className="py-3 px-4 border border-gray-300"></th>
                                    <th className="py-3 px-4 border border-gray-300">Name</th>
                                    <th className="py-3 px-4 border border-gray-300">Buy Price</th>
                                    <th className="py-3 px-4 border border-gray-300">Sell Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listMaterials.map((material, index) => (
                                    <tr key={material.id} className="hover:bg-gray-100">
                                        <td className="py-4 px-4 border border-gray-300">{index + 1}</td>
                                        <td className="py-4 px-4 border border-gray-300">{material.name}</td>
                                        <td className="py-4 px-4 border border-gray-300">
                                            <input
                                                type="number"
                                                name="buyPrice"
                                                value={materialPrices[index]?.buyPrice || ''}
                                                onChange={(e) => handleChange(index, e)}
                                                placeholder="Enter New Buy Price"
                                                min="1000"
                                                className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                        </td>
                                        <td className="py-4 px-4 border border-gray-300">
                                            <input
                                                type="number"
                                                name="sellPrice"
                                                value={materialPrices[index]?.sellPrice || ''}
                                                onChange={(e) => handleChange(index, e)}
                                                placeholder="Enter New Sell Price"
                                                min="1000"
                                                className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4">
                        <label className="block text-gray-700">Select Effective Time:</label>
                        <input
                            type="time"
                            value={selectedTime}
                            onChange={handleTimeChange}
                            className="py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
                    >
                        Create Material Price List
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Price;
