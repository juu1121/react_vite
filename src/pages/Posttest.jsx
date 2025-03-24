// src/pages/Posttest.jsx
//페이징처리만 한거!! + 검색조건 달아서서, 주소창변경까지만 시킴 = 아직 검색조건에 맞는 list뿌리기 전!!

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Form, Pagination, Table } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api';

function Posttest(props) {

    // "/posts?pageNum=x" 에서 pageNum 을 추출하기 위한 hook
    //ex) /post?page=10&count5&keword=kim  => {pageNum:"10", count:"5", keywork:"kim"} params에는 오브젝트로 읽어준다.(숫자도 문자열로 읽어줌줌)
    const [params, setParams] = useSearchParams({pageNum:1}); 

    //글 정보를 상태값으로 관리
    const [pageInfo, setPageInfo] = useState({
        list:[]
    });

    //글 목록 데이터를 새로 읽어오는 함수
    const refresh = (pageNum)=>{
        api.get(`/posts?pageNum=${pageNum}`)
        .then(res=>{
            setPageInfo(res.data);
            //페이징 숫자 배열을 만들어서 state 에 넣어준다.
            setPageArray(range(res.data.startPageNum, res.data.endPageNum));
        })
        .catch(error=>{
            console.log(error);
        });
    };

    //페이징 숫자를 출력할때 사용하는 배열을 상태값으로 관리
    const [pageArray, setPageArray]=useState([]);

    useEffect(()=>{
        //query 파라미터 값을 읽어와 본다
        let pageNum=params.get("pageNum")
        //만일 존재 하지 않는다면 1 페이지로 설정
        if(pageNum==null)pageNum=1
        //해당 페이지의 내용을 원격지 서버로 부터 받아온다 
        refresh(pageNum)
    }, [params]);

    //페이지를 이동할 hook
    const navigate = useNavigate()
   
    //페이징 UI 를 만들때 사용할 배열을 리턴해주는 함수 
    function range(start, end) {
        const result = [];
        for (let i = start; i <= end; i++) {
            result.push(i);
        }
        return result;
    }
//나혼자
    //navigate()함수를 이용해서 페이지를 변경하는 함수
    const move = (pageNum) =>{
        navigate(`/posts?pageNum=${pageNum}`)
    }    

    // 검색 상태 관리 //컨디션이 null일 경우 초기값설정정
    const [condition, setCondition] = useState(params.get("condition") || "title_content");
    const [keyword, setKeyword] = useState(params.get("keyword") || "");

    // 검색 실행 함수
    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/post/list?condition=${condition}&keyword=${keyword}`);
}; 

    return (
        <>
            <h1>글 목록 입니다</h1>
            <Table striped bordered size="sm">
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>제목</th>
                        <th>작성자</th>
                        <th>조회수</th>
                        <th>등록일</th>
                    </tr>
                </thead>
                <tbody>
                {
                    pageInfo.list.map(item =>
                        <tr key={item.num}>
                            <td>{item.num}</td>
                            <td>{item.title}</td>
                            <td>{item.writer}</td>
                            <td>{item.viewCount}</td>
                            <td>{item.createdAt}</td>
                        </tr>
                    )
                }  
                </tbody>
            </Table>
            <Pagination className='mt-3'>
                <Pagination.Prev className={`${pageInfo.startPageNum === 1 ? 'disabled':''}`} onClick={(e)=>{
                    e.preventDefault();
                    move(pageInfo.endPageNum-1);                    
                }}></Pagination.Prev>
                {
                    pageArray.map(item => 
                        <Pagination.Item className={`${pageInfo.pageNum ===item? 'active':''}`} onClick={(e)=>{
                            e.preventDefault(); //링크의 기본동작 막기
                            move(item);
                        }}>{item}</Pagination.Item>
                    )
                }
                <Pagination.Next className={`${pageInfo.totalPageCount > pageInfo.endPageNum ? '':'disabled'}`} onClick={(e)=>{
                    e.preventDefault();
                    move(pageInfo.endPageNum+1);
                }}></Pagination.Next>
            </Pagination>   

            <Form className="d-flex mb-3" onSubmit={handleSearch}>
                <Form.Select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    style={{ width: "150px" }}
                >
                    <option value="title_content">제목 + 내용</option>
                    <option value="title">제목</option>
                    <option value="writer">작성자</option>
                </Form.Select>
                <Form.Group>
                    <Form.Control value={keyword}  onChange={(e) => {setKeyword(e.target.value)}} laceholder="검색어 입력"/>
                </Form.Group>
                <Button type="submit" variant="success" size="sm"> 검색 </Button>
            </Form>

        </>
    );
}

export default Posttest;