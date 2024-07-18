import React, { useEffect, useState, useRef } from 'react'
import clsx from 'clsx'
import { IoIosSearch } from "react-icons/io";
import logo from '../../../assets/img/seller/ReGold.png'
import axios from "axios";
import Modal from 'react-modal';
import { CiViewList } from "react-icons/ci";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
const WholesaleGoldManager = () => {
    const scrollRef = useRef(null);
    const [isYesNoOpen, setIsYesNoOpen] = useState(false);
    const navigate = useNavigate();
    const [listProduct, setListProduct] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedWholesaleGold, setSelectedWholesaleGold] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [stalls, setStalls] = useState([]);
    const [stallDetail, setStallDetail] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const productPerPageOptions = [10, 15, 20, 25, 30, 35, 40, 45, 50];
    const [searchQuery1, setSearchQuery1] = useState(''); // when click icon => search, if not click => not search
    const [ascending, setAscending] = useState(true);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [currentPage]);

    useEffect(() => {
        if (searchQuery) {

            handleSearch();

        } else {

            getProduct();

        }
    }, [pageSize, currentPage, searchQuery, stallDetail, ascending]);

    useEffect(() => {
        const fetchStalls = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No token found');
                }
                const response = await axios.get('https://jssatsproject.azurewebsites.net/api/stall/getall', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response.data && response.data.data) {
                    setStalls(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching stalls:', error);
            }
        };

        fetchStalls();
    }, []);

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
                setSelectedWholesaleGold(details);
                // console.log('>>> check ressss', res)
                setIsModalOpen(true); // Open modal when staff details are fetched
            }

        } catch (error) {
            console.error('Error fetching staff details:', error);
        }
    };

    const handleUpdateProduct = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }
            const res = await axios.put(
                `https://jssatsproject.azurewebsites.net/api/Product/UpdateStallProduct?id=${selectedWholesaleGold.id}`,
                {
                    ...selectedWholesaleGold,
                    stallsId: selectedWholesaleGold.stalls.id
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            console.log('... check update product', selectedWholesaleGold)
            if (res.status === 200) {
                setIsModalOpen(false);
                setIsYesNoOpen(false);// Close the modal yes no
                toast.success('Update successful !')
                getProduct(); // Refresh the product list

            }
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };



    const getProduct = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }
            const res = await axios.get(
                `https://jssatsproject.azurewebsites.net/api/product/getall?categoryID=6&stallid=${stallDetail}&pageIndex=${currentPage}&pageSize=${pageSize}&ascending=${ascending}&includeNullStalls=false`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (res && res.data && res.data.data) {
                const allProducts = res.data.data;
                setListProduct(allProducts);
                console.log('>>> check resss', res.data.data)
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

    const handleSort = () => {
        setAscending(!ascending); // Toggle ascending state
        setCurrentPage(1); // Reset to first page when sorting changes
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
        setSearchQuery1(e.target.value);
    };
    const handleSetQuery = async () => {
        setSearchQuery(searchQuery1)
        setCurrentPage(1);
    }


    const handleSearch = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }
            const res = await axios.get(
                `https://jssatsproject.azurewebsites.net/api/product/search?categoryID=6&stallid=${stallDetail}&searchTerm=${searchQuery}&pageIndex=${currentPage}&pageSize=${pageSize}&ascending=${ascending}&includeNullStalls=false`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (res && res.data && res.data.data) {
                const searchedProducts = res.data.data;
                setListProduct(searchedProducts);
                setTotalPages(res.data.totalPages);
                console.log('>>> check search', res)
            }
            else {
                setListProduct([]);
                setTotalPages(0);
            }
        } catch (error) {
            console.error('Error fetching search results:', error);
            if (error.response) {
                console.error('Error response:', error.response.data);
            } else if (error.request) {
                console.error('Error request:', error.request);
            } else {
                console.error('Error message:', error.message);
            }
        }
        // setSearchQuery1('');
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedWholesaleGold(null);
    };
    const formatUpper = (str) => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    };
    const handleYesNo = () => {
        setIsYesNoOpen(true);
    };
    const handleAddProduct = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No token found");
            }

            // Example of passing data through URL query parameters
            navigate(`/manager/createProduct`);
        } catch (error) {
            console.error('Error handling detail click:', error);
        }
    };
    const placeholders = Array.from({ length: pageSize - listProduct.length });
    return (
        <div className="flex items-center justify-center min-h-screen bg-white mx-5 pt-5 mb-5 rounded">
            <div>
                <h1 ref={scrollRef} className="text-3xl font-bold text-center text-blue-800 mb-4">List of wholesale gold</h1>
                <div className="flex justify-between items-center">
                    <div className="ml-2">
                        <button
                            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                            onClick={handleAddProduct}
                        >
                            <span className='font-bold'>+ Add new product</span>
                        </button>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            <label className="block mr-2">Page Size:</label>
                            <select
                                value={pageSize}
                                onChange={(e) => {
                                    setPageSize(parseInt(e.target.value));
                                    setCurrentPage(1); // Reset to first page when page size changes
                                }}
                                className="px-3 py-2 border border-gray-300 rounded-md"
                            >
                                {productPerPageOptions.map((size) => (
                                    <option key={size} value={size}>{size}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center">
                            <label className="block mr-2">Stall:</label>
                            <select
                                value={stallDetail}
                                onChange={(e) => {
                                    setStallDetail(e.target.value ? parseInt(e.target.value) : '');

                                    setCurrentPage(1); // Reset to first page when page size changes
                                }}
                                className="px-3 py-2 border border-gray-300 rounded-md"
                            >
                                <option value="">All</option>
                                {stalls
                                    .filter(stall => stall.description === 'wholesale gold' || stall.description === 'counter')
                                    .map(stall => (
                                        <option key={stall.id} value={stall.id}>
                                            {stall.name} - {stall.description && formatUpper(stall.description)}
                                        </option>
                                    ))}

                            </select>
                        </div>
                        <div className="relative w-[400px]">
                            <input
                                type="text"
                                placeholder="Search by code or name"
                                value={searchQuery1}
                                onChange={handleSearchChange}
                                className="px-3 py-2 border border-gray-300 rounded-md w-full"
                            />
                            <IoIosSearch className="absolute top-0 right-0 mr-3 mt-3 cursor-pointer text-gray-500" onClick={handleSetQuery} />
                        </div>
                    </div>
                </div>
                <div className="w-[1200px] overflow-hidden ">
                    <table className="font-inter w-full table-auto text-left">
                        <thead className="w-full rounded-lg bg-blue-900 text-base font-semibold text-white  sticky top-0">
                            <tr className="whitespace-nowrap text-xl  font-bold">
                                <th className="rounded-l-lg"></th>
                                <th className='py-3 pl-3' >Category</th>
                                <th>Code</th>
                                <th >Name</th>
                                <th className="pl-7"> Img</th>
                                <th className="cursor-pointer " onClick={handleSort}>
                                    <span>Price</span>
                                    <span className=' text-sm mx-2'>{ascending ? '▲' : '▼'}</span>
                                </th>
                                <th>Stall</th>
                                <th>Status</th>
                                <th className=" rounded-r-lg ">Action</th>
                            </tr>
                        </thead>

                        <tbody >
                            {listProduct.map((item, index) => (
                                <tr key={index} className="cursor-pointer font-normal text-black bg-white shadow-md rounded font-bold text-base hover:shadow-2xl">
                                    <td className="rounded-l-lg pr-3 pl-5 py-4 text-black ">{index + (currentPage - 1) * pageSize + 1}</td>
                                    <td >{item.categoryName}</td>
                                    <td> {item.code} </td>
                                    <td>{item.name}</td>
                                    <td>
                                        {' '}
                                        <img src={item.img} className="w-20 h-15" alt="Product Logo" />{' '}
                                        {/* {item.img} */}
                                    </td>
                                    <td >{formatCurrency(item.productValue)}</td>
                                    <td >
                                        {item.stalls && item.stalls.name ? item.stalls.name : 'Null'}
                                    </td>
                                    <td>
                                        {item.status === 'active' ? (
                                            <span className="text-green-500 bg-green-100 font-bold p-1 px-2 rounded-xl">ACTIVE</span>
                                        ) : item.status === 'inactive' ? (
                                            <span className="text-red-500 bg-red-100 font-bold p-1 px-2 rounded-xl">INACTIVE</span>
                                        ) : 'null'
                                        }
                                    </td>
                                    <td className="text-3xl text-[#000099] pl-4"><CiViewList onClick={() => handleDetailClick(item.code)} /></td>
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
                    className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto"
                    overlayClassName="fixed inset-0 z-30 bg-black bg-opacity-50 flex justify-center items-center"
                >

                    {selectedWholesaleGold && (
                        <div className="fixed inset-0 flex items-center justify-center z-10 bg-gray-800 bg-opacity-50">
                            <div className="bg-white rounded-lg p-8 max-w-md w-full">
                                <h2 className="text-xl text-center text-blue-600 font-bold mb-4">{selectedWholesaleGold.name}</h2>

                                {/* <p><strong>ID:</strong> {selectedDiamond.id}</p> */}
                                <p className="text-sm text-gray-700 mb-2"><strong>ID:</strong> {selectedWholesaleGold.id}</p>
                                <p className="text-sm text-gray-700 mb-2"><strong>Code:</strong> {selectedWholesaleGold.code}</p>
                                <p className="text-sm text-gray-700 mb-2"><strong>Category:</strong>{selectedWholesaleGold.category}</p>
                                <p className="text-sm text-gray-700 mb-2"><strong>Material:</strong> {selectedWholesaleGold.materialName}</p>
                                <p className="text-sm text-gray-700 mb-2"><strong>Material Weight:</strong> {selectedWholesaleGold.materialWeight}</p>

                                <p className="text-sm text-gray-700 mb-2"><strong>Price Rate: </strong>{selectedWholesaleGold.priceRate}</p>
                                <h1 ><strong>Price:</strong> {formatCurrency(selectedWholesaleGold.productValue)}</h1>
                                <form className="mt-4">
                                    <div className="mb-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Stall
                                        </label>
                                        <select
                                            name="stallsId"
                                            value={selectedWholesaleGold?.stalls?.id ?? ''}
                                            onChange={(e) => {
                                                const value = e.target.value === 'null' ? null : e.target.value;
                                                setSelectedWholesaleGold((prevSelectedProduct) => ({
                                                    ...prevSelectedProduct,
                                                    stalls: {
                                                        id: value
                                                    }
                                                }));
                                            }}
                                            className="px-3 py-2 border border-gray-300 rounded-md w-full"
                                        >
                                            <option value="" disabled selected>
                                                {selectedWholesaleGold.stalls ? selectedWholesaleGold.stalls.name : 'null'}
                                            </option>
                                            {stalls
                                                .filter(stall => stall.description === 'wholesale gold' || stall.description === 'counter')
                                                .map(stall => (
                                                    <option key={stall.id} value={stall.id}>
                                                        {stall.name} - {stall.description && formatUpper(stall.description)}
                                                    </option>
                                                ))}
                                            <option value="null">Null</option>
                                        </select>
                                    </div>
                                </form>
                                <div className="flex">
                                    <button
                                        onClick={handleYesNo}
                                        className="mr-2 px-4 py-2 bg-blue-500 text-white rounded-md"
                                        style={{ width: '5rem' }}
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={closeModal}
                                        className="mr-2 ml-0 px-4 py-2 bg-gray-500 text-white rounded-md"
                                        style={{ width: '5rem' }}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal>
                {isYesNoOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
                        <div className="bg-white rounded-lg p-8 max-w-md w-full">
                            <h2 className="text-2xl font-bold text-black mb-4">Confilm to update</h2>
                            <p>Are you sure to update this product's stall</p>

                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="mr-2 px-4 py-2 bg-blue-500 text-white rounded-md"
                                    onClick={handleUpdateProduct}
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
        </div>
    )
}

export default WholesaleGoldManager