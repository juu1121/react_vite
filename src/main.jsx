import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './router';
// legacy_createStore 를 createStore 라는 이름으로 사용하기 (store 를 만들 함수)
import { legacy_createStore as createStore } from 'redux';
import { Provider } from 'react-redux';

// redux store 에서 관리될 state 의 초기값
const initState={
  userInfo:null,
  loginModal:{
    title:"",
    show:false
  },
  logoutTimer:null
};

//reducer 함수
const reducer = (state=initState, action)=>{
  let newState;
  if(action.type === "USER_INFO"){
    newState={
      ...state,
      userInfo:action.payload
    }
  }else if(action.type === "LOGIN_MODAL"){
    newState={
      ...state,
      loginModal:action.payload
    }
  }else if(action.type === "LOGOUT_TIMER"){
    newState={
      ...state,
      logoutTimer:action.payload
    };
  }else {
    newState=state;
  }
  return newState;
};

// reducer 함수를 전달하면서 store(저장소) 를 만든다.
const store = createStore(reducer);

// id 가 root 인 div 안을  App.js 에서 리턴해준 component 로 체우기 
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}/>
    </Provider> 
  </React.StrictMode>
);
