import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import { IoIosSearch } from "react-icons/io";
import logoRing from '../../../assets/img/seller/ring.png'
import logoEarrings from '../../../assets/img/seller/earring.png'
import logoNecklace from '../../../assets/img/seller/necklace.png'
import logoBracelet from '../../../assets/img/seller/bangles.png'
import logoDiamond from '../../../assets/img/seller/diamond.webp'
import logoRgold from '../../../assets/img/seller/ReGold.png'
import logoWgold from '../../../assets/img/seller/WhGold.jpg'
import axios from "axios";
import Modal from 'react-modal';
import { CiViewList } from "react-icons/ci";

const ProductSoldMana = () => {
    const [originalListProduct, setOriginalListProduct] = useState([]);
    const [listProduct, setListProduct] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedJewelry, setselectedJewelry] = useState(null);
    const [selectedDiamond, setselectedDiamond] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [pageSize, setPageSize] = useState(10);
    const productPerPageOptions = [10, 15, 20, 25, 30, 35, 40, 45, 50];
    const [searchQuery1, setSearchQuery1] = useState(''); // when click icon => search, if not click => not search
    const [ascending, setAscending] = useState(true);

    useEffect(() => {
        if (searchQuery) {

            handleSearch();

        } else {

            getProduct();

        }
    }, [pageSize, currentPage, searchQuery, ascending]);

    const handleDetailClick = async (id) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No token found");
            }
            const res = await axios.get(`https://jssatsproject.azurewebsites.net/api/product/getbycode?code=${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (res && res.data && res.data.data) {
                const details = res.data.data[0];
                setselectedJewelry(details);
                setIsModalOpen(true); // Open modal when staff details are fetched


                const resDiamond = await axios.get(`https://jssatsproject.azurewebsites.net/api/diamond/getbycode?code=${details.diamondCode}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setselectedDiamond(resDiamond.data.data[0]);

            }
            // if (res && res.data && res.data.data) {$$
            //     const details = res.data.data[0];
            //     setselectedJewelry(details);
            //     setIsModalOpen(true); // Open modal when staff details are fetched
            // }
        } catch (error) {
            console.error('Error fetching staff details:', error);
        }
    };


    const getProduct = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }
            const res = await axios.get(
                `https://jssatsproject.azurewebsites.net/api/sellOrderDetail/GetProductSold?ascending=true&pageIndex=${currentPage}&pageSize=${pageSize}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (res && res.data && res.data.data) {
                const allProducts = res.data.data;
                setListProduct(allProducts);
                setTotalPages(res.data.totalPages);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
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
        setselectedJewelry(null);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-white mx-5 pt-5 mb-5 rounded">
            <div>
                <h1 className="text-3xl font-bold text-center text-blue-800 mb-4">List of product sold</h1>
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
                            <tr className="whitespace-nowrap text-sm font-bold text-[#212B36] ">
                                <th className="py-3 pl-3 rounded-l-lg">Invoice code</th>
                                <th >Name</th>
                                <th>Value</th>
                                <th >Quantity</th>
                                <th className="pl-7"> {/* Adjust the padding value as needed */}
                                    Img
                                </th>
                                <th>promotionRate</th>
                                <th>guaranteeCode</th>
                                <th className=" rounded-r-lg ">Action</th>
                            </tr>
                        </thead>

                        <tbody >
                            {listProduct.map((item, index) => (
                                <tr key={index} className="cursor-pointer font-normal text-[#637381] bg-[#f6f8fa] drop-shadow-[0_0_10px_rgba(34,46,58,0.02)] text-base hover:shadow-2xl">
                                    <td className="rounded-l-lg pl-3   text-black">{item.sellOrderCode}</td>
                                    <td >{item.productName}</td>
                                    <td >{formatCurrency(item.unitPrice)}</td>
                                    <td >{item.quantity}</td>
                                    {/* <td >
                                        {item.categoryId === 1
                                            ? <img src={logoRing} className="w-20 h-20" />
                                            : item.categoryId === 2
                                                ? <img src={logoEarrings} className="w-20 h-20" />
                                                : item.categoryId === 3
                                                    ? <img src={logoBracelet} className="w-20 h-20" />
                                                    : item.categoryId === 4
                                                        ? <img src={logoNecklace} className="w-20 h-20" />
                                                        : item.categoryId === 5
                                                            ? <img src={logoRgold} className="w-20 h-20" />
                                                            : item.categoryId === 6
                                                                ? <img src={logoWgold} className="w-20 h-20" />
                                                                : <img src={logoDiamond} className="w-20 h-20" />

                                        }
                                    </td> */}
                                    <td><img src={logoDiamond} className="w-20 h-20" /></td>
                                    <td >{item.promotionRate}</td>
                                    <td >null</td>
                                    {/* <td >
                                        {item.stalls && item.stalls.name ? item.stalls.name : 'Null'}
                                    </td> */}
                                    <td className="text-3xl text-[#000099] pl-2"><CiViewList onClick={() => handleDetailClick(item.code)} /></td>


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
                    className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto"
                    overlayClassName="fixed inset-0 z-30 bg-black bg-opacity-50 flex justify-center items-center"
                >

                    {selectedJewelry && (
                        <div className="fixed inset-0 flex items-center justify-center z-10 bg-gray-800 bg-opacity-50">
                            <div className="bg-white rounded-lg p-8 max-w-md w-full">
                                <h2 className="text-xl font-bold text-blue-600 mb-4">{selectedJewelry.name}</h2>

                                {/* <p><strong>ID:</strong> {selectedDiamond.id}</p> */}
                                <p className="text-sm text-gray-700 mb-2"><strong>ID:</strong> {selectedJewelry.id}</p>
                                <p className="text-sm text-gray-700 mb-2"><strong>Code:</strong> {selectedJewelry.code}</p>
                                <p className="text-sm text-gray-700 mb-2"><strong>Category:</strong>{selectedJewelry.category}</p>
                                <p className="text-sm text-gray-700 mb-2"><strong>Material:</strong> {selectedJewelry.materialName}</p>
                                <p className="text-sm text-gray-700 mb-2"><strong>Material Weight:</strong> {selectedJewelry.materialWeight}</p>
                                <div >
                                    <p className="text-sm text-gray-700 mb-2"><strong>Diamond:</strong></p>
                                    {selectedDiamond && (
                                        <ul className="list-disc list-inside">
                                            <li className="text-sm">Diamond Id: {selectedDiamond.id}</li>
                                            <li className="text-sm">Code: {selectedDiamond.code}</li>
                                            <li className="text-sm">Name: {selectedDiamond.name}</li>
                                            <li className="text-sm">Origin: {selectedDiamond.originName}</li>
                                            <li className="text-sm">Shape: {selectedDiamond.shapeName}</li>
                                            <li className="text-sm">Fluorescence: {selectedDiamond.fluorescenceName}</li>
                                            <li className="text-sm">Color: {selectedDiamond.colorName}</li>
                                            <li className="text-sm">Symmetry: {selectedDiamond.symmetryName}</li>
                                            <li className="text-sm">Polish: {selectedDiamond.polishName}</li>
                                            <li className="text-sm">Cut: {selectedDiamond.cutName}</li>
                                            <li className="text-sm">Clarity: {selectedDiamond.clarityName}</li>
                                            <li className="text-sm">Carat: {selectedDiamond.caratWeight}</li>
                                        </ul>
                                    )
                                    }

                                </div>
                                <p className="text-sm text-gray-700 mb-2"><strong>Price Rate: </strong>{selectedJewelry.priceRate}</p>
                                <h1 ><strong>Price:</strong> {formatCurrency(selectedJewelry.productValue)}</h1>
                                <div className='flex'>
                                    <button onClick={closeModal} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" style={{ width: '5rem' }}>Close</button>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal>
            </div>
        </div>
    )
}

export default ProductSoldMana