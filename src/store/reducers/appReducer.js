import actionType from "../actions/actionTypes";
//giá trị khởi tạo để reducer tránh bị lỗi , để bỏ api
const initState = {
    homeData: [],
    test:'Hello 123'
}   

const appReducer = (state = initState, action) => {
    switch (action.type) {
        case actionType.GET_HOME:
            return state
            
    
        default:
            return state
    }
}
export default appReducer