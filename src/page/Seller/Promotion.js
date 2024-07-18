import React, { useEffect, useState } from 'react'
import { fetchAllPromotion } from '../../apis/jewelryService'
import { useDispatch } from 'react-redux'
import { addPromotion } from '../../store/slice/cardSilec'
import Popup from 'reactjs-popup';
const Promotion = () => {

  const dispatch = useDispatch()
  const [listPromotion, setListPromotion] = useState([])
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getPromotion();
  }, [])

  const getPromotion = async () => {
    let res = await fetchAllPromotion();
    if (res && res.data && res.data.data) {
      setListPromotion(res.data.data)
      console.log(res)
    }
  }
  const filteredPromotion = listPromotion.filter((promotion) =>
  (promotion.id.toString().includes(searchTerm) ||
    promotion.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  return (<>
    <div className='h-[70px] px-[30px] mt-5 mb-2 w-full'>
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

      <div className='h-[80vh] mt-10 flex justify-center'>
        <div className="w-[800px] overflow-y-auto">
          <table className="font-inter w-full table-auto border-separate border-spacing-y-1 overflow-y-scroll text-left md:overflow-auto">
            <thead className="w-full rounded-lg bg-[#222E3A]/[6%] text-base font-semibold text-white">
              <tr className="">
                <th className="whitespace-nowrap rounded-l-lg py-3 pl-3 text-sm font-normal text-[#212B36]">Promotion ID</th>
                <th className="whitespace-nowrap py-3 pl-1 text-sm font-normal text-[#212B36]">Promotion</th>
                <th className="whitespace-nowrap py-3 text-sm font-normal text-[#212B36]">Start Date</th>
                <th className="whitespace-nowrap py-3 text-sm font-normal text-[#212B36]">Expiration Date</th>
                <th className="whitespace-nowrap py-3 text-sm font-normal text-[#212B36]">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPromotion.map((item, index) => {
                return (
                  <tr
                    key={index}
                    className="cursor-pointer bg-[#f6f8fa] drop-shadow-[0_0_10px_rgba(34,46,58,0.02)] hover:shadow-2xl"
                  >
                    <td className="rounded-l-lg text-sm font-normal text-[#637381] flex justify-center py-4">{item.id}</td>
                    <td className=" text-sm font-normal text-[#637381]">{item.name}</td>
                    <td className=" text-sm font-normal text-[#637381]">{item.startDate}</td>
                    <td className=" text-sm font-normal text-[#637381]">{item.endDate}</td>
                    <td className=" text-sm font-normal text-[#637381]">
                      <Popup trigger={<button
                        className="my-2 mx-0 border border-white bg-[#4741b1d7] text-white rounded-md transition duration-200 ease-in-out hover:bg-[#1d3279] active:bg-[#4741b174] focus:outline-none"
                      >
                        Information
                      </button>} position="right center">
                        {close => (
                          <div className='fixed top-0 bottom-0 left-0 right-0 bg-[#6f85ab61] overflow-y-auto'>
                            <div className='bg-[#fff] my-[70px] mx-auto rounded-md w-[40%] shadow-[#b6b0b0] shadow-md'>
                              <div className="flex items-center justify-between p-2 md:p-5 border-b rounded-t dark:border-gray-600">
                                <h3 className="text-md font-semibold text-gray-900">
                                  {item.name}
                                </h3>
                                <a className='cursor-pointer text-black text-[24px] py-0' onClick={close}>&times;</a>
                              </div>
                              <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                              <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                <th scope="col" class="px-6 py-2">
                                        ID
                                  </th>
                                <th scope="col" class="px-6 py-2">
                                        Product Apply
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                              <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                      <td scope="row" class=" px-6 py-2 font-medium whitespace-nowrap dark:text-white">
                                        {/* {item.categories} */}
                                      </td>
                                      <td class="px-6 py-2">
                                        {/* {item.categories.name} */}
                                      </td>
                                    </tr>
                              </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </Popup>
                    </td>
                  </tr>
                )
              })}


            </tbody>
          </table>
        </div>
      </div>
    </div>
  </>
  )
}

export default Promotion