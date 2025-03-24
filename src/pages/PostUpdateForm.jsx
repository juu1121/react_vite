// src/pages/PostUpdateForm.jsx

import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Button, FloatingLabel, Form } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { initEditor } from '../editor/SmartEditor';
import AlertModal from '../components/AlertModal';
import api from '../api';

function PostUpdateForm(props) {
    //수정할 글번호 추출 "/posts/:num/edit" 에서 num 에 해당되는 경로 파라미터 값 읽어오기
    const {num} = useParams();

    //SmartEditor 에 작성한 내용을 textarea 의 value 로 넣어 줄때 필요한 함수가 editorTool 이다 
    const [editorTool, setEditorTool] = useState([]);

    //월래 글의 내용을 state 에 저장해 놓는다.
    const [savedData, setSavedData] = useState({});

    // component 가 활성화 되는 시점에 호출되는 함수 
    useEffect(()=>{
        // initEditor() 함수를 호출해야 SmartEditor 가 초기화 된다.
        setEditorTool(initEditor("content"));

        //비동기로 동작(호출하면 바로 리턴하지만 안에 있는 code 는 모두 실행된 상태가 아닌 비동기 함수)
        const fetchPost = async ()=>{
            try{
                const res = await api.get(`/posts/${num}`);
                //글정보를 콘솔창에 출력하기
                console.log(res.data);
                //글 제목과 내용을  input 요소에 넣어주기 
                inputTitle.current.value=res.data.title;
                inputContent.current.value=res.data.content;
                //글정보를 저장해 놓는다.
                setSavedData(res.data);
            }catch(error){
                console.log(error);
            }
        };
        fetchPost();
        console.log("fetchPost() 함수 호출함");
    }, []);

    //제목을 입력할 input type="text" 와  내용을 입력할 textarea 의 참조값을 관리하기 위해 
    const inputTitle=useRef();
    const inputContent=useRef();

    const handleSubmit = (e)=>{
        e.preventDefault();
        //에디터 tool 을 이용해서 SmartEditor 에 입력한 내용을 textarea 의 value 값으로 변환
        editorTool.exec();
        //입력한 제목과 내용을 읽어와서
        const title=inputTitle.current.value;
        const content=inputContent.current.value;
        //수정반영 요청을 하는 비동기 함수
        const updatePost = async ()=>{
            try{
                const res = await api.patch(`/posts/${num}`, {title, content});
                console.log(res.data);
                //모달을 띄운다음 글자세히 보기로 이동되도록 한다.
                setShowModal(true);
            }catch(error){
                console.log(error);
            }
        };
        updatePost();
    }

    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const handleReset = (e)=>{
        e.preventDefault(); //기본 이벤트 막아주기 (reset) (리셋이 알아서 되면 안되니까~)
        // title 을 원상복구
        inputTitle.current.value=savedData.title;
        // smart editor 에 출력된 내용 원상 복구
        editorTool.setContents(savedData.content);
    };
    return (
        <>
            <AlertModal show={showModal} message="수정했습니다" onYes={()=>{
                navigate(`/posts/${num}`);
            }}/>
            <h1>글 수정 양식 입니다</h1>
            <Form>
                <FloatingLabel label="제목" className='mb-3' controlId='title'>
                    <Form.Control ref={inputTitle} type="text"/>
                </FloatingLabel>
                <Form.Group className='mb-3' controlId='content'>
                    <Form.Label>내용</Form.Label>
                    <Form.Control ref={inputContent} as="textarea" style={{height:"300px"}}/>
                </Form.Group>
                <Button type="submit" onClick={handleSubmit}>수정확인</Button>
                <Button type="reset" variant='danger' onClick={handleReset}>취소</Button>
            </Form>
        </>
    );
}

export default PostUpdateForm;