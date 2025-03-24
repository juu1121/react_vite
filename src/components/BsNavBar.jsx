// src/components/BsNavBar.jsx

import axios from 'axios';
import React from 'react';
import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';

function BsNavBar(props) {
    //store 의 상태값을 바꿀 함수
    const dispatch = useDispatch();
    //redux store 로 부터 상태값 가져오기 
    const userInfo=useSelector(state=>state.userInfo);
    // route 이동을 하기 위한 hook
    const navigate=useNavigate();
    //로그아웃 타이머
    const logoutTimer=useSelector(state=>state.logoutTimer);

    return (
        <>
            <Navbar fixed="top" expand="md" className="bg-warning mb-2">
                <Container>
                    <Navbar.Brand as={NavLink} to="/">Acorn</Navbar.Brand>
                    <Navbar.Toggle aria-controls="one"/>
                    <Navbar.Collapse id="one">
                        <Nav className='me-auto'>
                            <Nav.Link as={NavLink} to="/">Home</Nav.Link>
                            <Nav.Link as={NavLink} to="/posts">Post</Nav.Link>
                            <Nav.Link as={NavLink} to="/quiz">Quiz</Nav.Link>
                        </Nav>
                        { userInfo ? 
                            <>
                                <Nav>
                                    <Nav.Link as={Link} to="/user/detail">{userInfo.userName}</Nav.Link>
                                    <span className="navbar-text">Signed in</span>
                                </Nav>
                                <Button className='ms-1' size='sm' variant='outline-primary' onClick={()=>{
                                    const isLogout = window.confirm("확인을 누르면 로그아웃됩니다!");
                                    if(!isLogout)return;
                                    //토큰 삭제
                                    delete localStorage.token;
                                    // store 에 userInfo 를 초기화
                                    dispatch({type:"USER_INFO", payload:null});
                                    //인덱스로 이동
                                    navigate("/");
                                    //로그아웃 타이머 초기화
                                    clearTimeout(logoutTimer);
                                    dispatch({
                                        type:"LOGOUT_TIMER",
                                        payload:null
                                    })
                                }}>Logout</Button>
                            </>
                         :  
                            <>
                                <Button size="sm" variant='success' onClick={()=>{
                                    const action={type:"LOGIN_MODAL", payload:{
                                        title:"로그인 폼 입니다",
                                        show:true
                                    }};
                                    dispatch(action);
                                }}>Sign in</Button>
                                <Button className='ms-1' size="sm" variant='primary'>Sign up</Button>
                            </>
                        }
                        
                    </Navbar.Collapse>
                </Container>
            </Navbar> 
        </>
    );
}

export default BsNavBar;