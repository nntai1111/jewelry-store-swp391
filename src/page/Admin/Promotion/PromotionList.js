


import React, { useEffect, useState, useRef } from 'react';
import { IoIosSearch } from "react-icons/io";
import { format } from 'date-fns';
import axios from "axios";
import clsx from 'clsx';
import { toast } from 'react-toastify';
import { CiViewList } from "react-icons/ci";

const PromotionList = () => {
  const scrollRef = useRef(null);

  const [originalListPromotion, setOriginalListPromotion] = useState([]);
  const [listPromotion, setListPromotion] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const promotionPerPageOptions = [10, 15, 20, 25, 30, 35, 40, 45, 50];
  const [searchQuery1, setSearchQuery1] = useState(''); // when click icon => search, if not click => not search
  const [ascending, setAscending] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentPage]);

  useEffect(() => {
    if (searchQuery) {

      handleSearch();

    } else {

      getPromotion();

    }
  }, [pageSize, currentPage, searchQuery, ascending]);

  const getPromotion = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("No token found");
      }
      const res = await axios.get(`https://jssatsproject.azurewebsites.net/api/promotion/getall?ascending=${ascending}&pageIndex=${currentPage}&pageSize=${pageSize}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res && res.data && res.data.data) {
        const promotions = res.data.data;
        setListPromotion(promotions);
        setTotalPages(res.data.totalPages);
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

  const handleSort = () => {
    setAscending(!ascending); // Toggle ascending state
    setCurrentPage(1); // Reset to first page when sorting changes
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
        `https://jssatsproject.azurewebsites.net/api/promotion/searchPromotion?searchTerm=${searchQuery}&pageIndex=${currentPage}&pageSize=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (res && res.data && res.data.data) {
        const searched = res.data.data;
        setListPromotion(searched);
        setTotalPages(res.data.totalPages);
        // console.log('>>> check search', res)
      }
      else {
        setListPromotion([]);
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

  const handleDetailClick = (promotion) => {
    setSelectedPromotion(promotion);
  };

  const placeholders = Array.from({ length: pageSize - listPromotion.length });

  return (
    <div className="flex items-center justify-center min-h-screen bg-white mx-5 pt-5 mb-5 rounded">
      <div>
        <h1 ref={scrollRef} className="text-3xl font-bold text-center text-blue-800 mb-4">Promotion list</h1>
        <div className="flex justify-between mb-4">
          <div className="flex items-center ml-2">
            <label className="block mb-1 mr-2">Page Size:</label>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(parseInt(e.target.value));
                setCurrentPage(1); // Reset to first page when page size changes
              }}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              {promotionPerPageOptions.map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
          <div className="relative w-[400px]">
            <input
              type="text"
              placeholder="Search by name"
              value={searchQuery1}
              onChange={handleSearchChange}
              className="px-3 py-2 border border-gray-300 rounded-md w-full"
            />
            <IoIosSearch className="absolute top-0 right-0 mr-3 mt-3 cursor-pointer text-gray-500" onClick={handleSetQuery} />
          </div>
        </div>
        <div className="w-[1200px] overflow-hidden ">
          <table className="font-inter w-full table-auto text-left">
            <thead className="w-full rounded-lg bg-blue-900 text-base font-semibold text-white  sticky top-0">
              <tr className="whitespace-nowrap text-xl  font-bold">
                <th className="rounded-l-lg"></th>
                <th className='py-3' >Name</th>
                <th className=" text-center">Discount Rate</th>
                <th >From</th>
                <th >To</th>
                <th >Status</th>
                <th className=" rounded-r-lg ">Action</th>
              </tr>
            </thead>
            <tbody>
              {listPromotion.map((item, index) => (
                <tr key={index} className="cursor-pointer font-normal text-black bg-white shadow-md rounded font-bold text-base hover:shadow-2xl">
                  <td className="rounded-l-lg pr-3 pl-5 py-4 text-black ">{index + (currentPage - 1) * pageSize + 1}</td>
                  <td >{item.name}</td>
                  <td className=" text-center">{item.discountRate} </td>
                  <td >{format(new Date(item.startDate), 'dd/MM/yyyy')}</td>
                  <td >{format(new Date(item.endDate), 'dd/MM/yyyy')}</td>
                  <td>
                    {item.status === 'active' ? (
                      <span className="text-green-500 bg-green-100 font-bold p-1 px-2 rounded-xl">ACTIVE</span>
                    ) : (
                      <span className="text-red-500 bg-red-100 font-bold p-1 px-2 rounded-xl">INACTIVE</span>
                    )}
                  </td>
                  <td className="text-3xl text-[#000099] pl-2"><CiViewList onClick={() => handleDetailClick(item)} /></td>

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
      {selectedPromotion && !isModalOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center z-10 bg-gray-800 bg-opacity-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-xl font-bold text-blue-600 text-center mb-4">{selectedPromotion.name}</h2>
            <p className="text-base text-gray-700 mb-2"> <strong>ID:</strong> {selectedPromotion.id}</p>
            <p className="text-base text-gray-700 mb-2"><strong>Discount Rate: </strong>{selectedPromotion.discountRate}</p>
            <p className="text-base text-gray-700 mb-2"><strong>Description: </strong>{selectedPromotion.description}</p>
            <p className="text-base text-gray-700 mb-2"><strong>Start Date: </strong>{format(new Date(selectedPromotion.startDate), 'dd/MM/yyyy')}</p>
            <p className="text-base text-gray-700 mb-2"><strong>End Date:</strong> {format(new Date(selectedPromotion.endDate), 'dd/MM/yyyy')}</p>
            <div >
              <p className="text-base text-gray-700 mb-2"><strong>Categories:</strong></p>
              <ul className="list-disc list-inside">
                {selectedPromotion.categories.map((category, index) => (
                  <li key={index} className="text-sm">{category.name}</li>
                ))}
              </ul>
            </div>
            <p className="text-base text-gray-700 mb-2"><strong>Status: </strong>
              {selectedPromotion.status === 'active' ? (
                <span className="text-green-500 bg-green-100 font-bold p-1 px-2 rounded-xl">ACTIVE</span>
              ) : (
                <span className="text-red-500 bg-red-100 font-bold p-1 px-2 rounded-xl">INACTIVE</span>
              )
              }
            </p>

            <div className='flex justify-end mt-6'>

              <button
                className="px-6 py-3 bg-blue-500 text-white rounded" onClick={() => setSelectedPromotion(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PromotionList;
