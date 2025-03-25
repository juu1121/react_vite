import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

//{children}에 <UserDetail> 태그로 감싸진 컨포넌트가 들어온다.
function ProtectedRoute({children}) { 
    //로그인여부를 알기위해 userInfo를 얻어낸다.
    const userInfo = useSelector(state=>state.userInfo);
    //현재 경로를 알아내기 위해 
    const location = useLocation(); //현재 url의 위치 알아내는 훅
    //action을 발행하기 위해
    const dispatch = useDispatch();
    //만일 로그인 상태가 아니라면
    if(!userInfo){
        //원래 가려던 목적지 정보와 query 파라미터 정보를 읽어내서
        const url = location.pathname + location.search;

        //테스트로 출력해보기
        //console.log(url);
        const payload = {
            show:true,
            title:"해당 페이지는 로그인이 필요합니다.",
            url:url
        }
        //로그인창을 띄우는 action을 발행하면서 payload를 전달한다.
        dispatch({type:"LOGIN_MODAL", payload});
        //return null하면 current에 빈 페이지가 출력된다.
        return null;
        //return <Navigate to="/" />
    }

    return children;
}

export default ProtectedRoute;