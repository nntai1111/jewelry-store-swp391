import icons from "../icon"
import { BsCashCoin } from "react-icons/bs";
const {GiReceiveMoney,BsCartPlus,BsCartCheck,BsCart3,TbLogout2} = icons

export const sidebarMenuCashier = [
    {
        path: 'cs_order/cs_waitingPayment',
        text: 'Order',
        icons: <BsCart3  size={24} color="white" />,
    },
    {
        path: 'cs_buyProduct/cs_onprocessBuy',
        text: 'Buy Product',
        icons: <BsCashCoin size={24} color="white" />
    },
    // {
    //     path: 'cs_bill',
    //     text: 'Bill For Invoice',
    //     icons: <GiReceiveMoney size={24} color="white" />
    // },
    {
        path: '/login',
        text: 'Log out',
        icons: <TbLogout2 size={24} color="white" />
    },
]