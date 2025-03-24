import React, { useEffect, useRef, useState } from 'react';
import { Button, FloatingLabel, Form } from 'react-bootstrap';
import { initEditor } from '../editor/SmartEditor';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AlertModal from '../components/AlertModal';
import api from '../api';

function PostFrom(props) {
    //SmartEditor에 작성한 내용을 textarea의 value로 넣어 줄 때 필요한 함수가 editorTool이다.
    const [editorTool, setEditorTool] = useState([])

    useEffect(()=>{
        //initEditor()함수를 호출하면서 SmartEditor로 변환할 textarea의 id를 전달하면
        //textarea가 SmartEditor로 변경되면서 에디터 tool객체가 리턴된다.
        setEditorTool(initEditor("content")); //initEditor()함수를 호출해야 SmartEditor 가 초기화된다. 
    }, [])

    //입력한 내용을 얻어오기 위한 useRef()
    const inputTitle=useRef()
    const inputContent=useRef()
    //경로 이동을 할 함수
    const navigate = useNavigate()

    //알림 모달을 띄울지 말지 state로 관리하기기
    const [modalShow, setModalShow] = useState(false);

    return (
        <>
            <AlertModal show={modalShow} message="새글을 저장했습니다." onYes={()=>{
                navigate("/posts");
                setModalShow(false);
            }}/>
            <h1>새 글 추가 양식 입니다.</h1>
            <Form>
                <FloatingLabel label="제목" className="mb-3" controlId="title">
                    <Form.Control ref={inputTitle} type="text" placeholder="제목 입력..."/>
                </FloatingLabel>
                <Form.Group className="mb-3"  controlId="content">
                    <Form.Label>내용</Form.Label>
                    <Form.Control ref={inputContent} as="textarea" rows="10"/> 
                </Form.Group> 
                <Button type="submit" onClick={(e)=>{
                    //폼 제출 막기
                    e.preventDefault();
                    //에디터 tool을 이용해서 SmartEditor에 입력한 내용을 textarea의 value값으로 변환
                    editorTool.exec();
                    //입력한 제목과 내용을 읽어와서
                    const title = inputTitle.current.value;
                    const content = inputContent.current.value;
                    //axios를 이용해서 api서버에 전송
                    api.post("/posts", {title, content})
                    .then(res=>{
                        //alert("저장했습니다."); //이거대신 모달을 사용!
                        setModalShow(true);
                    })
                    .catch(error=>{
                        console.log(error);
                    })
                }}>저장</Button>
            </Form>
        </>
    );
}

export default PostFrom;