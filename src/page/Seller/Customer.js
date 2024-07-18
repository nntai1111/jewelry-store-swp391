

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addCustomer } from '../../store/slice/cardSilec';
import Popup from 'reactjs-popup';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import { AiFillLeftCircle, AiFillRightCircle } from 'react-icons/ai';
import { IconContext } from 'react-icons';
import { fetchAllCustomer } from '../../apis/jewelryService';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Modal from 'react-modal';

const Customer = () => {
  const dispatch = useDispatch();
  const [listCustomer, setListCustomer] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalProduct, setTotalProduct] = useState(0);
  const [totalPage, setTotalPage] = useState(0);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handlePageClick = (event) => {
    getCustomer(event.selected + 1);
  };
  useEffect(() => {
    getCustomer(1);
  }, []);

  const getCustomer = async (page) => {
    try {
      const token = localStorage.getItem('token')
      if(!token){
        throw new Error('No token found')
      }
      const res = await axios.get(`https://jssatsproject.azurewebsites.net/api/Customer/GetAll?pageIndex=${page}`,{
            headers: {
              Authorization: `Bearer ${token}`
            }
        });
      // let res = await fetchAllBangles(page);
      if (res && res.data && res.data.data) {
        setListCustomer(res.data.data);
        setTotalProduct(res.data.totalElements);
        setTotalPage(res.data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching rings:', error);
      toast.error('Failed to fetch rings');
    }
  };



  const handleSearch = (event) => {
    const searchTerm = event.target.value.trim();
    setSearchTerm(searchTerm);
    if (searchTerm === '') {
      // Nếu searchTerm rỗng thì gọi lại getCustomer với page 1
      getCustomer(1);
    } else {
      getCustomerSearch(searchTerm, 1);
    }
  };

  const getCustomerSearch = async (searchTerm, page) => {
    try {
      const token = localStorage.getItem('token')
      if(!token){
        throw new Error('No token found')
      }
      const res = await axios.get(
        `https://jssatsproject.azurewebsites.net/api/Customer/Search?searchTerm=${searchTerm}&pageIndex=${page}&pageSize=10`,{
          headers:{
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (res.data && res.data.data) {
        setListCustomer(res.data.data);
        setTotalProduct(res.data.totalElements);
        setTotalPage(res.data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to fetch customers');
    }
  };

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('Male');
  const [address, setAddress] = useState('');

  const handleSubmitOrder = async (event) => {
    // event.preventDefault();

    // Validation logic
    if (!firstname) {
      toast.error('First name is required');
      return;
    }
    if (!lastname) {
      toast.error('Last name is required');
      return;
    }
    if (!phone) {
      toast.error('Phone number is required');
      return;
    }
    if (!email) {
      toast.error('Email is required');
      return;
    }
    if (!address) {
      toast.error('Address is required');
      return;
    }
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      toast.error('Invalid email format');
      return;
    }

    let data = {
      firstname,
      lastname,
      phone,
      email,
      gender,
      address,
    };

    try {
    
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
    
      let res =  await axios.post('https://jssatsproject.azurewebsites.net/api/customer/Createcustomer', 
         data, 
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (res.status === 201 || res.status === 200) {
        toast.success('Add Successful');
        setFirstname('');
        setLastname('');
        setPhone('');
        setEmail('');
        setAddress('');
        getCustomer(1);
      } else {
        toast.error('Add Fail');
        console.error('Unexpected response:', res);
      }
    } catch (error) {
      console.error('Error adding customer:', error);

      if (error.response) {
        console.error('Error response:', error.response);
        toast.error(`Add Fail: ${error.response.data.message || 'Unknown error'}`);
      } else if (error.request) {
        console.error('Error request:', error.request);
        toast.error('Add Fail: No response received from server');
      } else {
        console.error('Error message:', error.message);
        toast.error(`Add Fail: ${error.message}`);
      }
    }
  };
  const handleCheckItem = (item) => {
    dispatch(addCustomer(item))
    console.log('===>customer', item)
  }
  const handleShowAddCus = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='fixed flex items-center justify-center top-0 bottom-0 left-0 right-0 bg-[#6f85ab61] overflow-y-auto'>
            <div className="bg-[#fff] mx-auto rounded-md w-[23%] shadow-[#b6b0b0] shadow-md p-4">
              <h1 className="text-lg font-semibold mb-4">Confirm to add</h1>
              <p className="mb-6 text-center">Are you sure you want to add customer?</p>
              <div className="flex justify-end">
                <button
                  onClick={(event) => {
                    event.preventDefault();
                    setFirstname('');
                    setLastname('');
                    setPhone('');
                    setEmail('');
                    setAddress('');
                    closeModal();
                    onClose();
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded m-0"
                >
                  No
                </button>
                <button
                  onClick={(event) => {
                    event.preventDefault();
                    handleSubmitOrder();
                    closeModal();
                    onClose();
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 m-0 ml-2 rounded"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        );
      },
    });
  };

  return (
    <>
      <div className="h-[67px] mt-5 mb-2 w-full">
        <form className="max-w-md mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search Item, ID in here..."
              required
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </form>

        <button
          type="button"
          className="m-0 ml-16 mb-2 flex justify-center items-center bg-[#00AC7C] text-white gap-1 cursor-pointer tracking-widest rounded-md hover:bg-[#00ac7b85] duration-300 hover:gap-2 hover:translate-x-3"
          onClick={openModal}
        >          Add
          <svg className="w-5 h-5" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" >
            <path d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" strokeLinejoin="round" strokeLinecap="round" ></path>
          </svg>
        </button>
        <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="Modal">
          <div className='fixed top-0 bottom-0 left-0 right-0 bg-[#6f85ab61] overflow-y-auto'>
            <div className='bg-[#fff] my-[70px] mx-auto rounded-md w-[40%] shadow-[#b6b0b0] shadow-md'>
              <div className="flex items-center justify-between p-2 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900">
                  Create New Customer
                </h3>
                <a className='cursor-pointer text-black text-[24px] py-0' onClick={closeModal}>&times;</a>
              </div>
              <form className="p-4 md:p-5">
                <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="col-start-1">
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First Name</label>
                    <input value={firstname} onChange={(event) => setFirstname(event.target.value)} type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="John" required />
                  </div>
                  <div className="col-start-2">
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last Name</label>
                    <input value={lastname} onChange={(event) => setLastname(event.target.value)} type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="Wick" required />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone Number</label>
                    <input value={phone} onChange={(event) => setPhone(event.target.value)} type="number" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="0101010101" required />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                    <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="jewelryStore@gmail.com" required />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Address</label>
                    <input value={address} onChange={(event) => setAddress(event.target.value)} type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="Jewelry Store" required />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Gender</label>
                    <select value={gender} onChange={(event) => setGender(event.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5">
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>
                <button onClick={(event) => {
                  event.preventDefault();
                  handleShowAddCus();
                }} type="submit" className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path></svg>
                  Add new customer
                </button>
              </form>
            </div>
          </div>
        </Modal>
        <div className="h-[75vh] flex justify-center overflow-y-auto mb-2">
          <div className="w-[800px] overflow-hidden overflow-y-auto">
            <table className="font-inter w-full table-auto border-separate border-spacing-y-1 overflow-y-scroll text-left md:overflow-auto">
              <thead className="w-full rounded-lg bg-[#222E3A]/[6%] text-base font-semibold text-white">
                <tr>
                  <th className="whitespace-nowrap rounded-l-lg py-3 pl-3 text-sm font-normal text-[#212B36]">Customer ID</th>
                  <th className="whitespace-nowrap py-3 pl-1 text-sm font-normal text-[#212B36]">First Name</th>
                  <th className="whitespace-nowrap py-3 text-sm font-normal text-[#212B36]">Last Name</th>
                  <th className="whitespace-nowrap py-3 text-sm font-normal text-[#212B36]">PhoneNumber</th>
                  <th className="whitespace-nowrap py-3 text-sm font-normal text-[#212B36]">Available Point</th>
                  <th className="whitespace-nowrap py-3 text-sm font-normal text-[#212B36]">Action</th>
                </tr>
              </thead>
              <tbody>
                {listCustomer.map((item, index) => (
                  <tr key={index} className="cursor-pointer bg-[#f6f8fa] drop-shadow-[0_0_10px_rgba(34,46,58,0.02)] hover:shadow-2xl">
                    <td className="rounded-l-lg text-sm font-normal text-[#637381] flex justify-center py-4">{item.id}</td>
                    <td className="text-sm font-normal text-[#637381]">{item.firstname}</td>
                    <td className="text-sm font-normal text-[#637381]">{item.lastname}</td>
                    <td className="text-sm font-normal text-[#637381]">{item.phone}</td>
                    <td className="text-sm font-normal text-[#637381]">{item.point.availablePoint}</td>
                    <td className="text-sm font-normal text-[#637381]">
                      <button
                        onClick={() => handleCheckItem(item)}
                        className="my-2 mx-0 border border-white bg-[#4741b1d7] text-white rounded-md transition duration-200 ease-in-out hover:bg-[#1d3279] active:bg-[#4741b174] focus:outline-none"
                      >
                        Apply
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <ReactPaginate
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          pageCount={totalPage}
          pageClassName="mx-1"
          pageLinkClassName="px-3 py-2 rounded hover:bg-gray-200 text-black"
          previousClassName="mx-1"
          previousLinkClassName="px-3 py-2 h-0 rounded hover:bg-gray-200"
          nextClassName="mx-1"
          nextLinkClassName="px-3 py-2 h-0 rounded hover:bg-gray-200"
          breakLabel="..."
          breakClassName="mx-1 "
          breakLinkClassName="px-3 h-0 py-2 text-black rounded hover:bg-gray-200"
          containerClassName="flex justify-center items-center space-x-4 h-0"
          activeClassName="bg-blue-500 text-white rounded-xl"
          renderOnZeroPageCount={null}
          previousLabel={
            <IconContext.Provider value={{ color: "#B8C1CC", size: "36px" }}>
              <AiFillLeftCircle />
            </IconContext.Provider>
          }
          nextLabel={
            <IconContext.Provider value={{ color: "#B8C1CC", size: "36px" }}>
              <AiFillRightCircle />
            </IconContext.Provider>
          }
        />
      </div>
    </>
  );
};

export default Customer;
