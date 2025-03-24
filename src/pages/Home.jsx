// src/pages/Home.jsx

import axios from 'axios';
import React, { useRef, useState } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import Markdown from 'react-markdown';
import Quiz from './Quiz';
import api from '../api';

function Home(props) {
    

    return (
        <div>
            <h1>인덱스 페이지 입니다.</h1>
            <button onClick={()=>{
                api.get("/ping")
                .then(res=>{
                    alert(res.data);
                })
                .catch(error=>{
                    alert("응답하지 않음");
                });
            }}>Ping 요청 해보기</button>

        </div>
    );
}


export default Home;