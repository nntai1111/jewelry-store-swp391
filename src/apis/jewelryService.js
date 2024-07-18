import axios from "axios"


const loginApi = (email, password) => {
    return axios.post("https://reqresproject.in/api/login", { email, password });

}
const fetchAllCustomer = (page) => {
    return axios.get(`https://jssatsproject.azurewebsites.net/api/Customer/GetAll?pageIndex=${page}`);
}
const fetchAllRing = (page) => {
    return axios.get(`https://jssatsproject.azurewebsites.net/api/product/getall?categoryID=1&pageIndex=${page}&pageSize=12&ascending=true&includeNullStalls=false`);
}
const fetchAllEarring = (page) => {
     return axios.get(`https://jssatsproject.azurewebsites.net/api/product/getall?categoryID=2&pageIndex=${page}&pageSize=12&ascending=true&includeNullStalls=false`);
}
const fetchAllBangles = (page) => {
     return axios.get(`https://jssatsproject.azurewebsites.net/api/product/getall?categoryID=3&pageIndex=${page}&pageSize=12&ascending=true&includeNullStalls=false`);
}
const fetchAllNecklace = (page) => {
    return axios.get(`https://jssatsproject.azurewebsites.net/api/product/getall?categoryID=4&pageIndex=${page}&pageSize=12&ascending=true&includeNullStalls=false`);
}
const fetchAllReGold = (page) => {
     return axios.get(`https://jssatsproject.azurewebsites.net/api/product/getall?categoryID=5&pageIndex=${page}&pageSize=12&ascending=true&includeNullStalls=false`);
}
const fetchAllWhGold = (page) => {
     return axios.get(`https://jssatsproject.azurewebsites.net/api/product/getall?categoryID=6&pageIndex=${page}&pageSize=12&ascending=true&includeNullStalls=false`);
}
const fetchAllDiamond = (page) => {
     return axios.get(`https://jssatsproject.azurewebsites.net/api/product/getall?categoryID=7&pageIndex=${page}&pageSize=12&ascending=true&includeNullStalls=false`);
}
const fetchStatusInvoice = (st,page) => {
    return axios.get(`https://jssatsproject.azurewebsites.net/api/sellorder/getall?statusList=${st}&ascending=true&pageIndex=${page}&pageSize=10`);
}
const fetchStatusBuyInvoice = (st,page) => {
    return axios.get(`https://jssatsproject.azurewebsites.net/api/Buyorder/getall?statusList=${st}&ascending=true&pageIndex=${page}&pageSize=10`);
}
const fetchDoubleStatusInvoice = (st1,st2,page) => {
    return axios.get(`https://jssatsproject.azurewebsites.net/api/sellorder/getall?statusList=${st1}&statusList=${st2}&ascending=true&pageIndex=${page}&pageSize=10`);
}
const fetchAllDiamondTest = () => {
    // return axios.get("https://jssatsproject.azurewebsites.net/api/Diamond/GetByCode?code=DIA001");
}
const fetchAllPromotion = () => {
    // return axios.get("https://jssatsproject.azurewebsites.net/api/Promotion/GetAll");

}
const fetchAllInvoice = () => {
    return axios.get("https://reqres.in/api/users?page=1");
}


const fetchAllProduct = () => {
    // return axios.get("https://jssatsproject.azurewebsites.net/api/product/getall");
}
const fetchPaymentMethod = () =>{
    return axios.get("https://jssatsproject.azurewebsites.net/api/PaymentMethod/Getall");
}
export {fetchStatusBuyInvoice,fetchDoubleStatusInvoice,fetchStatusInvoice,fetchPaymentMethod,fetchAllProduct,fetchAllDiamondTest,fetchAllReGold,fetchAllWhGold,fetchAllRing,fetchAllEarring,fetchAllNecklace,fetchAllBangles,fetchAllPromotion,fetchAllInvoice,fetchAllCustomer,loginApi,fetchAllDiamond};


