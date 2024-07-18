import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { MdDeleteOutline } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { addCodeOrder, addCustomer, addProductBuy, addProductToList, clearCustomerInfo, clearProductList, removeProductFromList } from '../../store/slice/cardSilec';

const BuyOut = () => {
  const dispatch = useDispatch()
  const ProductListNone = useSelector(state => state.cart.products)
  const [InvoiceCode, setInvoiceCode] = useState('');
  const [ListInvoice, setListInvoice] = useState(null); // Initialize as null
  const [selectedProduct, setSelectedProduct] = useState(null); // State to store selected product
  const [CustomerPhone, setCustomerPhone] = useState('')
  const [ListInforCustomer, setListInforCustomer] = useState(null)

  const [productName, setProductName] = useState('');
  const [diamondGradingCode, setDiamondGradingCode] = useState('');
  const [materialId, setMaterialId] = useState([]);
  const [materialWeight, setMaterialWeight] = useState('');
  const [categoryTypeId, setCategoryTypeId] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleAddProduct = () => {
    const newProduct = {
      productName,
      diamondGradingCode,
      materialId: materialId ? parseInt(materialId) : null,
      materialWeight: materialWeight ? parseFloat(materialWeight) : null,
      categoryTypeId: parseInt(categoryTypeId),
      buyPrice: parseFloat(buyPrice),
      quantity: parseInt(quantity)
    };
    dispatch(addProductToList(newProduct));
    // Reset form fields
    setProductName('');
    setDiamondGradingCode('');
    setMaterialId('');
    setMaterialWeight('');
    setCategoryTypeId('');
    setBuyPrice('');
    setQuantity('');
  };
  useEffect(() => {
    MaterialID();
  }, []);
  const [materials, setMaterials] = useState([]);

  const MaterialID = async () => {
    try {
      const res = await axios.get('https://jssatsproject.azurewebsites.net/api/Material/getall');
      setMaterials(res.data.data); // Store fetched data in the state
    } catch (error) {
      console.error('Error fetching material:', error);
      toast.error('Error fetching material');
    }
  };

  useEffect(() => {
    CategotyID();
  }, []);
  const [category, setCategory] = useState([]);

  const CategotyID = async () => {
    try {
      const res = await axios.get('https://jssatsproject.azurewebsites.net/api/productcategory/getall');
      setCategory(res.data.data); // Store fetched data in the state
    } catch (error) {
      console.error('Error fetching material:', error);
      toast.error('Error fetching material');
    }
  };
  
  
  useEffect(() => {
    console.log('ListInvoice state updated:', ListInvoice); // Add logging
  }, [ListInvoice]);


  const getCustormer = async () => {
    // event.preventDefault();
    try {
      const res = await axios.get(
        `https://jssatsproject.azurewebsites.net/api/Customer/Search?searchTerm=${CustomerPhone}&pageIndex=1&pageSize=10`
      );
      const item = res.data.data[0];
      setListInforCustomer(item)
      dispatch(addCustomer(item));

    } catch (error) {
      console.error('Error fetching customer or products:', error);
    }
  }
  const [staffId, setStaffId] = useState(0)
  const [description, setDescription] = useState('')
  const handleCreateOrder = async () => {
    const invalidProducts = ProductListNone.filter(product => !product.productName || product.buyPrice == null);
    if (invalidProducts.length > 0) {
      toast.error('Some products have missing name or price. Please check and correct the entries.');
      return;
    }
    const orderData = {
      customerPhoneNumber: CustomerPhone,
      staffId: 4,
      createDate: new Date().toISOString(),
      description,
      products: ProductListNone
    };
    console.log(orderData)
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
    
       await axios.post('https://jssatsproject.azurewebsites.net/api/BuyOrder/CreateNonCompanyOrder', 
        orderData, 
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setListInforCustomer(null); setInvoiceCode('');
      setCustomerPhone('');
      setDescription('')
      dispatch(clearCustomerInfo());
      dispatch(clearProductList())
      toast.success('Order created successfully!');
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to create order.');
    }
  };

  return (
    <div className='w-full'>
      <div className='w-full h-fit flex justify-evenly'>
        <div className="max-w-full w-full rounded-3xl flex flex-col py-6 px-6 bg-[#fefffe] bg-clip-padding backdrop-filter backdrop-blur-lg border border-gray-100 text-gray-100 drop-shadow-lg">

          <div className="flex items-center gap-2">
            <h2 className="text-xl text-black">Create Buy Product Non Company</h2>
            <p className='cursor-pointer mr-3 p-2 rounded bg-[#edebeb]' onClick={() => { setListInforCustomer(null); setInvoiceCode(''); setDescription('') }}>
              <MdDeleteOutline size='17px' color='#ef4e4e' />
            </p>
          </div>

          <div className="flex py-4 gap-2.5">
            <div className="w-12/12 h-14 flex rounded-lg border-2 border-solid border-[#211758b4]  items-center">
              <input
                value={CustomerPhone}
                onChange={(event) => setCustomerPhone(event.target.value)}
                placeholder="Customer PhoneNumber"
                type="text"
                className="w-9/12 h-14 px-4 bg-transparent focus:outline-none text-black"
              />
              <div className="text-gray-600 cursor-pointer flex items-center w-3/12 px-4 bg-transparent appearance-none border-l-2 border-gray-500 h-5/6 focus:outline-none text-lg">
                <span onClick={getCustormer} className='hover:scale-75 duration-500'>Check</span>
              </div>
            </div>


            {ListInforCustomer && (
              <>
                <div className="w-12/12 h-14 flex rounded-lg border-2 border-solid border-gray-100 items-center">
                  <input
                    value={ListInforCustomer.firstname + ' ' + ListInforCustomer.lastname}
                    placeholder="Customer Name"
                    className="w-9/12 h-14 px-4 bg-transparent focus:outline-none text-black"
                    readOnly
                  />
                </div>
                <div className="w-12/12 h-14 flex rounded-lg border-2 border-solid border-gray-100 items-center">
                  <input
                    value={ListInforCustomer.gender}
                    placeholder="Gender"
                    className="w-fit h-14 px-4 bg-transparent focus:outline-none text-black"
                    readOnly
                  />
                </div>
                <div className="w-12/12 h-14 flex rounded-lg border-2 border-solid border-gray-100 items-center">
                  <input
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Description"
                    className="w-12/12 h-14 px-4 bg-transparent focus:outline-none text-black"
                  />
                </div>

                <div className="w-12/12 h-14 flex rounded-lg justify-center items-center">
                  <button onClick={handleCreateOrder} className='w-full mx-6 bg-[#309c6a]' type="submit">Create Order</button>
                </div>
              </>
            )}
          </div>

          <h2 className="text-xl text-black mb-2">Create Product</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleAddProduct(); }}
            className='grid grid-cols-4'
          >
            <div className="w-11/12 px-2 mb-2 h-14 flex rounded-lg border-2 border-solid border-[#211758b4] items-center">
              <input
                className="w-full h-14 text-center bg-transparent focus:outline-none text-black"
                type="text"
                placeholder="Product Name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
              />
            </div>
            <div className="w-11/12 px-2 h-14 flex rounded-lg border-2 border-solid border-[#211758b4]  items-center">
              <input
                className="w-full h-14 text-center bg-transparent focus:outline-none text-black"
                type="text"
                placeholder="Diamond Grading Code"
                value={diamondGradingCode}
                onChange={(e) => setDiamondGradingCode(e.target.value)}
              />
            </div>
            <div className="w-11/12 h-14 flex rounded-lg border-2 border-solid border-[#211758b4] items-center px-2">
              <select
                className="w-full h-14 text-center bg-transparent focus:outline-none text-black"
                value={materialId}
                onChange={(e) => setMaterialId(e.target.value)}
                required
              >
                <option value="" disabled>Select Material</option>
                {materials.map((material) => (
                  <option key={material.id} value={material.id}>{material.name}</option>
                ))}
              </select>
            </div>
            <div className="w-11/12 px-2 h-14 flex rounded-lg border-2 border-solid border-[#211758b4]  items-center">
              <input
                className="w-full h-14 text-center bg-transparent focus:outline-none text-black"
                type="number"
                placeholder="Material Weight"
                value={materialWeight}
                onChange={(e) => setMaterialWeight(e.target.value)}
              />
            </div>
            <div className="w-11/12 h-14 flex rounded-lg border-2 border-solid border-[#211758b4] items-center px-2">
              <select
                className="w-full h-14 text-center bg-transparent focus:outline-none text-black"
                value={categoryTypeId}
                onChange={(e) => setCategoryTypeId(e.target.value)}
                required
              >
                <option value="" disabled>Select Category</option>
                {category.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            <div className="w-11/12 px-2 h-14 flex rounded-lg border-2 border-solid border-[#211758b4]  items-center">
              <input
                className="w-full h-14 text-center bg-transparent focus:outline-none text-black"
                type="number"
                placeholder="Buy Price"
                value={buyPrice}
                onChange={(e) => setBuyPrice(e.target.value)}
                required
              />
            </div>
            <div className="w-11/12 px-2 h-14 flex rounded-lg border-2 border-solid border-[#211758b4]  items-center">
              <input
                className="w-full h-14 text-center bg-transparent focus:outline-none text-black"
                type="number"
                min ={1}
                
                placeholder="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>
            <div className="w-11/12  h-14 flex rounded-lg justify-center  items-center">
              <button className='m-0' type="submit">Add Product</button>
            </div>
          </form>

          <div class="inline-block min-w-full p-0 mt-4">
            <div class="overflow-hidden">
              <table class="min-w-full text-left text-sm font-light text-surface dark:text-white">
                <thead class="border-b border-neutral-200 font-medium dark:border-white/10">
                  <tr class="text-center text-black bg-gray-300">
                    <th scope="col" class="px-4 py-2">Name</th>
                    <th scope="col" class="px-4 py-2">Diamond Grading Code</th>
                    <th scope="col" class="px-4 py-2">Material Id</th>
                    <th scope="col" class="px-4 py-2">Material Weight</th>
                    <th scope="col" class="px-4 py-2">Category Type Id</th>
                    <th scope="col" class="px-4 py-2">Buy Price</th>
                    <th scope="col" class="px-4 py-2">Quantity</th>
                    <th scope="col" class="px-4 py-2">Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {ProductListNone && ProductListNone.map((product, index) => (
                    <tr key={index} class="border-b text-gray-600 text-center border-neutral-200 transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-white/10 dark:hover:bg-neutral-600">
                      <td class="whitespace-nowrap px-4 py-2 font-medium">{product.productName}</td>
                      <td class="whitespace-nowrap px-4 py-2">{product.diamondGradingCode}</td>
                      <td class="whitespace-nowrap px-4 py-2">{product.materialId}</td>
                      <td class="whitespace-nowrap px-4 py-2 text-center">{product.materialWeight}</td>
                      <td class="whitespace-nowrap px-4 py-2">{product.categoryTypeId}</td>
                      <td class="whitespace-nowrap px-4 py-2 text-center">{product.buyPrice}</td>
                      <td class="whitespace-nowrap px-4 py-2">{product.quantity}</td>
                      <td class="whitespace-nowrap px-4 py-2">
                        <button className='bg-white' onClick={() => dispatch(removeProductFromList(index))}><MdDeleteOutline color='red' /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default BuyOut