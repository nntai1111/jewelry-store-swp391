import rootReducer from "./store/reducers/rootReducer";
import {createStore, applyMiddleware} from "redux";
import {thunk} from 'redux-thunk' 

const reduxConfig = () => {

    const store = createStore(rootReducer, applyMiddleware(thunk)) // nếu không có thunk thì action chỉ trả về 1 object thuần không trả về 1 cái hàm đc sau đó dùng hàm để gọi API
   
    return store
}
export default reduxConfig