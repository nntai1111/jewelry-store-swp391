import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { toast } from 'react-toastify';

const PaymentReturn = () => {
    const location = useLocation();
    const [message, setMessage] = useState('');
    const params = new URLSearchParams(location.search);
    const vnp_ResponseCode = params.get('vnp_ResponseCode');
    const orderId = params.get('vnp_OrderInfo')?.split(' ')[0];
    const paymentId = params.get('vnp_OrderInfo')?.split(' ')[2];
    const navigate = useNavigate();
    useEffect(() => {

        if (vnp_ResponseCode === '00') {
            setMessage('Payment successful!');
            toast.success('Payment successful!');
        } else {
            setMessage(`Payment failed. Error code: ${vnp_ResponseCode}`);
            toast.error(`Payment failed. Error code: ${vnp_ResponseCode}`);
        }

        // Optionally, you can send the callback data to your server for further processing
        // axios.post('/your-server-endpoint', { orderId, paymentId, vnPayResponseCode });
    }, [location]);
    const handleBack = () => {
        navigate(-3); // Quay lại trang trước đó
    };
    return (
        <div>
            <h2>Payment Status</h2>
            <p>{message}</p>
            {/* <p>{params}</p> */}
            <button
                onClick={handleBack}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                {/* <FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> */}
                Back
            </button>
        </div>
    );
};

export default PaymentReturn;





