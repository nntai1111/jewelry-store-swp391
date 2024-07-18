import appReducer from "./appReducer";
import { combineReducers } from "redux"; //gom các reducer thành 1, sử dụng các midware cho redux

const rootReducer = combineReducers({
    app:appReducer, //key value
})

export default rootReducer