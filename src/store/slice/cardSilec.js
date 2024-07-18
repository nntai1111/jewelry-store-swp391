import { createSlice } from '@reduxjs/toolkit';

export const productSlice = createSlice({
    name: 'products',
    initialState: {
        Rate:null,
        CartArr: [],
        CusPoint:null, 
        CartWholesale: [], 
        CartPromotion: [], 
        CartProductBuy: [],
        CartCustomerBuy: null, 
        CartCodeOrder:null,
        products: [] ,
        customerPhoneNumber: '',
        staffId: null,
        createDate: '',
        description: '',
    },
    reducers: {
        // Add product to products list non com
        addProductToList: (state, action) => {
            state.products.push(action.payload);
        },
        // Remove product from products list non com
        removeProductFromList: (state, action) => {
            state.products = state.products.filter((product, index) => index !== action.payload);
        },
         // Clear customer information
         clearCustomerInfo: (state) => {
            state.customerPhoneNumber = '';
            state.staffId = null;
            state.createDate = '';
            state.description = '';
        },
        clearProductList: (state) => {
            state.products = [];
          },
        //Add Rate
        addRate: (state, action) => {
            state.Rate = action.payload;
        },
        //Add code order
        addCodeOrder: (state, action) => {
            state.CartCodeOrder = action.payload;
        },
        // Del code order
        deleteCodeOrder: (state) => {
            state.CartCodeOrder = null;
        },
        //add product buy
        addProductBuy: (state, action) => {
            const productIndex = state.CartProductBuy.findIndex(p => p.code === action.payload.code);
            if (productIndex === -1) {
                state.CartProductBuy.push({ ...action.payload, quantity: 1 });
            } 
        },
        deleteProductBuy: (state, action) => {
            state.CartProductBuy = state.CartProductBuy.filter(item => item.code !== action.payload.code);
        },
        deleteProductBuyAll: (state) => {
            state.CartProductBuy = [];
        },
        // Add product to main cart
        addProduct: (state, action) => {
            const productIndex = state.CartArr.findIndex(p => p.id === action.payload.id);
            if (productIndex === -1) {
                state.CartArr.push({ ...action.payload, quantity: 1 });
            } else {
                if (action.payload.categoryId === 6) {
                    state.CartArr[productIndex].quantity += 1;
                }
            }
        },
        deleteProduct: (state, action) => {
            const productIndex = state.CartArr.findIndex(p => p.id === action.payload.id);
            if (productIndex !== -1) {
                if (state.CartArr[productIndex].quantity > 1) {
                    state.CartArr[productIndex].quantity -= 1;
                } else {
                    state.CartArr = state.CartArr.filter(item => item.id !== action.payload.id);
                }
            }
        },
        //Add customer
        addCustomer: (state, action) => {
            state.CusPoint = action.payload;
        },
        // Delete customer
        deleteCustomer: (state) => {
            state.CusPoint = null;
        },
        // Clear all products from the main cart
        deleteProductAll: (state) => {
            state.CartArr = [];
        },
        // Add promotion to cart
        addPromotion: (state, action) => {
            const promotionIndex = state.CartPromotion.findIndex(p => p.id === action.payload.id);
            if (promotionIndex === -1) {
                state.CartPromotion.push({ ...action.payload, quantity: 1 });
            }
        },
        deletePromotion: (state, action) => {
            state.CartPromotion = state.CartPromotion.filter(item => item.id !== action.payload.id);
        },
    },
});


export const {
    clearProductList,
    clearCustomerInfo,
    addProductToList,
    removeProductFromList,
    addRate,
    addCodeOrder,
    deleteCodeOrder,
    deleteProductBuyAll,
    addProductBuy,
    deleteProductBuy,
    addCustomer,
    deleteCustomer,
    addProduct,
    deleteProduct,
    deleteProductAll,
    addPromotion,
    deletePromotion,
} = productSlice.actions;

export default productSlice.reducer;
