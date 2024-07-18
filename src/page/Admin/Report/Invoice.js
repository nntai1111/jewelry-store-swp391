import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import { IoIosSearch } from "react-icons/io";
import axios from "axios";
import Modal from 'react-modal';
import { CiViewList } from "react-icons/ci";
const Invoice = () => {
    const [originalListProduct, setOriginalListProduct] = useState([]);
    const [listProduct, setListProduct] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedOrder, setSelectedOrder] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const ProductsPerPage = 10;

    useEffect(() => {
        getProduct();
    }, []);

    const handleDetailClick = async (id) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No token found");
            }
            const res = await axios.get(`https://jssatsproject.azurewebsites.net/api/sellorder/getById?id=${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('check detail click', res.data.data.sellOrderDetails)
            if (res && res.data && res.data.data) {
                const details = res.data.data[0].sellOrderDetails;
                console.log('check detail click', res.data.data[0].sellOrderDetails)
                setSelectedOrder(details);
                setIsModalOpen(true); // Open modal when staff details are fetched
            }
        } catch (error) {
            console.error('Error fetching staff details:', error);
        }
    };

    const getProduct = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No token found");
            }
            const res = await axios.get(`https://jssatsproject.azurewebsites.net/api/sellorder/getall`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (res && res.data && res.data.data) {
                const allProducts = res.data.data;
                setListProduct(allProducts);
                setOriginalListProduct(allProducts);
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

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0
        }).format(value);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleSearch = () => {
        let filteredProduct = originalListProduct;

        if (searchQuery) {
            filteredProduct = filteredProduct.filter((product) =>
                product.code.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setListProduct(filteredProduct);
        setSearchQuery('')
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
    };
    const formatDateTime = (isoString) => {
        const date = new Date(isoString);

        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const year = date.getFullYear();

        return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
    };
    const indexOfLastProduct = currentPage * ProductsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - ProductsPerPage;
    const currentProducts = listProduct.slice(indexOfFirstProduct, indexOfLastProduct);

    const totalPages = Math.ceil(listProduct.length / ProductsPerPage);
    const placeholders = Array.from({ length: ProductsPerPage - currentProducts.length });

    return (
        <div className="flex items-center justify-center min-h-screen bg-white mx-5 pt-5 mb-5 rounded">
            <div>
                <h1 className="text-3xl font-bold text-center text-blue-800 mb-4">List of order</h1>
                <div className="flex mb-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search by code"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="px-3 py-2 border border-gray-300 rounded-md w-[400px]"
                        />
                        <IoIosSearch className="absolute top-0 right-0 mr-3 mt-3 cursor-pointer text-gray-500" onClick={handleSearch} />
                    </div>
                </div>
                <div className="w-[1200px] overflow-hidden ">
                    <table className="font-inter w-full table-auto border-separate border-spacing-y-1 text-left">
                        <thead className="w-full rounded-lg bg-sky-300 text-base font-semibold text-white sticky top-0">
                            <tr className="whitespace-nowrap text-xl font-bold text-[#212B36] ">
                                <th className="py-3 pl-3 rounded-l-lg">ID</th>
                                <th >Customer</th>
                                <th >Staff</th>
                                <th >Time</th>

                                <th >Description</th>
                                <th >Total</th>
                                <th >Status</th>
                                <th className=" rounded-r-lg ">Action</th>
                            </tr>
                        </thead>

                        <tbody >
                            {currentProducts.map((item, index) => (

                                <tr key={index} className="cursor-pointer font-normal text-[#637381] bg-[#f6f8fa] drop-shadow-[0_0_10px_rgba(34,46,58,0.02)] text-base hover:shadow-2xl">
                                    <td className="rounded-l-lg pl-3  py-4 text-black">{item.id}</td>
                                    <td >{item.customer.firstname} {item.customer.lastname}</td>
                                    <td >{item.staff.firstname} {item.staff.lastname}</td>
                                    <td >{formatDateTime(item.createDate)}</td>
                                    <td >{item.description}</td>
                                    <td className=''>{formatCurrency(item.totalAmount)}</td>
                                    <td >{item.status}</td>

                                    <td className="text-3xl text-[#000099] pl-2"><CiViewList onClick={() => handleDetailClick(item.id)} /></td>


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
                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    contentLabel="Staff Details"
                    className="bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto"
                    overlayClassName="fixed inset-0 z-30 bg-black bg-opacity-50 flex justify-center items-center"
                >
                    {selectedOrder && (
                        <div className="fixed inset-0 flex items-center justify-center z-10 bg-gray-800 bg-opacity-50">

                            <div className="bg-white rounded-lg p-8 max-w-3xl w-full">
                                <div className="text-2xl text-center font-semibold mb-4">Order detail list</div>
                                <table className="w-full font-inter table-auto border-separate border-spacing-y-2 text-left">
                                    <thead className="bg-sky-300  text-lg font-semibold text-white sticky top-0 rounded-lg">
                                        <tr>
                                            <th className="py-4 pl-4 text-lg font-bold bg-sky-300 text-[#212B36]  rounded-l-lg whitespace-nowrap">ID</th>
                                            <th className="py-4 text-lg font-bold bg-sky-300 text-[#212B36]  whitespace-nowrap">Product ID</th>
                                            <th className="py-4 text-lg font-bold bg-sky-300 text-[#212B36]  whitespace-nowrap">Quantity</th>
                                            <th className="py-4 text-lg font-bold bg-sky-300 text-[#212B36]  whitespace-nowrap">Promotion ID</th>
                                            <th className="py-4 text-lg font-bold bg-sky-300 text-[#212B36]  whitespace-nowrap">Unit Price</th>
                                            <th className="py-4 text-lg font-bold bg-sky-300 text-[#212B36]  text-center whitespace-nowrap">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedOrder.map((item, index) => (
                                            <tr key={index} className="bg-[#f6f8fa] cursor-pointer drop-shadow-[0_0_10px_rgba(34,46,58,0.02)] hover:shadow-2xl">
                                                <td className="pl-4 text-lg font-normal text-[#637381] rounded-l-lg">{item.id}</td>
                                                <td className="text-lg font-normal text-[#637381]">{item.productId}</td>
                                                <td className="text-lg font-normal text-[#637381]">{item.quantity}</td>
                                                <td className="text-lg font-normal text-[#637381]">{item.promotionId}</td>
                                                <td className="text-lg font-normal text-[#637381]">{formatCurrency(item.unitPrice)}</td>
                                                <td className="text-lg font-normal text-[#637381]">{item.status}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="flex justify-end mt-6">
                                    <button onClick={closeModal} className="px-6 py-3 bg-blue-500 text-white rounded" style={{ width: '6rem' }}>Close</button>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal>


            </div>
        </div>
    )
}

export default Invoice