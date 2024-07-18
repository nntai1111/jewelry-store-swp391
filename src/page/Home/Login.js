// import React, { useState } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faRotateLeft, faEyeSlash, faEye, faSpinner } from '@fortawesome/free-solid-svg-icons';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import axios from 'axios';
// // import backgroundVideo from '../../assets/swp_video4K.mp4';

// export default function LoginToStore() {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [isShowPassword, setIsShowPassword] = useState(false);
//   const [loadingApi, setLoadingApi] = useState(false);

//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     if (!username || !password) {
//       toast.error('Username/Password is required!!!');
//       return;
//     }
//     setLoadingApi(true);
//     try {
//       const data = await axios.post('https://jssatsproject.azurewebsites.net/api/login', {
//         username: username,
//         password: password,
//       });
//       const user = data.data;
//       if (user && user.token) {
//         localStorage.setItem('token', user.token);
//         localStorage.setItem('role', user.role);
//         localStorage.setItem('staffId', user.staffId);
//         localStorage.setItem('name', user.name);
//         switch (user.role) {
//           case 'admin':
//             navigate('/admin/Dashboard');
//             break;
//           case 'seller':
//             navigate('/public');
//             break;
//           case 'manager':
//             navigate('/manager/Dashboard');
//             break;
//           case 'cashier':
//             navigate('/cs_public/cs_order/cs_waitingPayment');
//             break;
//           default:
//             toast.error('Unknown user role');
//             break;
//         }
//       }
//     } catch (error) {
//       toast.error('Invalid username or password');
//     }
//     setLoadingApi(false);
//   };

//   return (
//     <div className="h-screen w-full flex items-center justify-center relative">
//       <video
//         className="absolute top-0 left-0 w-full h-full object-cover"
//         autoPlay
//         loop
//         muted
//       />
//       <div className="bg-white bg-opacity-5 backdrop-blur-md p-8 rounded-lg shadow-lg w-full max-w-md ">
//         <h2 className="text-3xl font-bold mb-6 font-dancing text-center text-white">Jewelry Store</h2>
//         <div className="relative mb-4">
//           <input
//             type="text"
//             placeholder="Username..."
//             value={username}
//             onChange={(event) => setUsername(event.target.value)}
//             className=" w-full p-3 text-sm text-white bg-transparent border border-gray-300 rounded-lg placeholder-gray-300 focus:outline-none focus:border-blue-400 transition-colors duration-200"
//           />
//         </div>
//         <div className="relative mb-6">
//           <input
//             type={isShowPassword ? 'text' : 'password'}
//             placeholder="Password..."
//             value={password}
//             onChange={(event) => setPassword(event.target.value)}
//             className="w-full p-3 text-sm text-white bg-transparent border border-gray-300 rounded-lg placeholder-gray-300 focus:outline-none focus:border-blue-400 transition-colors duration-200"
//           />
//           <span className="absolute right-3 top-3 cursor-pointer text-gray-300">
//             <FontAwesomeIcon
//               icon={isShowPassword ? faEye : faEyeSlash}
//               onClick={() => setIsShowPassword(!isShowPassword)}
//             />
//           </span>
//         </div>
//         <button
//           className={`w-full py-3 font-bold text-black bg-white rounded-lg hover:bg-black hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 transition-opacity duration-200 ${username && password ? 'opacity-100' : 'opacity-50'
//             }`}
//           disabled={!username || !password}
//           onClick={() => handleLogin()}
//         >
//           {loadingApi && (
//             <FontAwesomeIcon
//               icon={faSpinner}
//               className="fa-spin-pulse fa-spin-reverse fa-1.5x me-2"
//             />
//           )}
//           Login
//         </button>
//       </div>

//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateLeft, faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import clsx from 'clsx';
import style from './Login.module.css';
import axios from 'axios';

export default function LoginToStore() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [username1, setUsername1] = useState('');
  const [password1, setPassword1] = useState('');
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [loadingApi, setLoadingApi] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    localStorage.clear();
  }, []);

  const handleLogin = async () => {
    if (!username || !password) {
      // toast.error('Username/Password is required!!!');
      return;
    }
    setLoadingApi(true);
    try {
      const data = await axios.post('https://jssatsproject.azurewebsites.net/api/login', {
        username: username,
        password: password,

      });
      // console.log('>>> check res dta', data)
      const user = data.data;
      // console.log('>>> check user', user)
      if (user && user.token) {
        localStorage.setItem('token', user.token);
        localStorage.setItem('role', user.role);
        localStorage.setItem('staffId', user.staffId);
        localStorage.setItem('name', user.name);
        switch (user.role) {
          case 'admin':
            navigate('/admin/Dashboard');
            break;
          case 'seller':
            navigate('/public');
            break;
          case 'manager':
            navigate('/manager/Dashboard');
            break;
          case 'cashier':
            navigate('/cs_public/cs_order/cs_waitingPayment');
            break;
          // Add more cases for other roles if needed
          default:
            toast.error('Unknown user role');
            break;
        }
      }

    } catch (error) {
      toast.error('Invalid username or password');
    }
    setLoadingApi(false);
  };
  useEffect(() => {
    handleLogin();
  }, [username, password]);
  const handleAdminLogin = () => {
    setUsername('admin_user');
    setPassword('admin_password');
    // handleLogin();
  };
  const handleManageLogin = () => {
    setUsername('manager_user1');
    setPassword('manager_password1');
    // handleLogin();
  };
  const handleSellerLogin = () => {
    setUsername('seller_user1');
    setPassword('seller_password1');
    // handleLogin();
  };

  const handleCashierLogin = () => {
    setUsername('cashier_user1');
    setPassword('cashier_password1');
    // handleLogin();
  };
  const ChangeUserPassword = () => {
    setUsername(username1);
    setPassword(password1);
    // handleLogin();
  };

  return (

    <div className='flex justify-center m-10 space-x-4 mt-96'>
      <span
        onClick={handleAdminLogin}
        className="bg-blue-500 text-white font-bold py-4 px-8 rounded cursor-pointer text-4xl hover:bg-blue-600 transition duration-300 ease-in-out"
      >
        Admin
      </span>
      <span
        onClick={handleManageLogin}
        className="bg-blue-500 text-white font-bold py-4 px-8 rounded cursor-pointer text-4xl hover:bg-blue-600 transition duration-300 ease-in-out"
      >
        Manager
      </span>
      <span
        onClick={handleSellerLogin}
        className="bg-blue-500 text-white font-bold py-4 px-8 rounded cursor-pointer text-4xl hover:bg-blue-600 transition duration-300 ease-in-out"
      >
        Seller
      </span>
      <span
        onClick={handleCashierLogin}
        className="bg-blue-500 text-white font-bold py-4 px-8 rounded cursor-pointer text-4xl hover:bg-blue-600 transition duration-300 ease-in-out"
      >
        Cashier
      </span>
    </div>


  );
}

