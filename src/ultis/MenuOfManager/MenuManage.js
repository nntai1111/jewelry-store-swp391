import IconManager from "./IconManager"

const { GrDocumentStore,
    FaChartSimple,
    TbReportSearch,
    MdManageAccounts,
    CiGift,
    MdOutlineAssignmentReturned,
    TbDeviceIpadCancel,
    RiAccountPinCircleFill,
    BiLogOut,
    FaChevronDown,
    IoMdArrowDropdown,
    IoMdArrowDropup,
    TbFileInvoice,
    CgUserList,
    LiaFileInvoiceDollarSolid,
    GrUserManager,
    MdOutlineManageAccounts,
    GiStonePile,
    LiaGiftsSolid,
    VscGitPullRequestGoToChanges,
    GiGoldNuggets,
    GiReceiveMoney, GiEmeraldNecklace, GiCrystalEarrings, GiDiamondRing, GiNecklaceDisplay, AiOutlineGold,
    LiaMoneyBillWaveSolid, LiaCircleNotchSolid, IoDiamondOutline, PiDiamondsFourLight, MdWarehouse, MdOutlinePriceChange, FaMoneyBillTrendUp, TbBasketDiscount, GiStoneBlock, MdOutlinePayments, RiCopperDiamondLine } = IconManager

export const sidebarMenuManager = [
    {
        path: 'Dashboard',
        text: 'Dashboard',
        iconAdmin: <FaChartSimple size={24} color="#000055" />
    },
    {
        // path: 'materialPrice',

        text: 'Material Price',
        iconAdmin: <MdOutlinePriceChange size={24} color="#000055" />,
        iconAdmin2: <IoMdArrowDropdown size={24} color="#000055" />,
        iconAdmin3: <IoMdArrowDropup size={24} color="#000055" />,
        subMenu: [
            {
                path: 'diamondPrice',
                text: 'Diamond Price',
                iconAdmin: <RiCopperDiamondLine size={24} color="#000055" />,
            },
            {
                path: 'price',
                text: 'Price',
                iconAdmin: <FaMoneyBillTrendUp size={24} color="#000055" />,
            },
            {
                path: 'material',
                text: 'Material',
                iconAdmin: <GiStoneBlock size={24} color="#000055" />,
            },
        ]
    },
    {
        // path: 'productManager',

        text: 'Product',
        iconAdmin: <GiStonePile size={24} color="#000055" />,
        iconAdmin2: <IoMdArrowDropdown size={24} color="#000055" />,
        iconAdmin3: <IoMdArrowDropup size={24} color="#000055" />,
        subMenu: [
            {
                path: 'diamond',
                text: 'Diamond',
                iconAdmin: <IoDiamondOutline size={24} color="#000055" />,
            },
            {
                path: 'jewelry',
                text: 'Jewelry',
                iconAdmin: <GiDiamondRing size={24} color="#000055" />,
            },
            {
                path: 'rgold',
                text: 'Retail Gold',
                iconAdmin: <PiDiamondsFourLight size={24} color="#000055" />,
            },
            {
                path: 'wholesalegold',
                text: 'Wholesale Gold',
                iconAdmin: <AiOutlineGold size={24} color="#000055" />,
            },
        ]
    },
    {
        // path: 'warehouseManager',

        text: 'Warehouse',
        iconAdmin: <MdWarehouse size={24} color="#000055" />,
        iconAdmin2: <IoMdArrowDropdown size={24} color="#000055" />,
        iconAdmin3: <IoMdArrowDropup size={24} color="#000055" />,
        subMenu: [
            {
                path: 'diamondWarehouse',
                text: 'Diamond',
                iconAdmin: <IoDiamondOutline size={24} color="#000055" />,
            },
            {
                path: 'jewelryWarehouse',
                text: 'Jewelry',
                iconAdmin: <GiDiamondRing size={24} color="#000055" />,
            },
            {
                path: 'rgoldWarehouse',
                text: 'Retail Gold',
                iconAdmin: <PiDiamondsFourLight size={24} color="#000055" />,
            },
            {
                path: 'wholesalegoldWarehouse',
                text: 'Wholesale Gold',
                iconAdmin: <AiOutlineGold size={24} color="#000055" />,
            },
        ]
    },

    {
        // path: 'Report',
        text: 'Report',
        iconAdmin: <TbReportSearch size={24} color="#000055" />,
        iconAdmin2: <IoMdArrowDropdown size={24} color="#000055" />,
        iconAdmin3: <IoMdArrowDropup size={24} color="#000055" />,
        subMenu: [
            {
                path: 'sellOrder',
                text: 'Sell Order',
                iconAdmin: <TbFileInvoice size={24} color="#000055" />
            },
            {
                path: 'buyOrder',
                text: 'Buy Order',
                iconAdmin: <TbFileInvoice size={24} color="#000055" />
            },
            {
                path: 'Payment',
                text: ' Payment',
                iconAdmin: <MdOutlinePayments size={24} color="#000055" />
            },
            {
                path: 'Employee',
                text: 'Employee',
                iconAdmin: <CgUserList size={24} color="#000055" />
            },
            {
                path: 'Stall',
                text: 'Stall',
                iconAdmin: <GrDocumentStore size={24} color="#000055" />
            }

        ],

    },
    {
        // path: 'Manage',
        text: 'Manage',
        iconAdmin: <MdManageAccounts size={24} color="#000055" />,
        iconAdmin2: <IoMdArrowDropdown size={24} color="#000055" />,
        iconAdmin3: <IoMdArrowDropup size={24} color="#000055" />,
        subMenu: [
            // {
            //     path: 'productMana',
            //     text: 'Product',
            //     iconAdmin: <GiStonePile size={24} color="#000055" />
            // },
            {
                path: 'customerMana',
                text: 'Customer',
                iconAdmin: <GrUserManager size={24} color="#000055" />
            },
            // {
            //     path: 'point',
            //     text: 'Point of customer',
            //     iconAdmin: <GiGoldNuggets size={24} color="#000055" />
            // },
            {
                path: 'staff',
                text: 'Staff',
                iconAdmin: <MdOutlineManageAccounts size={24} color="#000055" />
            }

        ],
    },
    {
        // path: 'Promotionmanager',
        text: 'Promotion',
        iconAdmin: <CiGift size={24} color="#000055" />,
        iconAdmin2: <IoMdArrowDropdown size={24} color="#000055" />,
        iconAdmin3: <IoMdArrowDropup size={24} color="#000055" />,
        subMenu: [
            {
                path: 'promotionlist',
                text: 'Promotion list',
                iconAdmin: <LiaGiftsSolid size={24} color="#000055" />
            },
            {
                path: 'promotionrequest',
                text: 'History Request',
                iconAdmin: <VscGitPullRequestGoToChanges size={24} color="#000055" />
            }
        ],
    },
    {
        path: 'specialDiscount',
        text: 'Special Discount',
        iconAdmin: <TbBasketDiscount size={24} color="#000055" />
    },
    {
        path: 'ReturnPolicy',
        text: 'Return policy',
        iconAdmin: <MdOutlineAssignmentReturned size={24} color="#000055" />
    },

]