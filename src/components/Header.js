import React from 'react'
import icons from '../ultis/icon'
import Search from './Search'

const { IoIosArrowRoundForward, IoIosArrowRoundBack } = icons
const Header = () => {
    return (
        <div className='flex justify-between gap-40 w-full items-center'>
            <div className=' flex gap-5 w-full items-center'>
                <div className='flex gap-3 text-[#c4ced2]'>
                    <span><IoIosArrowRoundBack size={30} /></span>
                    <span><IoIosArrowRoundForward size={30} /></span>
                </div>
                <div className='w-3/4'>
                    <Search />
                </div>
            </div>

        </div>
    )
}

export default Header