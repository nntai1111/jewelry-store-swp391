import React, { useEffect, useState } from 'react'
import { fetchAllReGold} from '../../apis/jewelryService'
import ReGold from '../../assets/img/seller/ReGold.png'
import { useDispatch } from 'react-redux'
import { addProduct } from '../../store/slice/cardSilec'
import Modal from 'react-modal';
import axios from 'axios'
import ReactPaginate from 'react-paginate';
import { AiFillLeftCircle, AiFillRightCircle } from "react-icons/ai"; // icons form react-icons
import { IconContext } from "react-icons";
import { toast } from 'react-toastify'

const Ring = () => {
  const dispatch = useDispatch()
  const [listRing, setListRing] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJewelry, setselectedJewelry] = useState(null);
  const [selectedDiamond, setselectedDiamond] = useState(null);

  const [totalProduct, setTotalProduct] = useState(0);
  const [totalPage, setTotalPage] = useState(0);

  const handlePageClick = (event) => {
    getRing(+event.selected + 1);
  }
  useEffect(() => {
    getRing(1);
  }, []);


  const getRing = async (page) => {
    try {
      const token = localStorage.getItem('token')
      if(!token){
        throw new Error('No token found')
      }
      const res = await axios.get(
        `https://jssatsproject.azurewebsites.net/api/product/getall?categoryID=5&pageIndex=${page}&pageSize=12&ascending=true&includeNullStalls=false`,{
            headers: {
              Authorization: `Bearer ${token}`
            }
        });
      // let res = await fetchAllBangles(page);
      if (res && res.data && res.data.data) {
        setListRing(res.data.data);
        setTotalProduct(res.data.totalElements);
        setTotalPage(res.data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching rings:', error);
      toast.error('Failed to fetch rings');
    }
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setselectedJewelry(null);
  };
  const handleDetailClick = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("No token found");
      }
      const res = await axios.get(`https://jssatsproject.azurewebsites.net/api/Product/Search?categoryId=5&searchTerm=${id}&pageIndex=1&pageSize=10`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res && res.data && res.data.data) {
        const details = res.data.data[0];
        setselectedJewelry(details);
        const resDiamond = await axios.get(`https://jssatsproject.azurewebsites.net/api/diamond/getbycode?code=${details.diamondCode}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setselectedDiamond(resDiamond.data.data[0]);

      }
    } catch (error) {
      console.error('Error fetching staff details:', error);
    }
  };
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(value);
  };
  function capitalizeFirstLetter(string) {
    return string.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  const handleSearch = (event) => {
    const searchTerm = event.target.value.trim();
    setSearchTerm(searchTerm);
    if (searchTerm === '') {
      // Nếu searchTerm rỗng thì gọi lại getCustomer với page 1
      getRing(1);
    } else {
      getRingSearch(searchTerm, 1);
    }
  };
  const getRingSearch = async (searchTerm, page) => {
    try {
      const res = await axios.get(
        `https://jssatsproject.azurewebsites.net/api/Product/Search?categoryId=5&searchTerm=${searchTerm}&pageIndex=${page}&pageSize=10&includeNullStalls=false`
      );
      if (res.data && res.data.data) {
        setListRing(res.data.data);
        setTotalProduct(res.data.totalElements);
        setTotalPage(res.data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to fetch customers');
    }
  };


  return (<>
    <div className='h-[70px] mt-5 mb-2 w-full'>
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
      <div className='h-[79vh] overflow-y-auto mt-3 flex-col justify-center mx-auto'>
        <div className='grid grid-cols-4 mt-1 w-fit space-x-2 mx-auto'>
          {listRing && listRing.length > 0 &&
            listRing.filter(item => item.categoryId === 5).map((item, index) => {
              return (
                <div key={`retail-${index}`} class="relative flex flex-col justify-center items-center w-[200px] px-[20px] pb-8 h-[280px] bg-[#fff] shadow-xl rounded-lg mb-2">
                <div className='bg-[#fff] rounded-lg shadow-[#918888] shadow-md'>
                  <img class="mt-2 w-24 h-24 rounded-lg hover:-translate-y-30 duration-700 hover:scale-125" src={item.img} />
                </div>
                  <div class="max-w-sm h-auto">

                    <div class="absolute top-[10px] w-full left-0 p-1 sm:justify-between">
                      <h2 class="text-black text-sm font-normal tracking-widest text-center">{item.name}</h2>
                    </div>
                    <div className='absolute bottom-[50px] right-0 w-full'>
                      <p class="text-sm text-[#de993f] flex justify-center">Code: {item.code}</p>
                      <div class=" flex gap-3 items-center justify-center">
                        <p class="text-[#cc4040] font-bold text-sm">{formatCurrency(item.productValue - (item.productValue * item.discountRate))}</p>
                        <p class="text-[#121212] font-semibold text-sm line-through">{formatCurrency(item.productValue)}</p>
                      </div>
                    </div>
                    <div class="absolute bottom-[-10px] right-0 w-full flex justify-around items-center">
                      <button onClick={() => handleDetailClick(item.code)} class="px-3 bg-[#3b9c7f] p-1 rounded-md text-white font-semibold shadow-md shadow-[#87A89E] hover:ring-2 ring-blue-400 hover:scale-75 duration-500">Details</button>
                      {item.status !== 'inactive' && (
                        <button onClick={() => dispatch(addProduct(item))} class="px-2 border-2 border-white p-1 rounded-md text-white font-semibold shadow-lg shadow-white hover:scale-75 duration-500">Add to Cart</button>
                      )}
                      {item.status == 'inactive' && (
                        <button class="px-2 border-2 bg-[#ff2929] border-white p-1 rounded-md text-white font-semibold shadow-lg shadow-white">Sold out</button>
                      )}                    </div>
                  </div>
                </div>
              )
            })}
        </div>

        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Staff Details"
          className="bg-white rounded-md shadow-lg max-w-md mx-auto"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        >
          {selectedJewelry && (

            <div className="">
              <div className="flex items-center py-2 mb-2 justify-between border-b rounded-t">
                <h3 className="text-md ml-6 font-semibold text-gray-900">
                {selectedJewelry.name} - {selectedJewelry.stalls.name}
                </h3>
                <a className='cursor-pointer text-black text-[24px] py-0' onClick={closeModal} >&times;</a>
              </div>
              <div class="relative overflow-x-auto shadow-md ">
                <table class="w-full text-sm text-left rtl:text-right text-gray-500">
                  <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700">
                    <tr className='hidden'>
                      <th scope="col" class="px-6 py-2">
                        Information
                      </th>
                      <th scope="col" class="px-6 py-2">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                      <td scope="row" class=" px-6 py-2 font-medium whitespace-nowrap dark:text-white">
                        Material Name
                      </td>
                      <td class="px-6 py-2">
                        {selectedJewelry.materialName}
                      </td>
                    </tr>
                    <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                      <td scope="row" class="px-6 py-2 font-medium whitespace-nowrap dark:text-white">
                        Material Weight
                      </td>
                      <td class="px-6 py-2">
                        {selectedJewelry.materialWeight}
                      </td>
                    </tr>
                    <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                      <td scope="row" class="px-6 py-2 font-medium whitespace-nowrap dark:text-white">
                        DiamondCode
                      </td>
                      <td class="px-6 py-2 flex items-center gap-4">
                        {selectedJewelry.diamondCode}
                      </td>
                    </tr>

                    <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                      <td scope="row" class="px-6 py-2 font-medium whitespace-nowrap dark:text-white">
                        Diamond Name
                      </td>
                      <td class="px-6 py-2">
                        {selectedJewelry.diamondName}
                      </td>
                    </tr>
                    {selectedDiamond && (<>
                      <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                        <td scope="row" class="px-6 py-2 font-medium whitespace-nowrap dark:text-white">
                          Shape:
                        </td>
                        <td class="px-6 py-2">
                          {selectedDiamond.shapeName}
                        </td>
                      </tr>
                      <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                        <td scope="row" class="px-6 py-2 font-medium whitespace-nowrap dark:text-white">
                          Origin:
                        </td>
                        <td class="px-6 py-2">
                          {capitalizeFirstLetter(selectedDiamond.originName)}
                        </td>
                      </tr>
                      <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                        <td scope="row" class="px-6 py-2 font-medium whitespace-nowrap dark:text-white">
                          Fluorescence:
                        </td>
                        <td class="px-6 py-2">
                          {capitalizeFirstLetter(selectedDiamond.fluorescenceName)}
                        </td>
                      </tr>
                      <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                        <td scope="row" class="px-6 py-2 font-medium whitespace-nowrap dark:text-white">
                          Color:
                        </td>
                        <td class="px-6 py-2">
                          {capitalizeFirstLetter(selectedDiamond.colorName)}
                        </td>
                      </tr>
                      <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                        <td scope="row" class="px-6 py-2 font-medium whitespace-nowrap dark:text-white">
                          Symmetry:
                        </td>
                        <td class="px-6 py-2">
                          {capitalizeFirstLetter(selectedDiamond.symmetryName)}
                        </td>
                      </tr>
                      <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                        <td scope="row" class="px-6 py-2 font-medium whitespace-nowrap dark:text-white">
                          Polish:
                        </td>
                        <td class="px-6 py-2">
                          {capitalizeFirstLetter(selectedDiamond.polishName)}
                        </td>
                      </tr>
                      <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                        <td scope="row" class="px-6 py-2 font-medium whitespace-nowrap dark:text-white">
                          Cut:
                        </td>
                        <td class="px-6 py-2">
                          {capitalizeFirstLetter(selectedDiamond.cutName)}
                        </td>
                      </tr>
                      <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                        <td scope="row" class="px-6 py-2 font-medium whitespace-nowrap dark:text-white">
                          Clarity:
                        </td>
                        <td class="px-6 py-2">
                          {selectedDiamond.clarityName}
                        </td>
                      </tr>
                      <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                        <td scope="row" class="px-6 py-2 font-medium whitespace-nowrap dark:text-white">
                          Carat:
                        </td>
                        <td class="px-6 py-2">
                          {selectedDiamond.caratWeight}
                        </td>
                      </tr>
                    </>)
                    }
                  </tbody>
                </table>
              </div>
            </div>

          )}
        </Modal>
      </div>
      <ReactPaginate
         onPageChange={handlePageClick}
         pageRangeDisplayed={3}
         marginPagesDisplayed={2}
         pageCount={totalPage}
         pageClassName="mx-1"
         pageLinkClassName="px-3 py-2 rounded hover:bg-gray-200 text-black"
         previousClassName="mx-1"
         previousLinkClassName="px-3 py-2 rounded hover:bg-gray-200"
         nextClassName="mx-1"
         nextLinkClassName="px-3 py-2 rounded hover:bg-gray-200"
         breakLabel="..."
         breakClassName="mx-1 "
         breakLinkClassName="px-3 py-2 text-black rounded hover:bg-gray-200"
         containerClassName="flex justify-center items-center space-x-4 h-[36px]"
         activeClassName="bg-blue-500 text-white rounded-xl"
        renderOnZeroPageCount={null}
        // className="bg-black flex justify-center items-center"
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
  )
}

export default Ring



