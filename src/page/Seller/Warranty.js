import React from 'react'
import styles from '../../style/cardForList.module.css'
import clsx from 'clsx'
const Warranty = () => {

    return (<>

        <div className=''>
            <div className='flex flex-col gap-4 '>
                <h1 className='flex justify-center mt-20 text-[40px] font-medium text-[#1b2b72ee]'>Warranty and exchange policy</h1>
                <a href='#popupRE' id='openPopUp' className=' text-black rounded-lg text-sm px-5 py-2.5 text-center border border-black'>
                    48H EXCHANGE
                </a>
                <a href='#popupRE1' id='openPopUp' className=' text-black  rounded-lg text-sm px-5 py-2.5 text-center border border-black'>
                    AFTER 48H EXCHANGE
                </a>
                <a href='#popupRE2' id='openPopUp' className=' text-black rounded-lg text-sm px-5 py-2.5 text-center border border-black'>
                    PURCHASE
                </a>
                {/* <a href='#popupRE3' id='openPopUp' className=' text-black rounded-lg text-sm px-5 py-2.5 text-center border border-black'>
                    REFUND POLICY
                </a> */}
            </div>
        </div>

        <div id="popupRE" className={clsx(styles.overlay)}>
            <div className={clsx(styles.popup)}>
                <a className={clsx(styles.close)} href='#'>&times;</a>
                <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                        48H EXCHANGE
                    </h3>
                </div>

                <div class="p-4 md:p-5 space-y-4">
                    <h3 className='font-medium'>I/ Time and conditions for applying 48H exchange:</h3>
                    <div className='grid grid-cols-5 border border-blue-900'>
                        <div className='col-span-1 flex justify-center border border-blue-900 border-r-white bg-blue-800 text-white'>Condition</div>
                        <div className='col-span-4 flex justify-center border border-blue-900 bg-blue-800 text-white'>Applies to products</div>
                        <div className='text-base leading-relaxed text-gray-600 col-span-1 flex justify-center border border-blue-900'>Time</div>
                        <div className='text-base leading-relaxed text-gray-600 col-span-4 px-4 border border-blue-900'><span className='font-medium text-black'>Purchased at the store: </span>counted from the time the store issues the invoice to the customer.</div>
                    </div>
                    <h3 className='font-medium'>II/ Exchangeable product lines::</h3>
                    <div className='grid grid-cols-5 border border-blue-900'>
                        <div className='col-span-5 flex justify-center border border-blue-900 bg-blue-800 text-white'>48H EXCHANGE</div>
                        <div className='text-base leading-relaxed text-gray-600 col-span-1 flex justify-center border border-blue-900'>All Product</div>
                        <div className='text-base leading-relaxed text-gray-600 col-span-4 px-4 border border-blue-900'><span className='font-medium text-black'>The new item is of higher value or equal to the old item:</span> the store will refund 100% of the original invoice value</div>
                    </div>
                </div>
            </div>
        </div>
        <div id="popupRE1" className={clsx(styles.overlay)}>
            <div className={clsx(styles.popup)}>
                <a className={clsx(styles.close)} href='#'>&times;</a>
                <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                        AFTER 48H EXCHANGE
                    </h3>
                </div>

                <div class="p-4 md:p-5 space-y-4">
                    <h3 className='font-medium'>I/ Time and conditions for applying after 48H exchange:</h3>
                    <div className='grid grid-cols-5 border border-blue-900'>
                        <div className='col-span-1 flex justify-center border border-blue-900 border-r-white bg-blue-800 text-white'>Condition</div>
                        <div className='col-span-4 flex justify-center border border-blue-900 bg-blue-800 text-white'>Applies to products</div>
                        <div className='text-base leading-relaxed text-gray-600 col-span-1 flex justify-center border border-blue-900'>Time</div>
                        <div className='text-base leading-relaxed text-gray-600 col-span-4 px-4 border border-blue-900'><span className='font-medium text-black'>Purchased at the store: </span>counted from the time the store issues the invoice to the customer.</div>
                    </div>
                    <h3 className='font-medium'>II/ Exchangeable product lines::</h3>
                    <div className='grid grid-cols-5 border border-blue-900'>
                        <div className='col-span-5 flex justify-center border border-blue-900 bg-blue-800 text-white'>AFTER 48H EXCHANGE</div>
                        <div className='text-base leading-relaxed text-gray-600 col-span-1 flex justify-center border border-blue-900'>All Product</div>
                        <div className='text-base leading-relaxed text-gray-600 col-span-4 px-4 border border-blue-900'><span className='font-medium text-black'>The new item is of higher value or equal to the old item:</span> the store will refund 70% of the original invoice value</div>
                    </div>
                </div>
            </div>
        </div>
        <div id="popupRE2" className={clsx(styles.overlay)}>
            <div className={clsx(styles.popup)}>
                <a className={clsx(styles.close)} href='#'>&times;</a>
                <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                        PURCHASE
                    </h3>
                </div>

                <div class="p-4 md:p-5 space-y-4">
                    <h3 className='font-medium'>I. Process and procedures for purchasing products</h3>
                    <div className="text-base leading-relaxed text-gray-600">
                        <h3 className='font-medium text-black'>1. Purchasing conditions</h3>
                        <p>To minimize risks, the store applies strict pawning conditions. When pawning items, you must ensure:</p>
                        <ol className='list-decimal pl-10'>
                            <li>Vietnamese citizens aged 18 and over</li>
                            <li>Have documents proving personal information such as: ID card/CCCD, passport (valid), diploma, license,...</li>
                            <li>There are all types of documents proving property ownership such as: purchase invoices, inspection papers.</li>
                        </ol>
                        <p><span className='text-red-500 font-bold'>Note: { }</span>In case the property is jewelry, gold, or diamonds without documents; We still accept mortgages but need to verify longer. We hope for your understanding and cooperation.</p>
                        <h3 className='font-medium text-black'>2. Pawnshop process and procedures:</h3>
                        <ol className='list-disc pl-10'>
                            <li>Step 1: Customer presents jewelry purchase invoice and identification documents. Acceptable identification documents are: CCCD, passport or driver's license.</li>
                            <li>Step 2: Inspect jewelry. Experts will check the quality and value of your jewelry. Make sure your jewelry is in the best condition to command a high price.</li>
                            <li>Step 3: Price and seal the jewelry. After evaluating and agreeing on the mortgage value. The property will be carefully sealed in your presence.</li>
                            <li>Step 4: Give money and receipt.</li>
                        </ol>
                    </div>

                </div>
            </div>
        </div>
        <div id="popupRE3" className={clsx(styles.overlay)}>
            <div className={clsx(styles.popup)}>
                <a className={clsx(styles.close)} href='#'>&times;</a>
                <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                        REFUND POLICY
                    </h3>
                </div>

                <div class="p-4 md:p-5 space-y-4">
                    <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                        With less than a month to go before the European Union enacts new consumer privacy laws for its citizens, companies around the world are updating their terms of service agreements to comply.
                    </p>
                    <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                        The European Union’s General Data Protection Regulation (G.D.P.R.) goes into effect on May 25 and is meant to ensure a common set of data rights in the European Union. It requires organizations to notify users as soon as possible of high-risk data breaches that could personally affect them.
                    </p>
                </div>
            </div>
        </div>

    </>)

}

export default Warranty