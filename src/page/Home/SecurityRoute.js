import React from 'react';
import { Route, Navigate } from 'react-router-dom';

import path from '../../ultis/path'; // Đảm bảo có đường dẫn cần thiết

// Kiểm tra xem người dùng có quyền truy cập vào trang seller hay không
const SecurityRoute = ({ element, ...rest }) => {
    // Kiểm tra vai trò của người dùng (có thể từ lưu trữ trạng thái, localStorage, hoặc context)
    // const userRole = getUserRole(); // Hàm này cần phải tự định nghĩa
    const userRole = 'admin';
    // Nếu người dùng có vai trò là seller, cho phép truy cập vào trang seller, ngược lại, chuyển hướng đến trang đăng nhập
    return userRole === 'admin' ? <Route {...rest} element={element} /> : <Navigate to={path.LOGIN} />;
};

export default SecurityRoute;

