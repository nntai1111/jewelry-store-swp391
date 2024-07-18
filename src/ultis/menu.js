import icons from "./icon"
import { MdOutlineScreenshotMonitor } from "react-icons/md";
const { GiNecklaceDisplay, GiDiamondRing, LiaCircleNotchSolid, LiaMoneyBillWaveSolid, IoPeopleSharp , GiEmeraldNecklace, GiStonePile, AiFillGolden , RiVipDiamondFill, FaFileInvoice, CiGift, TbArrowsExchange2, TbLogout2, MdDiamond, GiCrystalEarrings } = icons

export const sidebarMenu = [
    // {
    //     path: 'revenue',
    //     text:'Revenue',
    //     icons: <LiaMoneyBillWaveSolid classname='bg-[#3c26cc] p-[6PX] rounded-lg' size={30} color="white"/>
    // },
    {
        path: 'customer',
        text: 'Customer',
        icons: <IoPeopleSharp  className='bg-[#3c26cc] p-[6px] rounded-lg' size={30} color="white" />
    },
    {
        path: 'jewelry/ring',
        text: 'Jewelry',
        icons: <GiNecklaceDisplay className='bg-[#3c26cc] p-[6PX] rounded-lg' size={30} color="white" />,
        subMenu: [
            {
                path: 'jewelry/ring',
                text: 'Ring',
                icons: <GiDiamondRing  size={20} color="white" />,
            },
            {
                path: 'jewelry/necklace',
                text: 'Necklace',
                icons: <GiEmeraldNecklace  size={20} color="white" />,
            },
            {
                path: 'jewelry/earring',
                text: 'Earring',
                icons: <GiCrystalEarrings size={20} color="white" />,
            },
            {
                path: 'jewelry/bangles',
                text: 'Bangles',
                icons: <LiaCircleNotchSolid  size={20} color="white" />,
            },
        ]
    },
    {
        path: 'wholesaleGold',
        text: 'Wholesale Gold',
        icons: <GiStonePile className='bg-[#3c26cc] p-[6PX] rounded-lg' size={30} color="white" />
    },
    {
        path: 'retailGold',
        text: 'Retail Gold',
        icons: <AiFillGolden  className='bg-[#3c26cc] p-[6PX] rounded-lg' size={30} color="white" />
    },
    {
        path: '',
        text: 'Diamond',
        end: true,
        icons: <RiVipDiamondFill className='bg-[#3c26cc] p-[6PX] rounded-lg' size={30} color="white" />
    },
    {
        path: 'searchInvoice/onprocessSeller',
        text: 'Invoice',
        icons: <FaFileInvoice className='bg-[#3c26cc] p-[6PX] rounded-lg' size={30} color="white" />
    },
 
    {

        path: 'purchase/buyIn',
        text:'Purchase',
        icons: <TbArrowsExchange2 className='bg-[#3c26cc] p-[6PX] rounded-lg' size={30} color="white"/>,
      

    },
    {

        path: 'screengold',
        text:'Screen Gold',
        icons: <MdOutlineScreenshotMonitor className='bg-[#3c26cc] p-[6PX] rounded-lg' size={30} color="white"/>,
      

    },
    {
        path: '/login',
        text: 'Log out',
        icons: <TbLogout2 className='bg-[#3c26cc] p-[6PX] rounded-lg' size={30} color="white" />
    },

]