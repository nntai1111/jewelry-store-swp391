import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
export default function DiamondPrice() {
    const [diamondData, setDiamondData] = useState({
        originId: '',
        colorId: '',
        cutId: '',
        clarityId: '',
        caratId: '',
        price: '',
        effectiveDate: ''
    });
    const [isYesNoOpen, setIsYesNoOpen] = useState(false);

    const [originOptions, setOriginOptions] = useState([]);
    const [colorOptions, setColorOptions] = useState([]);
    const [cutOptions, setCutOptions] = useState([]);
    const [clarityOptions, setClarityOptions] = useState([]);
    const [caratOptions, setCaratOptions] = useState([]);

    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [originRes, colorRes, cutRes, clarityRes, caratRes] = await Promise.all([
                    axios.get('https://jssatsproject.azurewebsites.net/api/Origin/GetAll'),
                    axios.get('https://jssatsproject.azurewebsites.net/api/_4C/GetColorAll'),
                    axios.get('https://jssatsproject.azurewebsites.net/api/_4C/getCutAll'),
                    axios.get('https://jssatsproject.azurewebsites.net/api/_4C/GetClarityAll'),
                    axios.get('https://jssatsproject.azurewebsites.net/api/_4C/getCaratAll')
                ]);

                setOriginOptions(originRes.data.data);
                setColorOptions(colorRes.data.data);
                setCutOptions(cutRes.data.data);
                setClarityOptions(clarityRes.data.data);
                setCaratOptions(caratRes.data.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleDiamondChange = (e) => {
        const { name, value } = e.target;
        setDiamondData((prevData) => ({ ...prevData, [name]: value }));
    };

    const validate = () => {
        const errors = {};
        if (!diamondData.originId) errors.originId = 'Origin is required';
        if (!diamondData.colorId) errors.colorId = 'Color is required';
        if (!diamondData.cutId) errors.cutId = 'Cut is required';
        if (!diamondData.clarityId) errors.clarityId = 'Clarity is required';
        if (!diamondData.caratId) errors.caratId = 'Carat is required';
        if (!diamondData.price || Number(diamondData.price) <= 0) errors.price = 'Price must be greater than 0';
        if (!diamondData.effectiveDate || new Date(diamondData.effectiveDate) < new Date()) {
            errors.effectiveDate = 'Effective Date must be greater than or equal to the current time';
        }
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChangeDone1 = async () => {

        try {
            await axios.post('https://jssatsproject.azurewebsites.net/api/DiamondPriceList/CreateDiamondPriceList', diamondData);
            toast.success('Diamond price created successfully')
        } catch (error) {
            console.error('Error creating diamond price list:', error);
            toast.error('Failed to create diamond price list')
        }
    };
    const handleYesNo = (e) => {
        e.preventDefault();
        if (!validate()) return;
        setIsYesNoOpen(true);
    };

    const resetData = () => {
        setDiamondData({
            originId: '',
            colorId: '',
            cutId: '',
            clarityId: '',
            caratId: '',
            price: '',
            effectiveDate: ''
        });
    }
    const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

    return (
        <div className="p-4 max-w-[1200px] mx-auto bg-white rounded-xl shadow-md space-y-4">
            <h2 className="text-3xl font-bold text-blue-800">Create Diamond Price</h2>
            <div className="grid grid-cols-2 gap-4">
                <div className="mt-4 p-4 border border-gray-300 rounded-md shadow-md">
                    <form onSubmit={handleYesNo} className="space-y-4">
                        <div>
                            <div className="flex items-center py-2">
                                <label htmlFor="originId" className="block text-sm font-bold text-black mr-2">
                                    Origin:
                                </label>
                                <select
                                    name="originId"
                                    value={diamondData.originId}
                                    onChange={handleDiamondChange}
                                    className="w-[400px] p-2 mr-3 border border-gray-300 rounded-md ml-auto"
                                >
                                    <option value="">Select Origin</option>
                                    {originOptions.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.originId && <span className="text-red-500 text-sm">{errors.originId}</span>}
                            </div>

                            <div className="flex items-center py-2">
                                <label htmlFor="colorId" className="block text-sm font-bold text-black mr-2">
                                    Color:
                                </label>
                                <select
                                    name="colorId"
                                    value={diamondData.colorId}
                                    onChange={handleDiamondChange}
                                    className="w-[400px] p-2 mr-3 border border-gray-300 rounded-md ml-auto"
                                >
                                    <option value="">Select Color</option>
                                    {colorOptions.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.colorId && <span className="text-red-500 text-sm">{errors.colorId}</span>}
                            </div>

                            <div className="flex items-center py-2">
                                <label htmlFor="cutId" className="block text-sm font-bold text-black mr-2">
                                    Cut:
                                </label>
                                <select
                                    name="cutId"
                                    value={diamondData.cutId}
                                    onChange={handleDiamondChange}
                                    className="w-[400px] p-2 mr-3 border border-gray-300 rounded-md ml-auto"
                                >
                                    <option value="">Select Cut</option>
                                    {cutOptions.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {capitalizeFirstLetter(option.level)}
                                        </option>
                                    ))}
                                </select>
                                {errors.cutId && <span className="text-red-500 text-sm">{errors.cutId}</span>}
                            </div>

                            <div className="flex items-center py-2">
                                <label htmlFor="clarityId" className="block text-sm font-bold text-black mr-2">
                                    Clarity:
                                </label>
                                <select
                                    name="clarityId"
                                    value={diamondData.clarityId}
                                    onChange={handleDiamondChange}
                                    className="w-[400px] p-2 mr-3 border border-gray-300 rounded-md ml-auto"
                                >
                                    <option value="">Select Clarity</option>
                                    {clarityOptions.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {capitalizeFirstLetter(option.level)}
                                        </option>
                                    ))}
                                </select>
                                {errors.clarityId && <span className="text-red-500 text-sm">{errors.clarityId}</span>}
                            </div>

                            <div className="flex items-center py-2">
                                <label htmlFor="caratId" className="block text-sm font-bold text-black mr-2">
                                    Carat:
                                </label>
                                <select
                                    name="caratId"
                                    value={diamondData.caratId}
                                    onChange={handleDiamondChange}
                                    className="w-[400px] p-2 mr-3 border border-gray-300 rounded-md ml-auto"
                                >
                                    <option value="">Select Carat</option>
                                    {caratOptions.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.weight}
                                        </option>
                                    ))}
                                </select>
                                {errors.caratId && <span className="text-red-500 text-sm">{errors.caratId}</span>}
                            </div>

                            <div className="flex items-center py-2">
                                <label htmlFor="price" className="block text-sm font-bold text-black mr-2">
                                    Price:
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={diamondData.price}
                                    onChange={handleDiamondChange}
                                    className="w-[400px] p-2 mr-3 border border-gray-300 rounded-md ml-auto"
                                    min="0"
                                    max="100000000000"
                                />
                                {errors.price && <span className="text-red-500 text-sm">{errors.price}</span>}
                            </div>

                            <div className="flex items-center py-2">
                                <label htmlFor="effectiveDate" className="block text-sm font-bold text-black mr-2">
                                    Effective Date:
                                </label>
                                <input
                                    type="datetime-local"
                                    name="effectiveDate"
                                    value={diamondData.effectiveDate}
                                    onChange={handleDiamondChange}
                                    className="w-[400px] p-2 mr-3 border border-gray-300 rounded-md ml-auto"
                                />
                                {errors.effectiveDate && <span className="text-red-500 text-sm">{errors.effectiveDate}</span>}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            Create
                        </button>
                    </form>
                </div>

                <div className="mt-4 p-4 border border-gray-300 rounded-md shadow-md">
                    <h3 className="text-xl font-bold text-blue-800 mb-4">Diamond Price Details</h3>
                    <p className="mb-2"><strong>Origin:</strong> {diamondData ? originOptions.find(origin => origin.id.toString() === diamondData.originId)?.name || '' : ''}</p>
                    <p className="mb-2"><strong>Color :</strong> {diamondData ? colorOptions.find(color => color.id.toString() === diamondData.colorId)?.name || '' : ''}</p>
                    <p className="mb-2"><strong>Cut :</strong> {diamondData ? cutOptions.find(color => color.id.toString() === diamondData.cutId)?.level || '' : ''}</p>
                    <p className="mb-2"><strong>Clarity :</strong> {diamondData ? clarityOptions.find(color => color.id.toString() === diamondData.clarityId)?.level || '' : ''}</p>
                    <p className="mb-2"><strong>Carat :</strong> {diamondData ? caratOptions.find(color => color.id.toString() === diamondData.caratId)?.weight || '' : ''}</p>
                    <p className="mb-2"><strong>Price :</strong> {diamondData.price}</p>
                    <p className="mb-2"><strong>Effective Date :</strong> {diamondData.effectiveDate}</p>
                </div>
            </div>
            {isYesNoOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full">
                        <h2 className="text-2xl font-bold text-black mb-4">Confilm to create</h2>
                        <p>Create new product ?</p>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                className="mr-2 px-4 py-2 bg-blue-500 text-white rounded-md"
                                onClick={() => {
                                    handleChangeDone1();
                                    setIsYesNoOpen(false);
                                    resetData();
                                }}
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
}
