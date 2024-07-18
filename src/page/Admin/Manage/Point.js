import React, { useEffect, useState } from 'react'
import { fetchAllCustomer } from '../../../apis/jewelryService'
import clsx from 'clsx'
import { IoIosSearch } from "react-icons/io";
import { FiEdit3 } from "react-icons/fi";

const Point = () => {
    const [originalListCustomer, setOriginalListCustomer] = useState([]);
    const [listCustomer, setListCustomer] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const customersPerPage = 10;

    useEffect(() => {
        getCustomer();
    }, []);

    const getCustomer = async () => {
        let res = await fetchAllCustomer();
        if (res && res.data && res.data.data) {
            const customers = res.data.data;
            setOriginalListCustomer(customers);
            setListCustomer(customers);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleSearch = () => {
        if (searchQuery === '') {
            // If search query is empty, reset to original list of customers
            setListCustomer(originalListCustomer);
        } else {
            const filteredCustomers = originalListCustomer.filter((customer) =>
                customer.phone.toLowerCase().includes(searchQuery.toLowerCase())
            );

            // Update state with filtered customers
            setListCustomer(filteredCustomers);
        }
    };

    const indexOfLastCustomer = currentPage * customersPerPage;
    const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
    const currentCustomers = listCustomer.slice(indexOfFirstCustomer, indexOfLastCustomer);

    const totalPages = Math.ceil(listCustomer.length / customersPerPage);
    const placeholders = Array.from({ length: customersPerPage - currentCustomers.length });

    return (
        <div className="flex items-center justify-center min-h-screen bg-white mx-5 pt-5 mb-5 rounded">
            <div>
                <h1 className="text-3xl font-bold text-center text-blue-800 mb-4">Customer point management list</h1>
                <div className="flex mb-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search by phone number"
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
                                <th className="py-3 pl-3 rounded-l-lg">Point ID</th>
                                <th> Name</th>
                                <th>PhoneNumber</th>
                                <th>Avaliable Point</th>
                                <th>Total Point</th>
                                <th className=" rounded-r-lg ">Action</th>

                            </tr>
                        </thead>
                        <tbody>
                            {currentCustomers.map((item, index) => (
                                <tr key={index} className="cursor-pointer font-normal text-[#637381] bg-[#f6f8fa] drop-shadow-[0_0_10px_rgba(34,46,58,0.02)] text-base hover:shadow-2xl">
                                    <td className="rounded-l-lg pl-3  py-4 text-black">{item.pointId}</td>
                                    <td >{item.firstname} {item.lastname}</td>
                                    <td>{item.phone}</td>
                                    <td >{item.avaliablePoint}</td>
                                    <td >{item.totalPoint}</td>
                                    <td className="text-2xl text-green-500 pl-4"><FiEdit3 /></td>

                                </tr>
                            ))}
                            {placeholders.map((_, index) => (
                                <tr key={`placeholder-${index}`} className="cursor-pointer bg-[#f6f8fa] drop-shadow-[0_0_10px_rgba(34,46,58,0.02)]">
                                    <td className="rounded-l-lg pl-3 text-sm font-normal text-[#637381]">-</td>
                                    <td className="text-sm font-normal text-[#637381]">-</td>
                                    <td className="text-sm font-normal text-[#637381]">-</td>
                                    <td className="text-sm font-normal text-[#637381]">-</td>
                                    <td className="text-sm font-normal text-[#637381]">-</td>
                                    <td className="text-sm font-normal text-[#637381]">-</td>
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
            </div>
        </div>
    )
}

export default Point
