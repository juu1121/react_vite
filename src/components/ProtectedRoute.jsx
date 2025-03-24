import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

//{children}에 <UserDetail> 태그로 감싸진 컨포넌트가 들어온다.
function ProtectedRoute({children}) { 
    //로그인여부를 알기위해 userInfo를 얻어낸다.
    const userInfo = useSelector(state=>state.userInfo);

    if(!userInfo){

        return <Navigate to="/" />
    }

    return children;
}

export default ProtectedRoute;