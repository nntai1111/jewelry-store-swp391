
import React, { useEffect, useState, useRef } from 'react';
import { IoIosSearch } from "react-icons/io";
import { format } from 'date-fns';
import axios from "axios";
import clsx from 'clsx';
import { toast } from 'react-toastify';
import { CiViewList } from "react-icons/ci";
import Modal from 'react-modal';

const PromotionRequestMana = () => {
  const scrollRef = useRef(null);
  const [isYesNoOpen, setIsYesNoOpen] = useState(false);

  const [listPromotion, setListPromotion] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenDetail, setIsModalOpenDetail] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const promotionPerPageOptions = [10, 15, 20, 25, 30, 35, 40, 45, 50];
  const [searchQuery1, setSearchQuery1] = useState(''); // when click icon => search, if not click => not search
  const [ascending, setAscending] = useState(false);
  const [errors, setErrors] = useState({});
  const [newPromotion, setNewPromotion] = useState({
    discountRate: '',
    description: '',
    startDate: '',
    endDate: '',
    managerID: localStorage.getItem('staffId'),
    createdAt: new Date().toISOString(),
    categoriIds: []
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentPage]);
  useEffect(() => {

    getCategory();
  }, []);
  useEffect(() => {
    if (searchQuery) {

      handleSearch();

    } else {

      getPromotion();

    }
  }, [pageSize, currentPage, searchQuery, ascending]);

  const getCategory = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("No token found");
      }
      const res = await axios.get('https://jssatsproject.azurewebsites.net/api/productcategory/getall', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res && res.data && res.data.data) {
        const categories = res.data.data;
        setCategories(categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };


  const getPromotion = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("No token found");
      }
      const res = await axios.get(`https://jssatsproject.azurewebsites.net/api/promotionRequest/getall?ascending=${ascending}&pageIndex=${currentPage}&pageSize=${pageSize}`, {
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

  const handleDetailClick = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("No token found");
      }
      const res = await axios.get(`https://jssatsproject.azurewebsites.net/api/promotionRequest/getById?id=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // console.log('check detail click', res)
      if (res && res.data && res.data.data) {
        const details = res.data.data[0];
        // console.log('check detail click', res)
        setSelectedRequest(details);
        setIsModalOpenDetail(true); // Open modal when staff details are fetched
      }
    } catch (error) {
      console.error('Error fetching staff details:', error);
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
        `https://jssatsproject.azurewebsites.net/api/promotionRequest/search?description=${searchQuery}&pageIndex=${currentPage}&pageSize=${pageSize}`,
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

  const handleAddPromotion = () => {
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox' && name === 'categoriIds') {
      const categoryId = value;
      let updatedcategoriIds = [...newPromotion.categoriIds];

      if (checked) {
        if (!updatedcategoriIds.includes(categoryId)) {
          updatedcategoriIds.push(categoryId);
        }
      } else {
        updatedcategoriIds = updatedcategoriIds.filter(id => id !== categoryId);
      }

      setNewPromotion(prevPromotion => ({
        ...prevPromotion,
        categoriIds: updatedcategoriIds,
      }));
    } else {
      setNewPromotion(prevPromotion => ({
        ...prevPromotion,
        [name]: value
      }));
    }
  };

  const validateForm = () => {
    let tempErrors = {};
    let today = new Date();
    if (!newPromotion.discountRate) tempErrors.discountRate = 'DiscountRate is required';
    if (!newPromotion.description) tempErrors.description = 'Description is required';

    if (!newPromotion.startDate) tempErrors.startDate = 'StartDate is required';
    else if (newPromotion.startDate < today) {
      tempErrors.startDate = 'Start Date must be greater than or equal to Today';
    }

    if (!newPromotion.endDate) tempErrors.endDate = 'EndDate is required';
    else if (newPromotion.endDate <= newPromotion.startDate) {
      tempErrors.endDate = 'End Date must be greater than Start Date';

    }
    else if (newPromotion.endDate < today) {
      tempErrors.endDate = 'End Date must be greater than or equal to Today';
    }

    if (!newPromotion.managerID) tempErrors.managerID = 'ManagerID is required';
    if (!newPromotion.createdAt) tempErrors.createdAt = 'createdAt is required';
    if (newPromotion.categoriIds.length === 0) {
      tempErrors.categoriIds = 'At least one Category must be selected';
    }


    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };


  const handleCreatePromotion = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("No token found");
      }
      const promotionToSend = {
        ...newPromotion,
        categoriIds: newPromotion.categoriIds.map(id => parseInt(id))
      };
      console.log('>>> checkccccc', promotionToSend)
      const res = await axios.post('https://jssatsproject.azurewebsites.net/api/promotionrequest/CreatePromotionRequest', promotionToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (res && res.data) {
        getPromotion();
        setIsModalOpen(false);
        setIsYesNoOpen(false);
        setNewPromotion({
          discountRate: '',
          description: '',
          startDate: '',
          endDate: '',
          managerID: localStorage.getItem('staffId'),
          createdAt: new Date().toISOString(),
          categoriIds: []
        });
      }
    } catch (error) {
      console.error('Error creating promotion:', error);
    }

  };



  const closeModal = () => {
    setIsModalOpen(false);
    setIsModalOpenDetail(false);
    setNewPromotion({
      discountRate: '',
      description: '',
      startDate: '',
      endDate: '',
      managerID: localStorage.getItem('staffId'),
      createdAt: new Date().toISOString(),
      categoriIds: []
    });

  };

  const getNamefromDescription = (value) => {
    // Tìm vị trí của dấu '\n'
    const newlinePosition = value.indexOf('\n');
    // Nếu có dấu '\n' trong chuỗi, lấy phần trước nó
    return newlinePosition !== -1 ? value.substring(0, newlinePosition) : value;
  }

  const getDescription = (value) => {
    // Tìm vị trí của dấu '\n'
    const newlinePosition = value.indexOf('\n');
    // Nếu có dấu '\n' trong chuỗi, lấy phần sau nó
    return newlinePosition !== -1 ? value.substring(newlinePosition + 1) : '';
  }
  const handleYesNo = () => {
    if (!validateForm()) return;
    setIsYesNoOpen(true);
  };
  const placeholders = Array.from({ length: pageSize - listPromotion.length });


  return (
    <div className="flex items-center justify-center min-h-screen bg-white mx-5 pt-5 mb-5 rounded">
      <div>
        <h1 ref={scrollRef} className="text-3xl font-bold text-center text-blue-800 mb-4"> Promotion Request List</h1>
        <div className="flex justify-between items-center">
          <div className="ml-2">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
              onClick={handleAddPromotion}
            >
              Add new promotion
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
                {promotionPerPageOptions.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
            <div className="relative w-[400px]">
              <input
                type="text"
                placeholder="Search by name "
                value={searchQuery1}
                onChange={handleSearchChange}
                className="px-3 py-2 border border-gray-300 rounded-md w-full"
              />
              <IoIosSearch
                className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-500"
                onClick={handleSetQuery}
              />
            </div>
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
                <th className="text-center ">Status</th>
                <th className=" rounded-r-lg ">Action</th>
              </tr>
            </thead>
            <tbody>
              {listPromotion.map((item, index) => (
                <tr key={index} className="cursor-pointer font-normal text-black bg-white shadow-md rounded font-bold text-base hover:shadow-2xl">
                  <td className="rounded-l-lg pr-3 pl-5 py-4 text-black ">{index + (currentPage - 1) * pageSize + 1}</td>
                  <td >{getNamefromDescription(item.description)}</td>
                  <td className="text-center ">{item.discountRate}</td>
                  <td >{format(new Date(item.startDate), 'dd/MM/yyyy')}</td>
                  <td >{format(new Date(item.endDate), 'dd/MM/yyyy')}</td>
                  <td className=" text-center">
                    {item.status === 'approved'
                      ? (<span className="text-green-500 bg-green-100 font-bold p-1 px-2 rounded-xl">Approved</span>)
                      : item.status === 'rejected' ? (
                        <span className="text-red-500 bg-red-100 font-bold p-1 px-2 rounded-xl">Rejected</span>
                      ) : item.status
                    }
                  </td>
                  <td className="text-3xl text-[#000099] pl-2"><CiViewList onClick={() => handleDetailClick(item.requestId)} /></td>

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

      {/* Modal for adding new promotion */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-[500px]">
            <h2 className="text-2xl font-semibold text-center text-blue-600 mb-4">Add New Promotion</h2>
            <form >
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Discount Rate (%)</label>
                <input
                  type="number"
                  name="discountRate"
                  value={newPromotion.discountRate}
                  onChange={handleInputChange}
                  step="0.01" // Bước nhảy là 0.01 để cho phép nhập số thập phân
                  min="0" // Giá trị nhỏ nhất là 0
                  max="1" // Giá trị lớn nhất là 1
                  className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />

                {errors.discountRate && <span className="text-red-500 text-sm">{errors.discountRate}</span>}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={newPromotion.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                {errors.description && <span className="text-red-500 text-sm">{errors.description}</span>}

              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={newPromotion.startDate}
                  onChange={handleInputChange}
                  className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                {errors.startDate && <span className="text-red-500 text-sm">{errors.startDate}</span>}

              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={newPromotion.endDate}
                  onChange={handleInputChange}
                  className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                {errors.endDate && <span className="text-red-500 text-sm">{errors.endDate}</span>}

              </div>

              {/* Add selection for categories */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (

                    <div key={category.id} className="flex items-center">
                      {category.name !== 'Wholesale gold' && category.name !== 'Retail gold' && (
                        <>
                          <input
                            type="checkbox"
                            name="categoriIds"
                            value={category.id.toString()}
                            checked={newPromotion.categoriIds.includes(category.id.toString())}
                            onChange={handleInputChange}
                            className="mr-2"
                          />
                          <label htmlFor={category.id.toString()}>{category.name}</label>
                        </>
                      )}

                    </div>
                  ))}
                  {errors.categoriIds && <span className="text-red-500 text-sm">{errors.categoriIds}</span>}
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <button

                  type="button"
                  onClick={handleYesNo}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 mx-0"
                >
                  Create Promotion
                </button>
                <button
                  onClick={closeModal}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isYesNoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-black mb-4">Confilm to create</h2>
            <p>Create new promotion request ?</p>

            <div className="flex justify-end">
              <button
                type="button"
                className="mr-2 px-4 py-2 bg-blue-500 text-white rounded-md"
                onClick={handleCreatePromotion}
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
      <Modal
        isOpen={isModalOpenDetail}
        onRequestClose={closeModal}
        contentLabel="Product Details"
        className="bg-white p-6 rounded-lg shadow-lg "
        overlayClassName="fixed inset-0 z-30 bg-black bg-opacity-50 flex justify-center items-center"
      >
        {selectedRequest && (
          <div className="fixed inset-0 z-30 flex items-center justify-center z-10 bg-gray-800 bg-opacity-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <h2 className="text-xl font-bold text-blue-600 text-center mb-4">{selectedRequest.description && getNamefromDescription(selectedRequest.description)}</h2>
              <p className="text-base text-gray-700 mb-2"> <strong>Manager:</strong> {selectedRequest.managerName}</p>
              <p className="text-base text-gray-700 mb-2"><strong>Discount Rate: </strong>{selectedRequest.discountRate}</p>
              <p className="text-base text-gray-700 mb-2"><strong>Description: </strong>{selectedRequest.description && getDescription(selectedRequest.description)}</p>
              <p className="text-base text-gray-700 mb-2"><strong>Start Date: </strong>{selectedRequest.startDate && format(new Date(selectedRequest.startDate), 'dd/MM/yyyy')}</p>
              <p className="text-base text-gray-700 mb-2"><strong>End Date:</strong> {selectedRequest.endDate && format(new Date(selectedRequest.endDate), 'dd/MM/yyyy')}</p>
              <div >
                <p className="text-base text-gray-700 mb-2"><strong>Categories:</strong></p>
                <ul className="list-disc list-inside">
                  {selectedRequest.categories && selectedRequest.categories.map((category, index) => (
                    <li key={index} className="text-sm">{category.name}</li>
                  ))}
                </ul>
              </div>
              <p className="text-base text-gray-700 mb-2"><strong>Create at:</strong> {selectedRequest.createdAt && formatDateTime(selectedRequest.createdAt)}</p>

              <p className="text-base text-gray-700 mb-2"><strong>Status: </strong>
                {selectedRequest.status === 'approved'
                  ? (<span className="text-green-500 bg-green-100 font-bold p-1 px-2 mx-2 rounded-xl">Approved</span>)
                  : selectedRequest.status === 'rejected' ? (
                    <span className="text-red-500 bg-red-100 font-bold p-1 px-2 mx-2 rounded-xl">Rejected</span>
                  ) : selectedRequest.status
                }
              </p>
              <div className='flex justify-end mt-6'>
                <button
                  className="px-6 py-3 bg-blue-500 text-white rounded" onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div >
        )}
      </Modal >

    </div >
  );
};

export default PromotionRequestMana;

