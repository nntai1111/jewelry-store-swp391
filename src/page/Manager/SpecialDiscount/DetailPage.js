import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faArrowLeft } from '@fortawesome/free-solid-svg-icons';


import { CiViewList } from "react-icons/ci";
import { FaPhoneVolume } from "react-icons/fa6";
import { BsGenderFemale } from "react-icons/bs"; // female
import { BsGenderMale } from "react-icons/bs";//male
// import { MdPlace } from "react-icons/md";//address
import { MdContactMail } from "react-icons/md";//mail
import { RiAwardLine } from "react-icons/ri";//point
import { IoIosSearch } from "react-icons/io";
import { MdFace, MdFace4, MdPlace } from 'react-icons/md';
import { PiGenderFemaleBold, PiGenderMaleBold } from "react-icons/pi";
import { FaMoneyBillWave } from "react-icons/fa"; // cash
import vnPayLogo from '../../../assets/vnpay.jpg'
import { LiaBusinessTimeSolid } from "react-icons/lia";
const DetailPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const phone = searchParams.get('phone');
    const id = searchParams.get('id');

    const [customerData, setCustomerData] = useState(null);
    const [sellOrderData, setSellOrderData] = useState(null);

    useEffect(() => {
        const fetchCustomerData = async () => {
            try {
                const res = await axios.get(`https://jssatsproject.azurewebsites.net/api/customer/getbyphone?phonenumber=${phone}`);
                if (res && res.data && res.data.data) {
                    setCustomerData(res.data.data[0]);
                }
                console.log('>>> check customer', res)
            } catch (error) {
                console.error('Error fetching customer details:', error);
            }
        };

        const fetchSellOrderData = async () => {
            try {
                const res = await axios.get(`https://jssatsproject.azurewebsites.net/api/sellorder/getbyid?id=${id}`);
                if (res && res.data && res.data.data) {
                    setSellOrderData(res.data.data[0]);
                }
            } catch (error) {
                console.error('Error fetching sell order details:', error);
            }
        };

        if (phone && id) {
            fetchCustomerData();
            fetchSellOrderData();
        }
    }, [phone, id]);

    if (!customerData || !sellOrderData) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 backdrop-blur-sm">
                <FontAwesomeIcon
                    icon={faSpinner}
                    className="fa-spin fa-2x text-white"
                />
            </div>
        );
    }

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0
        }).format(value);
    };

    const formatDateTime = (isoString) => {
        const date = new Date(isoString);

        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
    };

    const handleBack = () => {
        navigate(-1); // Quay lại trang trước đó
    };
    const formatPoint = (value) => {
        return new Intl.NumberFormat('de-DE', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
            useGrouping: true,
        }).format(value);
    };
    return (
        <div className='min-h-screen bg-white mx-5 pt-5 rounded relative'>

            <div className="grid grid-cols-3 gap-4 mx-4">
                {/* Sell Order Details */}
                <div className="col-span-2 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 border border-gray-300">
                    <h2 className="text-2xl  text-blue-800 font-bold mb-2">Sell Order</h2>
                    <p className='py-2'><strong>Id:</strong> {sellOrderData.id}</p>
                    <p className='py-2'><strong>Code:</strong> {sellOrderData.code}</p>
                    <p className='py-2'><strong>Staff:</strong> {sellOrderData.staffName}</p>
                    <p className='py-2'><strong>Time:</strong> {formatDateTime(sellOrderData.createDate)}</p>
                    <p className='py-2'><strong>Description:</strong> {sellOrderData.description}</p>
                    <p className='py-2'><strong>Total Amount:</strong> {formatCurrency(sellOrderData.finalAmount)}</p>
                    <p className='py-2'><strong>Status:</strong>
                        {sellOrderData.status === 'completed' ? (
                            <span className="text-green-500 bg-green-100 font-bold p-1 px-2 mx-2 rounded-xl">COMPLETED</span>
                        ) : sellOrderData.status === 'cancelled' ? (
                            <span className="text-red-500 bg-red-100 font-bold p-1 px-2 mx-2 rounded-xl">CANCELLED</span>
                        ) : sellOrderData.status === 'processing' ? (
                            <span className="text-yellow-600 bg-yellow-100 font-bold p-1 px-2 mx-2 rounded-xl">PROCESSING</span>
                        ) : sellOrderData.status === 'draft' ? (
                            <span className="text-black bg-gray-100 font-bold p-1 px-7 mx-2 rounded-xl">DRAFT</span>
                        ) : (
                            <span className="relative group text-blue-500 bg-blue-100 font-bold p-1 px-2 mx-2 rounded-xl">
                                WAITING...
                            </span>
                        )}
                    </p>
                    <p className="mb-4 flex items-center py-2">
                        <strong className="mr-2">Payment Method:</strong>{sellOrderData.paymentMethod}
                        {sellOrderData.paymentMethod === 'VnPay' ? (
                            <img src={vnPayLogo} alt="VNPay Logo" className="w-5 h-auto mx-2" />
                        ) : sellOrderData.paymentMethod === 'Cash' ? (
                            <FaMoneyBillWave className="text-green-500 text-2xl mx-2" />
                        ) : (
                            'null'
                        )}
                    </p>
                </div>
                {/* Customer Details */}
                <div className="col-span-1 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 border border-gray-300">
                    <div className="flex items-center justify-center mb-2">
                        {customerData.gender === 'Male' ? (
                            <MdFace className="text-4xl font-bold text-blue-800 mr-2" />
                        ) : (
                            <MdFace4 className="text-4xl font-bold text-pink-500 mr-2" />
                        )}
                        <h2 className="text-2xl font-bold text-blue-800">
                            {customerData.firstname} {customerData.lastname}
                        </h2>
                    </div>

                    <p className="flex items-center py-3">
                        <FaPhoneVolume className="mr-3 text-green-500 text-2xl font-bold" />
                        <strong className="mr-2">Phone:</strong> {customerData.phone}
                    </p>
                    <p className="flex items-center py-3">
                        <MdContactMail className="mr-3 text-red-500 text-2xl font-bold" />
                        <strong className="mr-2">Email:</strong> {customerData.email}
                    </p>
                    <p className="flex items-center py-3">
                        {customerData.gender === "Male" ? (
                            <PiGenderMaleBold className="text-blue-500 mr-3 text-2xl font-bold" />
                        ) : (
                            <PiGenderFemaleBold className="text-pink-500 mr-3 text-2xl font-bold" />
                        )}
                        <strong className="mr-2">Gender:</strong> {customerData.gender}
                    </p>
                    <p className="flex items-center py-3">
                        <MdPlace className="mr-3 text-red-500 text-2xl font-bold" />
                        <strong className="mr-2">Address:</strong> {customerData.address}
                    </p>
                    <div className="flex flex-col py-3 space-y-3">
                        <div className="flex items-center">
                            <RiAwardLine className="mr-3 text-yellow-500 text-2xl font-bold" />
                            <strong className="mr-2">Point:</strong>
                        </div>
                        <div className="flex items-center ml-8 ">
                            <strong className="mr-2 ">• Available Point:</strong> {formatPoint(customerData.point.availablePoint)}
                        </div>
                        <div className="flex items-center ml-8 ">
                            <strong className="mr-2">• Total Point:</strong> {formatPoint(customerData.point.totalpoint)}
                        </div>
                    </div>
                    <p className="flex items-center py-3">
                        <LiaBusinessTimeSolid className="mr-3 text-red-500 text-2xl font-bold" />
                        <strong className="mr-2">Create Date:</strong> {formatDateTime(customerData.createDate)}
                    </p>
                </div>
            </div>
            <div className="w-[1200px] overflow-hidden mx-2 ml-4 ">
                <table className="font-inter w-full table-auto text-left">
                    <thead className="w-full rounded-lg bg-blue-900 text-base font-semibold text-white  sticky top-0">
                        <tr className="whitespace-nowrap text-xl  font-bold">
                            <th className="rounded-l-lg"></th>
                            <th className='py-2'>Product Code</th>
                            <th>Name</th>
                            <th>Unit Price</th>
                            <th>Promotion Rate</th>
                            <th className="rounded-r-lg">Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sellOrderData.sellOrderDetails && sellOrderData.sellOrderDetails.map((item, index) => (
                            <tr key={index} className="cursor-pointer font-normal text-black bg-white shadow-md rounded font-bold text-base hover:shadow-2xl">
                                <td className="rounded-l-lg pr-3 pl-5 py-4 text-black ">{index + 1}</td>
                                <td>{item.productCode}</td>
                                <td>{item.productName}</td>
                                <td>{formatCurrency(item.unitPrice)}</td>
                                <td>{item.promotionRate || 'null'}</td>
                                <td className="rounded-r-lg">{item.quantity}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button
                onClick={handleBack}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                Back
            </button>

        </div>
    );
};

export default DetailPage;
